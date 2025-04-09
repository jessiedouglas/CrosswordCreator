'use client'

import { useState } from 'react';
import { EditMode } from './page_crossword_edit';
import './crossword.css';
import { Crossword, SquareColor } from '../models/crossword';


interface EditableCrosswordSettings {
    crossword: Crossword;
    editMode: EditMode;
}

interface EditableSquareSettings {
    color: SquareColor;
    editMode: EditMode;
    index: number;
    updateSquare: Function;
    value: string;
}

function EditableSquare({color, editMode, index, updateSquare, value}: EditableSquareSettings) {
    const [boxColor, updateBoxColor] = useState(color);
    const [text, updateText] = useState(value);

    function onInsertText(e: React.FormEvent<HTMLInputElement>) {
        const newText = e.currentTarget.value;
        if (text.length == 0 || newText == '') {
            updateText(newText.toUpperCase());
            updateSquare(index, boxColor, text);
        }
    }

    function onBoxToggle() {
        if (boxColor == SquareColor.WHITE) {
            color = SquareColor.BLACK;
        } else {
            color = SquareColor.WHITE;
        }
        updateBoxColor(color);
        updateSquare(index, boxColor, text);
    }

    let content;
    const style = {backgroundColor: boxColor};
    if (editMode == EditMode.TEXT) {
        content = <input className="crossword-input" data-testid="crossword-input" value={text} style={style} onInput={onInsertText}></input>;
    } else {
        content = <div className="crossword-input size-full" data-testid="inner-box" style={style} onClick={onBoxToggle}>{text}</div>;
    }

    return (
        <div className="crossword-square size-[40px] border-2 border-black border-b-0 box-content" data-testid="crossword-square">
            {content}
        </div>
    );
}

export function EditableCrossword({crossword, editMode}: EditableCrosswordSettings) {
    if (editMode == EditMode.UNSPECIFIED || editMode == undefined) {
        throw new Error("Unspecified EditMode");
    }

    function updateSquare(index: number, color: SquareColor, value: string) {
        crossword.squares[index].color = color;
        crossword.squares[index].value = value;
    }

    const NUM_COLUMNS = 15;
    const squareElements = [];
    for (let i=0; i<crossword.squares.length; i++) {
        const square = crossword.squares[i];
        squareElements.push(<EditableSquare index={i} color={square.color} value={square.value} editMode={editMode} updateSquare={updateSquare} key={`square-${i}`}></EditableSquare>)
    }
    const style = {width: `${NUM_COLUMNS * 40}px`} // TODO: make 24 a constant
    return (
        <div className={`crossword grid grid-cols-${NUM_COLUMNS} grid-flow-row  border-b-2 border-black box-content`} style={style}>
            {squareElements}
        </div>
    );
}