import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {EditableCrossword, EditMode} from './editable_crossword';
import { describe, expect, it } from '@jest/globals';

describe('Text Edit Mode', () => {
    it('renders a 15x15 grid', () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });

    it('converts a letter entered in the grid to uppercase', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');

        expect((inputs[0] as HTMLInputElement).value).toBe('A');
    });

    it('allows uppercase letters', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('B');

        expect((inputs[0] as HTMLInputElement).value).toBe('B');
    });

    it('allows numbers', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('1');

        expect((inputs[0] as HTMLInputElement).value).toBe('1');
    });

    it('allows other characters', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard(';');

        expect((inputs[0] as HTMLInputElement).value).toBe(';');
    });

    it('doesnt accept more than one character', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('abc');

        expect((inputs[0] as HTMLInputElement).value).toBe('A');
    });

    it('allows deletion', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');
        await userEvent.keyboard('[Backspace]');

        expect((inputs[0] as HTMLInputElement).value).toBe('');
    });

    it('allows replacing a letter', async () => {
        render(<EditableCrossword editMode={EditMode.TEXT} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');
        await userEvent.keyboard('[Backspace]');
        await userEvent.keyboard('b');

        expect((inputs[0] as HTMLInputElement).value).toBe('B');
    });
});

describe('Black Toggle Mode', () => {
    it('renders a 15x15 grid', () => {
        render(<EditableCrossword editMode={EditMode.TOGGLE_BLACK} />);
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });

    it('doesnt allow text entry', async () => {
        render(<EditableCrossword editMode={EditMode.TOGGLE_BLACK} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        expect(inputs.length).toBe(0);

        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        await userEvent.keyboard('a');

        expect((squares[0] as HTMLElement).innerHTML).toBe('');
    });

    it('changes a square from white to black on one click', async () => {
        render(<EditableCrossword editMode={EditMode.TOGGLE_BLACK} />);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe('black');
    });

    it('changes a square back to white on two clicks', async () => {
        render(<EditableCrossword editMode={EditMode.TOGGLE_BLACK} />);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe('white');
    });
});