import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { PageCrosswordEdit } from './page_crossword_edit';
import { createNewCrossword, SquareColor, Crossword } from '../models/crossword';
import { useState } from 'react';
import preview from 'jest-preview';

const WHITE_BACKGROUND = "rgba(1, 1, 1, 0)";
const BLACK_BACKGROUND = "rgb(0, 0, 0)";

/** A wrapper that uses state to trigger a rerender. */
function TestCrosswordHolder({crossword}: {crossword: Crossword}) {
    const [xword, setXword] = useState(crossword)
    return (
        <PageCrosswordEdit crossword={xword} setCrossword={setXword} />
    )
}

describe('Initial state', () => {
    it('starts with Toggle Black mode selected', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');

        expect(modeToggleRadioButton.checked).toBe(true);
    });

    it('allows black squares to be selected', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const squares = screen.queryAllByTestId("inner-box");
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
    });
});

describe('After selecting text edit mode', () => {
    it('doesnt allow toggling black/white', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        await userEvent.click(modeTextRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].lastElementChild!;
        expect((inner as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        await userEvent.click(inner);

        expect((inner as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });

    it('allows text to be input', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        await userEvent.click(modeTextRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].lastElementChild!;
        await userEvent.click(inner);
        await userEvent.keyboard('j');

        expect((inner as HTMLInputElement).value).toBe('J');
    });
});

describe('After re-selecting toggle black/white mode', () => {
    it('allows toggling black/white', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');
        await userEvent.click(modeTextRadioButton);
        await userEvent.click(modeToggleRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].lastElementChild!;
        expect((inner as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        await userEvent.click(inner);

        expect((inner as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
    });

    it('doesnt allow text to be input', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');
        await userEvent.click(modeTextRadioButton);
        await userEvent.click(modeToggleRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].lastElementChild!;
        await userEvent.click(inner);
        await userEvent.keyboard('j');

        expect(inner.textContent).toBe('');
    });
});