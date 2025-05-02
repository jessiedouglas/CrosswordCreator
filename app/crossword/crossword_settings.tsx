'use client'

import { EditMode, SymmetryMode } from "./page_crossword_edit"

interface CrosswordSettingsSettings {
    editMode: EditMode;
    setEditMode: (editMode: EditMode) => void;
    symmetryMode: SymmetryMode;
    setSymmetryMode: (symmetryMode: SymmetryMode) => void;
}

interface SymmetrySettingsSettings {
    symmetryMode: SymmetryMode;
    setSymmetryMode: (symmetryMode: SymmetryMode) => void;
}

function SymmetrySettings({symmetryMode, setSymmetryMode}: SymmetrySettingsSettings) {
    const parseAndUpdateSymmetry = (e: React.FormEvent<HTMLInputElement>) => {
        setSymmetryMode(Number(e.currentTarget.value));
    };
    
    return (
        <fieldset className="mt-4">
            <legend>Select black square symmetry mode:</legend>
            <input type="radio" id="symmetry-rotational" name="symmetry" value={SymmetryMode.ROTATIONAL} onChange={parseAndUpdateSymmetry} defaultChecked={symmetryMode == SymmetryMode.ROTATIONAL} data-testid="symmetry-rotational-button" />
            <label htmlFor="symmetry-rotational">Rotational</label>

            <br />

            <input type="radio" id="symmetry-mirror" name="symmetry" value={SymmetryMode.MIRROR} onChange={parseAndUpdateSymmetry} defaultChecked={symmetryMode == SymmetryMode.MIRROR} data-testid="symmetry-mirror-button" />
            <label htmlFor="symmetry-mirror">Mirror</label>

            <br />

            <input type="radio" id="symmetry-none" name="symmetry" value={SymmetryMode.NONE} onChange={parseAndUpdateSymmetry} defaultChecked={symmetryMode == SymmetryMode.NONE} data-testid="symmetry-none-button" />
            <label htmlFor="symmetry-none">None</label>
        </fieldset>
    );
}

export function CrosswordSettings({editMode, setEditMode, symmetryMode, setSymmetryMode}: CrosswordSettingsSettings) {
    function updateEditMode(e: React.FormEvent<HTMLInputElement>) {
        setEditMode(Number(e.currentTarget.value));
    }

    return (
        <section>
            <fieldset>
                <legend>Edit mode:</legend>
                <input type="radio" id="mode-text" name="edit-mode" value={EditMode.TEXT} onChange={updateEditMode} defaultChecked={editMode == EditMode.TEXT} data-testid="mode-text-button" />
                <label htmlFor="mode-text">Edit text in squares</label>

                <br />

                <input type="radio" id="mode-toggle" name="edit-mode" value={EditMode.TOGGLE_BLACK} onChange={updateEditMode} defaultChecked={editMode == EditMode.TOGGLE_BLACK} data-testid="mode-toggle-button" />
                <label htmlFor="mode-toggle">Toggle squares black/white</label>

                <br />

                <input type="radio" id="mode-clues" name="edit-mode" value={EditMode.CLUES} onChange={updateEditMode} defaultChecked={editMode == EditMode.CLUES} data-testid="mode-clues-button" />
                <label htmlFor="mode-clues">Edit clues</label>
            </fieldset>
        {editMode == EditMode.TOGGLE_BLACK && <SymmetrySettings symmetryMode={symmetryMode} setSymmetryMode={setSymmetryMode} />}
        </section>
    )
}