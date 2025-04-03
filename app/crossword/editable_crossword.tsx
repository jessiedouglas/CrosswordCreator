'use client'

import { useState } from 'react';
import './crossword.css';

const SQUARE_PIXELS = 24;

function EditableSquare({editMode}: {editMode: EditMode}) {
    const [text, setText] = useState('');
    const [boxColor, setBoxColor] = useState('white');

    function onInsertText(e: React.FormEvent<HTMLInputElement>) {
        const newText = e.currentTarget.value;
        if (text.length == 0 || newText == '') {
            setText(newText.toUpperCase());
        }
    }

    function onBoxToggle(e: React.FormEvent<HTMLElement>) {
        if (boxColor == 'white') {
            setBoxColor('black');
            setText('');
        } else {
            setBoxColor('white');
        }
    }

    let content;
    if (editMode == EditMode.TEXT) {
        content = <input className="crossword-input" value={text} onInput={onInsertText}></input>;
    } else {
        let style = {backgroundColor: boxColor};
        content = <div className="size-full" style={style} onClick={onBoxToggle}></div>;
    }

    return (
        <div className="crossword-square size-[40px] border-2 border-black border-b-0 box-content">
            {content}
        </div>
    );
}

export enum EditMode {
    UNSPECIFIED,
    TEXT,
    TOGGLE_BLACK
}

export function EditableCrossword({editMode}: {editMode: EditMode}) {
    if (editMode == EditMode.UNSPECIFIED || editMode == undefined) {
        throw new Error("Unspecified EditMode");
    }
    const NUM_ROWS = 15;
    const NUM_COLUMNS = 15;
    const numSquares = NUM_ROWS * NUM_COLUMNS;
    const squares = []
    for (let i=0; i<numSquares; i++) {
        squares.push(<EditableSquare editMode={editMode} key={`square-${i}`}></EditableSquare>)
    }
    const style = {width: `${NUM_COLUMNS * 40}px`} // TODO: make 24 a constant
    return (
        <div className={`crossword grid grid-cols-${NUM_COLUMNS} grid-flow-row  border-b-2 border-black box-content`} style={style}>
            {squares}
        </div>
    );
}