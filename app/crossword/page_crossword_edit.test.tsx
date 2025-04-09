import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { PageCrosswordEdit } from './page_crossword_edit';
import { SquareColor } from '../models/crossword';
import { beforeEach } from 'node:test';

describe('Initial state', () => {
    it('starts with Toggle Black mode selected', () => {
        render(<PageCrosswordEdit />);
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');

        expect(modeToggleRadioButton.checked).toBe(true);
    });

    it('allows black squares to be selected', async () => {
        render(<PageCrosswordEdit />);
        const squares = screen.queryAllByTestId("inner-box");
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(SquareColor.WHITE);
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(SquareColor.BLACK);
    });
});

describe('After selecting text edit mode', () => {
    it('doesnt allow toggling black/white', async () => {
        render(<PageCrosswordEdit />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        await userEvent.click(modeTextRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].firstElementChild!;
        expect((inner as HTMLElement).style.backgroundColor).toBe(SquareColor.WHITE);
        await userEvent.click(inner);

        expect((inner as HTMLElement).style.backgroundColor).toBe(SquareColor.WHITE);
    });

    it('allows text to be input', async () => {
        render(<PageCrosswordEdit />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        await userEvent.click(modeTextRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].firstElementChild!;
        await userEvent.click(inner);
        await userEvent.keyboard('j');

        expect((inner as HTMLInputElement).value).toBe('J');
    });
});

describe('After re-selecting toggle black/white mode', () => {
    it('allows toggling black/white', async () => {
        render(<PageCrosswordEdit />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');
        await userEvent.click(modeTextRadioButton);
        await userEvent.click(modeToggleRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].firstElementChild!;
        expect((inner as HTMLElement).style.backgroundColor).toBe(SquareColor.WHITE);
        await userEvent.click(inner);

        expect((inner as HTMLElement).style.backgroundColor).toBe(SquareColor.BLACK);
    });

    it('doesnt allow text to be input', async () => {
        render(<PageCrosswordEdit />);
        const modeTextRadioButton: HTMLInputElement = screen.getByTestId('mode-text-button');
        const modeToggleRadioButton: HTMLInputElement = screen.getByTestId('mode-toggle-button');
        await userEvent.click(modeTextRadioButton);
        await userEvent.click(modeToggleRadioButton);

        const squares: HTMLElement[] = screen.queryAllByTestId("crossword-square");
        const inner = squares[0].firstElementChild!;
        await userEvent.click(inner);
        await userEvent.keyboard('j');

        expect(inner.textContent).toBe('');
    });
});