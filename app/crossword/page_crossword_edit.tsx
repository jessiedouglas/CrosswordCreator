'use client'

import { useState } from 'react';
import './crossword.css';
import { EditClues } from './edit_clues';
import { EditableCrossword } from './editable_crossword';
import { CrosswordSettings } from './crossword_settings';
import { Crossword, duplicateCrossword } from '../models/crossword';

interface PageCrosswordEditSettings {
    crossword: Crossword;
    setCrossword: (c: Crossword|null) => void;
}

export function PageCrosswordEdit({crossword, setCrossword}: PageCrosswordEditSettings) {
    const [editMode, setEditMode] = useState(EditMode.TOGGLE_BLACK);
    const [symmetryMode, setSymmetryMode] = useState(SymmetryMode.ROTATIONAL);

    const setEditModeAndResetActiveSquare = (editMode: EditMode): void => {
        // Clear active and inActiveWord settings
        for (let square of crossword.squares) {
            square.active = false;
            square.inActiveWord = false;
        }
        setCrossword(duplicateCrossword(crossword));
        setEditMode(editMode);
    }

    return (
        <div className="flex w-full justify-evenly">
            <EditableCrossword crossword={crossword} setCrossword={setCrossword} editMode={editMode} symmetryMode={symmetryMode} />
            <div>
                <CrosswordSettings editMode={editMode} setEditMode={setEditModeAndResetActiveSquare} symmetryMode={symmetryMode} setSymmetryMode={setSymmetryMode} />
                {editMode == EditMode.CLUES && <EditClues crossword={crossword} />}
            </div>
        </div>
    );
}

export enum EditMode {
    UNSPECIFIED,
    TEXT,
    TOGGLE_BLACK,
    CLUES
}

export enum SymmetryMode {
    UNSPECIFIED,
    ROTATIONAL,
    MIRROR,
    NONE
}