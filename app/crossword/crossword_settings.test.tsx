import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {EditMode, SymmetryMode} from './page_crossword_edit';
import { describe, expect, it } from '@jest/globals';
import { CrosswordSettings } from './crossword_settings';

describe('Text Edit Mode', () => {
    it('initially displays with Text Edit seleted', async () => {
        render(<CrosswordSettings editMode={EditMode.TEXT} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);

        const modeTextRadioButton: HTMLInputElement = await screen.findByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        const modeCluesRadioButton: HTMLInputElement = screen.getByTestId('mode-clues-button');
        expect(modeTextRadioButton.checked).toBe(true);
        expect(modeToggleRadioButton.checked).toBeFalsy();
        expect(modeCluesRadioButton.checked).toBeFalsy();
    });

    it('calls setEditMode on toggle', async () => {
        let currentMode = EditMode.TEXT;
        const setEditMode = (mode: EditMode) => {
            currentMode = mode;
        }
        render(<CrosswordSettings editMode={EditMode.TEXT} setEditMode={setEditMode} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        await userEvent.click(modeToggleRadioButton);

        expect(currentMode).toBe(EditMode.TOGGLE_BLACK);
    });

    it('doesnt display the symmetry settings', () => {
        render(<CrosswordSettings editMode={EditMode.TEXT} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);

        expect(screen.queryByTestId('symmetry-rotational-button')).toBeNull();
    });
});

describe('Toggle Black Mode', () => {
    it('initially displays with Toggle Black seleted', async () => {
        render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);

        const modeTextRadioButton: HTMLInputElement = await screen.findByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        const modeCluesRadioButton: HTMLInputElement = screen.getByTestId('mode-clues-button');
        expect(modeToggleRadioButton.checked).toBe(true);
        expect(modeTextRadioButton.checked).toBeFalsy();
        expect(modeCluesRadioButton.checked).toBeFalsy();
    });

    it('calls setEditMode on toggle', async () => {
        let currentMode = EditMode.TOGGLE_BLACK;
        const setEditMode = (mode: EditMode) => {
            currentMode = mode;
        }
        render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={setEditMode} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);
        const modeTextRadioButton: HTMLInputElement = await screen.findByTestId('mode-text-button');
        await userEvent.click(modeTextRadioButton);

        expect(currentMode).toBe(EditMode.TEXT);
    });

    it('displays the symmetry settings', () => {
        render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);

        expect(screen.queryByTestId('symmetry-rotational-button')).not.toBeNull();
    });

    describe('with Rotation Symmetry', () => {
        it('initially displays with Rotational selected', () => {
            render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.ROTATIONAL} setSymmetryMode={() => {}} ></CrosswordSettings>);

            const rotationalButton: HTMLInputElement = screen.getByTestId('symmetry-rotational-button');
            expect(rotationalButton.checked).toBe(true);
        });

        it('calls setSymmetryMode on toggle', async () => {
            let currentSymmetry = SymmetryMode.UNSPECIFIED;
            const setSymmetryMode = (mode: SymmetryMode) => {
                currentSymmetry = mode;
            }

            render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.MIRROR} setSymmetryMode={setSymmetryMode} ></CrosswordSettings>);
            const rotationalButton: HTMLInputElement = screen.getByTestId('symmetry-rotational-button');
            await userEvent.click(rotationalButton);

            expect(currentSymmetry).toBe(SymmetryMode.ROTATIONAL);
        });
    });

    describe('with Mirror Symmetry', () => {
        it('initially displays with Mirror selected', () => {
            render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.MIRROR} setSymmetryMode={() => {}} ></CrosswordSettings>);

            const mirrorButton: HTMLInputElement = screen.getByTestId('symmetry-mirror-button');
            expect(mirrorButton.checked).toBe(true);
        });

        it('calls setSymmetryMode on toggle', async () => {
            let currentSymmetry = SymmetryMode.UNSPECIFIED;
            const setSymmetryMode = (mode: SymmetryMode) => {
                currentSymmetry = mode;
            }

            render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={setSymmetryMode} ></CrosswordSettings>);
            const mirrorButton: HTMLInputElement = screen.getByTestId('symmetry-mirror-button');
            await userEvent.click(mirrorButton);

            expect(currentSymmetry).toBe(SymmetryMode.MIRROR);
        });
    });

    describe('with No Symmetry', () => {
        it('initially displays with None selected', () => {
            render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);

            const noneButton: HTMLInputElement = screen.getByTestId('symmetry-none-button');
            expect(noneButton.checked).toBe(true);
        });

        it('calls setSymmetryMode on toggle', async () => {
            let currentSymmetry = SymmetryMode.UNSPECIFIED;
            const setSymmetryMode = (mode: SymmetryMode) => {
                currentSymmetry = mode;
            }

            render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} symmetryMode={SymmetryMode.ROTATIONAL} setSymmetryMode={setSymmetryMode} ></CrosswordSettings>);
            const noneButton: HTMLInputElement = screen.getByTestId('symmetry-none-button');
            await userEvent.click(noneButton);

            expect(currentSymmetry).toBe(SymmetryMode.NONE);
        });
    });
});

describe('Clues mode', () => {
    it('initially displays with Edit clues selected', () => {
        render(<CrosswordSettings editMode={EditMode.CLUES} setEditMode={() => {}} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);
        
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');
        const modeCluesRadioButton: HTMLInputElement = screen.getByTestId('mode-clues-button');
        expect(modeCluesRadioButton.checked).toBe(true);
        expect(modeToggleRadioButton.checked).toBeFalsy();
        expect(modeTextRadioButton.checked).toBeFalsy();
    });

    it('calls setEditMode on toggle', async () => {
        let currentMode = EditMode.CLUES;
        const setEditMode = (mode: EditMode) => {
            currentMode = mode;
        }
        render(<CrosswordSettings editMode={EditMode.CLUES} setEditMode={setEditMode} symmetryMode={SymmetryMode.NONE} setSymmetryMode={() => {}} ></CrosswordSettings>);
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        await userEvent.click(modeToggleRadioButton);

        expect(currentMode).toBe(EditMode.TOGGLE_BLACK);
    });
});