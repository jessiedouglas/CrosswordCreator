import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {EditableCrossword} from './editable_crossword';
import {EditMode} from './page_crossword_edit';
import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, Crossword, Dimensions, SquareColor } from '../models/crossword';
import { useState } from 'react';

const DIMENSIONS: Dimensions = {
    width: 15,
    height: 15
};
const WHITE_BACKGROUND = "rgba(1, 1, 1, 0)";
const BLACK_BACKGROUND = "rgb(0, 0, 0)";

/** A wrapper that uses state to trigger a rerender. */
function TestCrosswordHolder({crossword, editMode}: {crossword: Crossword, editMode: EditMode}) {
    const [xword, setXword] = useState(crossword)
    return (
        <EditableCrossword crossword={xword} setCrossword={setXword} editMode={editMode} />
    )
}

describe('Text Edit Mode', () => {
    it('renders a grid', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });

    it('converts a letter entered in the grid to uppercase', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');

        expect((inputs[0] as HTMLInputElement).value).toBe('A');
    });

    it('allows uppercase letters', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('B');

        expect((inputs[0] as HTMLInputElement).value).toBe('B');
    });

    it('allows numbers', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('1');

        expect((inputs[0] as HTMLInputElement).value).toBe('1');
    });

    it('allows other characters', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard(';');

        expect((inputs[0] as HTMLInputElement).value).toBe(';');
    });

    it('doesnt accept more than one character', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('abc');

        expect((inputs[0] as HTMLInputElement).value).toBe('A');
    });

    it('allows deletion', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');
        await userEvent.keyboard('[Backspace]');

        expect((inputs[0] as HTMLInputElement).value).toBe('');
    });

    it('allows replacing a letter', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');
        await userEvent.keyboard('[Backspace]');
        await userEvent.keyboard('b');

        expect((inputs[0] as HTMLInputElement).value).toBe('B');
    });

    it('renders previously entered text', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].value = 'M';
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");

        expect((inputs[0] as HTMLInputElement).value).toBe('M');
    });

    it('renders previously entered black and white squares', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].color = SquareColor.BLACK;
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");

        expect((inputs[0] as HTMLInputElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((inputs[1] as HTMLInputElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });
});

describe('Black Toggle Mode', () => {
    it('renders a 15x15 grid', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)} editMode={EditMode.TOGGLE_BLACK} />);
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });

    it('doesnt allow text entry', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TOGGLE_BLACK} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        expect(inputs.length).toBe(0);

        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        await userEvent.keyboard('a');

        expect((squares[0] as HTMLElement).innerHTML).toBe('');
    });

    it('changes a square from white to black on one click', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TOGGLE_BLACK} />);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
    });

    it('changes a square back to white on two clicks', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TOGGLE_BLACK} />);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });

    it('renders previously entered text', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].value = 'M';
        render(<TestCrosswordHolder crossword={crossword} editMode={EditMode.TOGGLE_BLACK} />);
        const squares = screen.queryAllByTestId("inner-box");

        expect((squares[0] as HTMLElement).textContent).toBe('M');
    });

    it('renders previously entered black and white squares', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].color = SquareColor.BLACK;
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TOGGLE_BLACK} />);
        const squares = screen.queryAllByTestId("inner-box");

        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });
});