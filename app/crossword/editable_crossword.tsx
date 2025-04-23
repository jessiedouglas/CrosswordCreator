'use client'

import { useEffect, useRef, useState } from 'react';
import { EditMode, SymmetryMode } from './page_crossword_edit';
import './crossword.css';
import { getNextNonBlackEmptySquare, getPreviousNonBlackSquare } from '../helpers/square_navigators';
import { Crossword, duplicateCrossword, Square, SquareColor } from '../models/crossword';


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
}

function EditableSquare({index, square, editMode, updateSquare, handleBackspace, activateSquare}: EditableSquareSettings) {
    function onInsertText(e: React.FormEvent<HTMLInputElement>) {
        const newText = e.currentTarget.value;
        if (!square.value && newText) {
            square.value = newText.toUpperCase();
            updateSquare(index, square);
        }
    }

    function onBackspace(e: React.KeyboardEvent<HTMLInputElement>) {
        if (e.key == "Backspace") {
            handleBackspace(index);
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

    let content;
    const textBackground = square.active ? "rgba(252, 247, 88, 0.2)" : "rgba(1, 1, 1, 0)";
    const style = {
        backgroundColor: square.color == SquareColor.BLACK ? "rgb(0, 0, 0)" : textBackground 
    };
    if (editMode == EditMode.TEXT) {
        content = <input className="crossword-input" data-testid="crossword-input" value={square.value} style={style} disabled={square.color == SquareColor.BLACK} onInput={onInsertText} onFocus={onFocus} onKeyUp={onBackspace} ref={inputRef} />;
    } else {
        content = <div className="crossword-input size-full" data-testid="inner-box" style={style} onClick={onBoxToggle}>{square.value}</div>;
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
            const nextSquare = getNextNonBlackEmptySquare(index, crossword);
            nextSquare.active = true;
        } 
        setCrossword(duplicateCrossword(crossword));
    }

    const handleBackspace = (index: number) => {
        const square = crossword.squares[index];
        square.active = false;
        // Value deleted; auto-advance backward for easy multi-deletion
        const prevSquare = getPreviousNonBlackSquare(index, crossword);
        prevSquare.value = '';
        prevSquare.active = true;
        setCrossword(duplicateCrossword(crossword));
    }

    const activateSquare = (index: number) => {
        for (let i=0; i<crossword.squares.length; i++) {
            if (index == i) {
                crossword.squares[i].active = true;
            } else {
                crossword.squares[i].active = false;
            }
        }
        setCrossword(duplicateCrossword(crossword));
    }

    const squareElements = [];
    for (let i=0; i<crossword.squares.length; i++) {
        squareElements.push(<EditableSquare index={i} square={crossword.squares[i]} editMode={editMode} updateSquare={updateSquare} handleBackspace={handleBackspace} activateSquare={activateSquare} key={`square-${i}`}></EditableSquare>);
    }
    const style = {width: `${crossword.dimensions.width * 40}px`}
    return (
        <div className={`crossword grid grid-cols-${crossword.dimensions.width} grid-flow-row border-r-2 border-b-2 border-black box-content`} style={style}>
            {squareElements}
        </div>
    );
}