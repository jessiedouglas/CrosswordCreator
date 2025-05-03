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
        <section className="flex flex-col w-full pl-16">
            <input type="text" className="text-5xl w-[602px] mb-4" placeholder="title" />
            <div className="flex w-full">
                <EditableCrossword crossword={crossword} setCrossword={setCrossword} editMode={editMode} symmetryMode={symmetryMode} />
                <div className="min-w-[300px] ml-16">
                    <CrosswordSettings editMode={editMode} setEditMode={setEditModeAndResetActiveSquare} symmetryMode={symmetryMode} setSymmetryMode={setSymmetryMode} />
                    {editMode == EditMode.CLUES && <EditClues crossword={crossword} setCrossword={setCrossword} />}
                </div>
            </div>
        </section>
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