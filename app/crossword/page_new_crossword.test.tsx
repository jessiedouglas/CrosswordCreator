import {render, screen, waitFor} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { PageNewCrossword } from './page_new_crossword';
import { SquareColor } from '../models/crossword';

describe('Size selection', () => {
    it('Starts with 15x15 checked', () => {
        render(<PageNewCrossword />);
        const weekdayRadioButton: HTMLInputElement = screen.getByTestId('dimensions-weekday');

        expect(weekdayRadioButton.checked).toBe(true);
    });

    it('Auto-selects custom if the height input is clicked', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('custom-height'));
        const customRadioButton: HTMLInputElement = screen.getByTestId('dimensions-custom');

        expect(customRadioButton.checked).toBe(true);
    });

    it('Auto-selects custom if the width input is clicked', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('custom-width'));
        const customRadioButton: HTMLInputElement = screen.getByTestId('dimensions-custom');

        expect(customRadioButton.checked).toBe(true);
    });

    it('Loads a 225-square crossword after hitting Select', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });
    
    it('Initializes the crossword in Toggle Black/White mode', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId("select-button"));
        const squares: HTMLElement[] = screen.queryAllByTestId("inner-box");
        expect(squares[0].style.backgroundColor).toBe(SquareColor.WHITE);

        await userEvent.click(squares[0]);
        expect(squares[0].style.backgroundColor).toBe(SquareColor.BLACK);
    });
    
    it('Loads a 441-square crossword after selecting 21x21 and hitting Select', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-sunday'));
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(441);
    });
    
    it('Loads a custom-sized crossword after entering custom values', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('7');
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('11');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(77);
    });
});

describe('Form validation', () => {
    it('throws an error if no fields are filled out and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('throws an error if height is not filled in and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('11');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('throws an error if height is not an integer and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('7.1');
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('11');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('throws an error if height is negative and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('-7');
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('11');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('throws an error if width is not filled in and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('7');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('throws an error if width is not an integer and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('7');
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('11.9');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('throws an error if width is negative and custom is selected', async () => {
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('7');
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('-11');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.getByTestId("error-message").textContent).toContain("valid");
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(0);
    });

    it('allows submit after error if custom error is fixed', async () => {
        // Trigger error
        render(<PageNewCrossword />);
        await userEvent.click(screen.getByTestId('dimensions-custom'));
        await userEvent.click(screen.getByTestId("select-button"));
        expect(screen.getByTestId("error-message").textContent).toContain("valid");

        // Fix error
        await userEvent.click(screen.getByTestId('custom-height'));
        await userEvent.keyboard('7');
        await userEvent.click(screen.getByTestId('custom-width'));
        await userEvent.keyboard('11');
        await userEvent.click(screen.getByTestId("select-button"));

        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(77);
    });
});