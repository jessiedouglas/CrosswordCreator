'use client'

import { useState } from 'react';
import './crossword.css';
import { EditableCrossword } from './editable_crossword';
import { CrosswordSettings } from './crossword_settings';
import { createNewCrossword, Crossword } from '../models/crossword';

interface PageCrosswordEditSettings {
    crossword: Crossword;
    setCrossword: (c: Crossword|null) => void;
}

export function PageCrosswordEdit({crossword, setCrossword}: PageCrosswordEditSettings) {
    const [editMode, setEditMode] = useState(EditMode.TOGGLE_BLACK);
    const [symmetryMode, setSymmetryMode] = useState(SymmetryMode.ROTATIONAL);

    return (
        <div className="flex w-full justify-evenly">
            <EditableCrossword crossword={crossword} setCrossword={setCrossword} editMode={editMode} symmetryMode={symmetryMode} />
            <CrosswordSettings editMode={editMode} setEditMode={setEditMode} symmetryMode={symmetryMode} setSymmetryMode={setSymmetryMode} />
        </div>
    );
}

export enum EditMode {
    UNSPECIFIED,
    TEXT,
    TOGGLE_BLACK
}

export enum SymmetryMode {
    UNSPECIFIED,
    ROTATIONAL,
    MIRROR,
    NONE
}