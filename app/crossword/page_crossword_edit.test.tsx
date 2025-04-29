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
const YELLOW_BACKGROUND = "rgba(252, 247, 88, 0.2)";
const BLUE_BACKGROUND = "rgba(166, 246, 247, 0.2)";

/** A wrapper that uses state to trigger a rerender. */
function TestCrosswordHolder({crossword}: {crossword: Crossword}) {
    function nullCrosswordInitializer(): Crossword|null {
        return crossword;
    }
    const [xword, setXword] = useState(nullCrosswordInitializer);
    return (
        <PageCrosswordEdit crossword={xword as Crossword} setCrossword={setXword} />
    )
}

describe('Initial state', () => {
    it('starts with Toggle Black mode selected', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');

        expect(modeToggleRadioButton.checked).toBe(true);
    });

    it('starts with Rotational symmetry selected', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const rotationalRadioButton: HTMLInputElement = screen.getByTestId('symmetry-rotational-button');

        expect(rotationalRadioButton.checked).toBe(true);
    });

    it('allows black squares to be selected', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const squares = screen.queryAllByTestId("inner-box");
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        expect((squares[224] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND); // Rotationally symmetric
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((squares[224] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
    });

    it('doesnt render clues', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        
        expect(screen.queryByTestId('clues')).toBeNull();
    });
});

describe('After selecting mirror symmetry', () => {
    it('toggles both the square and the mirror symmetric square', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const mirrorRadioButton: HTMLInputElement = screen.getByTestId('symmetry-mirror-button');
        await userEvent.click(mirrorRadioButton);

        const squares = screen.queryAllByTestId("inner-box");
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        expect((squares[14] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND); // Mirror symmetric
        await userEvent.click(squares[0]);

        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((squares[14] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
    });
});

describe('After selecting no symmetry', () => {
    it('doesnt change any other squares when toggled', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 2, width: 2})} />);
        const noSymmetryRadioButton: HTMLInputElement = screen.getByTestId('symmetry-none-button');
        await userEvent.click(noSymmetryRadioButton);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);

        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        expect((squares[2] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        expect((squares[3] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
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

        expect((inner as HTMLElement).style.backgroundColor).toBe(YELLOW_BACKGROUND);
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

describe('After selecting edit clues mode', () => {
    it('renders the clues section', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeCluesRadioButton: HTMLInputElement = screen.getByTestId('mode-clues-button');
        await userEvent.click(modeCluesRadioButton);
        
        expect(screen.queryByTestId('clues')).not.toBeNull();
    });

    it('doesnt allow toggling black/white', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeCluesRadioButton: HTMLInputElement = screen.getByTestId('mode-clues-button');
        await userEvent.click(modeCluesRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].lastElementChild!;
        expect((inner as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        await userEvent.click(inner);

        expect((inner as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });

    it('doesnt allow text to be input', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 15, width: 15})} />);
        const modeCluesRadioButton: HTMLInputElement = screen.getByTestId('mode-clues-button');
        await userEvent.click(modeCluesRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].lastElementChild!;
        await userEvent.click(inner);
        await userEvent.keyboard('j');

        expect(inner.textContent).toBe('');
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

    it('removes active word and letter backgrounds', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword({height: 3, width: 3})} />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');
        await userEvent.click(modeTextRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        await userEvent.click(squares[0].lastElementChild!);
        expect((squares[0].lastElementChild! as HTMLElement).style.backgroundColor).toBe(YELLOW_BACKGROUND);
        expect((squares[1].lastElementChild! as HTMLElement).style.backgroundColor).toBe(BLUE_BACKGROUND);
        expect((squares[2].lastElementChild! as HTMLElement).style.backgroundColor).toBe(BLUE_BACKGROUND);

        await userEvent.click(modeToggleRadioButton);

        expect((squares[0].lastElementChild! as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        expect((squares[1].lastElementChild! as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        expect((squares[2].lastElementChild! as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });
});