'use client'

import { useState } from 'react';
import { EditMode } from './page_crossword_edit';
import './crossword.css';
import { createNewCrossword, Crossword, duplicateCrossword, Square, SquareColor } from '../models/crossword';


interface EditableCrosswordSettings {
    crossword: Crossword;
    setCrossword: Function;
    editMode: EditMode;
}

interface EditableSquareSettings {
    index: number;
    square: Square;
    editMode: EditMode;
    updateSquare: Function;
}

function EditableSquare({index, square, editMode, updateSquare}: EditableSquareSettings) {
    function onInsertText(e: React.FormEvent<HTMLInputElement>) {
        const newText = e.currentTarget.value;
        if (square.value.length == 0 || newText == '') {
            square.value = newText.toUpperCase();
            updateSquare(index, square);
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

    let content;
    const style = {
        backgroundColor: square.color == SquareColor.WHITE ? "rgba(1, 1, 1, 0)" : "rgba(0, 0, 0, 1)"
    };
    if (editMode == EditMode.TEXT) {
        content = <input className="crossword-input" data-testid="crossword-input" value={square.value} style={style} onInput={onInsertText}></input>;
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

export function EditableCrossword({crossword, setCrossword, editMode}: EditableCrosswordSettings) {
    if (editMode == EditMode.UNSPECIFIED || editMode == undefined) {
        throw new Error("Unspecified EditMode");
    }

    const updateSquare = (index: number, square: Square) => {
        crossword.squares[index] = square;
        setCrossword(duplicateCrossword(crossword));
    }

    const squareElements = [];
    for (let i=0; i<crossword.squares.length; i++) {
        squareElements.push(<EditableSquare index={i} square={crossword.squares[i]} editMode={editMode} updateSquare={updateSquare} key={`square-${i}`}></EditableSquare>);
    }
    const style = {width: `${crossword.dimensions.width * 40}px`}
    return (
        <div className={`crossword grid grid-cols-${crossword.dimensions.width} grid-flow-row border-r-2 border-b-2 border-black box-content`} style={style}>
            {squareElements}
        </div>
    );
}