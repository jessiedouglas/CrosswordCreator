'use client'

import { useEffect, useRef, useState } from 'react';
import { EditMode, SymmetryMode } from './page_crossword_edit';
import './crossword.css';
import { getNextNonBlackEmptySquare, getPreviousNonBlackSquare, getNextNonBlackSquareAbove, getNextNonBlackSquareBelow, getNextNonBlackSquareLeft, getNextNonBlackSquareRight } from '../helpers/square_navigators';
import { Crossword, duplicateCrossword, InputDirection, markActiveWordAndDuplicateCrossword, Square, SquareColor } from '../models/crossword';
import { Input } from 'postcss';


interface EditableCrosswordSettings {
    crossword: Crossword;
    setCrossword: (c: Crossword|null) => void;
    editMode: EditMode;
    symmetryMode: SymmetryMode;
}

interface EditableSquareSettings {
    index: number;
    square: Square;
    editMode: EditMode;
    updateSquare: (i: number, s: Square) => void;
    handleBackspace: (i: number) => void;
    activateSquare: (i: number) => void;
    handleArrowNavigation: (i: number, key: string) => void;
    toggleInputDirection: () => void;
}

const ARROW_KEYS = new Set(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"]);

function EditableSquare({index, square, editMode, updateSquare, handleBackspace, activateSquare, handleArrowNavigation, toggleInputDirection}: EditableSquareSettings) {
    function onInsertText(e: React.FormEvent<HTMLInputElement>) {
        const newText = e.currentTarget.value;
        if (!square.value && newText && newText != " ") {
            square.value = newText.toUpperCase();
            updateSquare(index, square);
        }
    }

    function onKeyUp(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Backspace") {
            handleBackspace(index);
        } else if (ARROW_KEYS.has(e.key)) {
            handleArrowNavigation(index, e.key);
        } else if (e.key == " ") {
            toggleInputDirection();
        }
    }

    function onFocus() {
        if (!square.active) {
            activateSquare(index);
        }
    }

    function onBoxToggle() {
        if (square.color == SquareColor.WHITE) {
            square.color = SquareColor.BLACK;
            square.value = '';
        } else {
            square.color = SquareColor.WHITE;
        }
        updateSquare(index, square);
    }

    // Reference the input element to focus for auto-advance ability
    const inputRef = useRef(null);
    useEffect(() => {
        if (inputRef.current && square.active) {
            (inputRef.current as HTMLInputElement).focus();
        }
    }, [square]);

    let backgroundColor;
    if (square.color == SquareColor.BLACK) {
        // black
        backgroundColor = "rgb(0, 0, 0)";
    } else if (square.active) {
        // light yellow
        backgroundColor = "rgba(252, 247, 88, 0.2)";
    } else if (square.inActiveWord) {
        // light blue
        backgroundColor = "rgba(166, 246, 247, 0.2)";
    } else {
        // white
        backgroundColor = "rgba(1, 1, 1, 0)";
    }
    let content;
    const style = {backgroundColor};
    if (editMode == EditMode.TEXT) {
        content = <input className="crossword-input" data-testid="crossword-input" value={square.value} style={style} disabled={square.color == SquareColor.BLACK} onInput={onInsertText} onFocus={onFocus} onKeyUp={onKeyUp} ref={inputRef} />;
    } else if (editMode == EditMode.TOGGLE_BLACK) {
        content = <div className="crossword-input size-full" data-testid="inner-box" style={style} onClick={onBoxToggle}>{square.value}</div>;
    } else {
        content = <div className="crossword-input size-full" data-testid="inner-box" style={style}>{square.value}</div>;
    }

    return (
        <div className="crossword-square size-[40px] border-t-2 border-l-2 border-black box-content" data-testid="crossword-square">
            {square.number && <div className="square-number absolute z-[-1] pl-[2px]">{square.number}</div>}
            {content}
        </div>
    );
}

