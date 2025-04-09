'use client'

import { useState } from 'react';
import './crossword.css';
import { EditableCrossword } from './editable_crossword';
import { CrosswordSettings } from './crossword_settings';
import { createNewCrossword } from '../models/crossword';

export function PageCrosswordEdit() {
    const crossword = createNewCrossword();
    const [editMode, setEditMode] = useState(EditMode.TOGGLE_BLACK);

    return (
        <div className="flex w-full justify-evenly">
            <EditableCrossword crossword={crossword} editMode={editMode} />
            <CrosswordSettings editMode={editMode} setEditMode={setEditMode} />
        </div>
    );
}

export enum EditMode {
    UNSPECIFIED,
    TEXT,
    TOGGLE_BLACK
}