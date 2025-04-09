'use client'

import { EditMode } from "./page_crossword_edit"

interface CrosswordSettingsSettings {
    editMode: EditMode;
    setEditMode: Function;
}

export function CrosswordSettings({editMode, setEditMode}: CrosswordSettingsSettings) {
    function updateEditMode(e: React.FormEvent<HTMLInputElement>) {
        setEditMode(Number(e.currentTarget.value));
    }

    return (
        <fieldset>
            <legend>Edit mode:</legend>
            <input type="radio" id="mode-text" name="edit-mode" value={EditMode.TEXT} onChange={updateEditMode} defaultChecked={editMode == EditMode.TEXT} data-testid="mode-text-button" />
            <label htmlFor="mode-text">Edit text in squares</label>

            <br />

            <input type="radio" id="mode-toggle" name="edit-mode" value={EditMode.TOGGLE_BLACK} onChange={updateEditMode} defaultChecked={editMode == EditMode.TOGGLE_BLACK} data-testid="mode-toggle-button" />
            <label htmlFor="mode-toggle">Toggle squares black/white</label>
        </fieldset>
    )
}