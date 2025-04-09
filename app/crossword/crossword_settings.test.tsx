import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {EditMode} from './page_crossword_edit';
import { describe, expect, it } from '@jest/globals';
import { CrosswordSettings } from './crossword_settings';

describe('Text Edit Mode', () => {
    it('initially displays with Text Edit seleted', async () => {
        render(<CrosswordSettings editMode={EditMode.TEXT} setEditMode={() => {}} ></CrosswordSettings>);

        const modeTextRadioButton: HTMLInputElement = await screen.findByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        expect(modeTextRadioButton.checked).toBe(true);
        expect(modeToggleRadioButton.checked).toBeFalsy();
    });

    it('calls setEditMode on toggle', async () => {
        let currentMode = EditMode.TEXT;
        const setEditMode = (mode: EditMode) => {
            currentMode = mode;
        }
        render(<CrosswordSettings editMode={EditMode.TEXT} setEditMode={setEditMode} ></CrosswordSettings>);
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        await userEvent.click(modeToggleRadioButton);

        expect(currentMode).toBe(EditMode.TOGGLE_BLACK);
    });
});

describe('Toggle Black Mode', () => {
    it('initially displays with Toggle Black seleted', async () => {
        render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={() => {}} ></CrosswordSettings>);

        const modeTextRadioButton: HTMLInputElement = await screen.findByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = await screen.findByTestId('mode-toggle-button');
        expect(modeToggleRadioButton.checked).toBe(true);
        expect(modeTextRadioButton.checked).toBeFalsy();
    });

    it('calls setEditMode on toggle', async () => {
        let currentMode = EditMode.TOGGLE_BLACK;
        const setEditMode = (mode: EditMode) => {
            currentMode = mode;
        }
        render(<CrosswordSettings editMode={EditMode.TOGGLE_BLACK} setEditMode={setEditMode} ></CrosswordSettings>);
        const modeTextRadioButton: HTMLInputElement = await screen.findByTestId('mode-text-button');
        await userEvent.click(modeTextRadioButton);

        expect(currentMode).toBe(EditMode.TEXT);
    });
});