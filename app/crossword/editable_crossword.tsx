'use client'

import { useState } from 'react';
import './crossword.css';

const SQUARE_PIXELS = 24;

function EditableSquare() {
    const[text, setText] = useState('');

    function onInsertText(e: React.FormEvent<HTMLInputElement>) {
        const newText = e.currentTarget.value;
        if (text.length == 0 || newText == '') {
            setText(newText.toUpperCase());
        }
    }

    return (
        <div className="crossword-square size-[40px] border-2 border-black border-b-0 box-content">
            <input className="crossword-input" value={text} onInput={onInsertText}></input>
        </div>
    );
}

export default function EditableCrossword() {
    const NUM_ROWS = 15;
    const NUM_COLUMNS = 15;
    const numSquares = NUM_ROWS * NUM_COLUMNS;
    const squares = []
    for (let i=0; i<numSquares; i++) {
        squares.push(<EditableSquare key={`square-${i}`}></EditableSquare>)
    }
    const style = {width: `${NUM_COLUMNS * 40}px`} // TODO: make 24 a constant
    return (
        <div className={`crossword grid grid-cols-${NUM_COLUMNS} grid-flow-row  border-b-2 border-black box-content`} style={style}>
            {squares}
        </div>
    );
}