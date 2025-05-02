import {render, screen, within} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import { describe, expect, it } from '@jest/globals';
import { createNewCrossword } from '../models/crossword';
import { EditClues } from './edit_clues';

describe('EditClues', () => {
    it('renders the clue number for each across clue', () => {
        render(<EditClues crossword={createNewCrossword({height: 2, width: 3})} setCrossword={() => {}} />);
        const acrossNumbers: HTMLElement[] = within(screen.getByTestId("across-clues")).getAllByTestId("clue-number");

        expect(acrossNumbers).toHaveLength(2);
        expect(acrossNumbers[0].textContent).toBe("1.");
        expect(acrossNumbers[1].textContent).toBe("4.");
    });

    it('renders the clue number for each down clue', () => {
        render(<EditClues crossword={createNewCrossword({height: 2, width: 3})} setCrossword={() => {}} />);
        const downNumbers: HTMLElement[] = within(screen.getByTestId("down-clues")).getAllByTestId("clue-number");

        expect(downNumbers).toHaveLength(3);
        expect(downNumbers[0].textContent).toBe("1.");
        expect(downNumbers[1].textContent).toBe("2.");
        expect(downNumbers[2].textContent).toBe("3.");
    });

    it('renders an empty input box for each across and down clue in a blank crossword', () => {
        render(<EditClues crossword={createNewCrossword({height: 2, width: 3})} setCrossword={() => {}} />);
        const inputs: HTMLInputElement[] = screen.getAllByTestId("clue-input");

        expect(inputs).toHaveLength(5);
        expect(inputs[0].value).toBe('');
        expect(inputs[1].value).toBe('');
        expect(inputs[2].value).toBe('');
        expect(inputs[3].value).toBe('');
        expect(inputs[4].value).toBe('');
    });

    it('renders an input box with a value filled in for each clue that already has a value', () => {
        const crossword = createNewCrossword({width: 2, height: 2});
        crossword.clues.across[0].text = "foobar";
        crossword.clues.down[1].text = "baz";
        render(<EditClues crossword={crossword} setCrossword={() => {}} />);
        const inputs: HTMLInputElement[] = screen.getAllByTestId("clue-input");

        expect(inputs[0].value).toBe("foobar");
        expect(inputs[1].value).toBe("");
        expect(inputs[2].value).toBe("");
        expect(inputs[3].value).toBe("baz");
    });

    it('calls setCrossword on clue input focus', async () => {
        let crosswordSet = false;
        const setCrossword = () => {
            crosswordSet = true;
        };
        render(<EditClues crossword={createNewCrossword({height: 2, width: 3})} setCrossword={setCrossword} />);
        const inputs: HTMLInputElement[] = screen.getAllByTestId("clue-input");

        await userEvent.click(inputs[2]);

        expect(crosswordSet).toBe(true);
    });
});