export function EditableCrossword({crossword, setCrossword, editMode, symmetryMode}: EditableCrosswordSettings) {
    if (editMode == EditMode.UNSPECIFIED || editMode == undefined) {
        throw new Error("Unspecified EditMode");
    }
    if (!symmetryMode) {
        throw new Error("Unspecified SymmetryMode");
    }
    const [inputDirection, setInputDirection] = useState(InputDirection.ACROSS);

    const updateSquare = (index: number, square: Square) => {
        crossword.squares[index] = square;
        if (editMode == EditMode.TOGGLE_BLACK) {
            if (symmetryMode == SymmetryMode.ROTATIONAL) {
                const symmetricalSquare = crossword.squares[crossword.squares.length - index - 1];
                symmetricalSquare.color = square.color;
            } else if (symmetryMode == SymmetryMode.MIRROR) {
                const column = index % crossword.dimensions.width;
                const symmetricalIndex = index - column + crossword.dimensions.width - 1 - column;
                crossword.squares[symmetricalIndex].color = square.color;
            }
        }
        if (editMode == EditMode.TEXT && square.value) {
            square.active = false;
            const nextSquare = getNextNonBlackEmptySquare(inputDirection, index, crossword);
            nextSquare.active = true;
        }
        crossword = editMode == EditMode.TEXT ? markActiveWordAndDuplicateCrossword(crossword, inputDirection) : duplicateCrossword(crossword);
        setCrossword(crossword);
    }

    const handleBackspace = (index: number) => {
        const square = crossword.squares[index];
        if (square.value) {
            square.value = '';
            crossword = duplicateCrossword(crossword);
        } else {
            square.active = false;
            // Value deleted; auto-advance backward for easy multi-deletion
            const prevSquare = getPreviousNonBlackSquare(inputDirection, index, crossword);
            prevSquare.value = '';
            prevSquare.active = true;
            crossword = markActiveWordAndDuplicateCrossword(crossword, inputDirection);
        }
        setCrossword(crossword);
    }

    const handleArrowNavigation = (index: number, key: string): void => {
        if (!ARROW_KEYS.has(key)) {
            throw new Error(`Key ${key} not valid for navigation`);
        }

        let nextSquare: Square|null;
        if (key == "ArrowUp") {
            nextSquare = getNextNonBlackSquareAbove(index, crossword);
        } else if (key == "ArrowDown") {
            nextSquare = getNextNonBlackSquareBelow(index, crossword);
        } else if (key == "ArrowLeft") {
            nextSquare = getNextNonBlackSquareLeft(index, crossword);
        } else {
            nextSquare = getNextNonBlackSquareRight(index, crossword);
        }
        if (nextSquare) {
            crossword.squares[index].active = false;
            nextSquare.active = true;
        }
        setCrossword(markActiveWordAndDuplicateCrossword(crossword, inputDirection));
    };

    const toggleInputDirection = (): void => {
        let newDirection;
        if (inputDirection == InputDirection.ACROSS) {
            newDirection = InputDirection.DOWN;
        } else {
            newDirection = InputDirection.ACROSS;
        }
        setInputDirection(newDirection);
        crossword = markActiveWordAndDuplicateCrossword(crossword, newDirection);
        setCrossword(crossword);
    }

    const activateSquare = (index: number) => {
        for (let i=0; i<crossword.squares.length; i++) {
            if (index == i) {
                crossword.squares[i].active = true;
            } else {
                crossword.squares[i].active = false;
            }
        }
        setCrossword(markActiveWordAndDuplicateCrossword(crossword, inputDirection));
    }

    const squareElements = [];
    for (let i=0; i<crossword.squares.length; i++) {
        squareElements.push(<EditableSquare index={i} square={crossword.squares[i]} editMode={editMode} updateSquare={updateSquare} handleBackspace={handleBackspace} activateSquare={activateSquare} handleArrowNavigation={handleArrowNavigation} toggleInputDirection={toggleInputDirection} key={`square-${i}`}></EditableSquare>);
    }
    const style = {width: `${crossword.dimensions.width * 40}px`}
    return (
        <div className={`crossword h-fit shrink-0 grid grid-cols-${crossword.dimensions.width} grid-flow-row border-r-2 border-b-2 border-black box-content`} style={style}>
            {squareElements}
        </div>
    );
}