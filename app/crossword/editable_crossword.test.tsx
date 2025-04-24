import {render, screen} from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import {EditableCrossword} from './editable_crossword';
import {EditMode, SymmetryMode} from './page_crossword_edit';
import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, Crossword, Dimensions, SquareColor } from '../models/crossword';
import { useState } from 'react';

const DIMENSIONS: Dimensions = {
    width: 15,
    height: 15
};
const WHITE_BACKGROUND = "rgba(1, 1, 1, 0)";
const BLACK_BACKGROUND = "rgb(0, 0, 0)";
const YELLOW_BACKGROUND = "rgba(252, 247, 88, 0.2)";
const BLUE_BACKGROUND = "rgba(166, 246, 247, 0.2)";

/** A wrapper that uses state to trigger a rerender. */
function TestCrosswordHolder({crossword, editMode, symmetryMode}: {crossword: Crossword, editMode: EditMode, symmetryMode: SymmetryMode}) {
    function nullCrosswordInitializer(): Crossword|null {
        return crossword;
    }
    const [xword, setXword] = useState(nullCrosswordInitializer);
    return (
        <EditableCrossword crossword={xword as Crossword} setCrossword={setXword} editMode={editMode} symmetryMode={symmetryMode} />
    )
}

describe('Text Edit Mode', () => {
    it('renders a grid', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });

    it('converts a letter entered in the grid to uppercase', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');

        expect((inputs[0] as HTMLInputElement).value).toBe('A');
    });

    it('allows uppercase letters', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('B');

        expect((inputs[0] as HTMLInputElement).value).toBe('B');
    });

    it('allows numbers', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('1');

        expect((inputs[0] as HTMLInputElement).value).toBe('1');
    });

    it('allows other characters', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard(';');

        expect((inputs[0] as HTMLInputElement).value).toBe(';');
    });

    it('doesnt accept more than one character', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('abc');

        expect((inputs[0] as HTMLInputElement).value).toBe('A');
    });

    it('allows deletion', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');
        await userEvent.keyboard('[Backspace]');

        expect((inputs[0] as HTMLInputElement).value).toBe('');
    });

    it('allows replacing a letter', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');
        await userEvent.keyboard('[Backspace]');
        await userEvent.keyboard('b');

        expect((inputs[0] as HTMLInputElement).value).toBe('B');
    });

    it('doesnt allow entering text in a black square', async () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].color = SquareColor.BLACK;
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        await userEvent.click(inputs[0]);
        await userEvent.keyboard('a');

        expect((inputs[0] as HTMLInputElement).value).toBe('');
    });

    it('renders previously entered text', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].value = 'M';
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");

        expect((inputs[0] as HTMLInputElement).value).toBe('M');
    });

    it('renders previously entered black and white squares', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].color = SquareColor.BLACK;
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");

        expect((inputs[0] as HTMLInputElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((inputs[1] as HTMLInputElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });

    describe('On focus', () => {
        it('renders the active square yellow', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");
            await userEvent.click(inputs[0]);

            expect(inputs[0].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('renders the other squares in the same word blue', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");
            await userEvent.click(inputs[0]);

            expect(inputs[1].style.backgroundColor).toBe(BLUE_BACKGROUND);
            expect(inputs[2].style.backgroundColor).toBe(BLUE_BACKGROUND);
        });

        it('changes the background back to white after a new square is focused on', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[0]);
            expect(inputs[0].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.click(inputs[4]);
            expect(inputs[0].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('changes the other word square backgrounds back to white after a new square is focused on', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[0]);
            expect(inputs[1].style.backgroundColor).toBe(BLUE_BACKGROUND);

            await userEvent.click(inputs[4]);
            expect(inputs[1].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[2].style.backgroundColor).toBe(WHITE_BACKGROUND);
        });
    });

    describe('Auto-advance', () => {
        it('advances to the next empty non-black square after entry', async () => {
            const crossword = createNewCrossword(DIMENSIONS);
            crossword.squares[1].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[0]);
            await userEvent.keyboard('a');
            await userEvent.keyboard('b');

            expect((inputs[2] as HTMLInputElement).value).toBe('B');
        });

        it('renders the new active square as yellow', async () => {
            const crossword = createNewCrossword(DIMENSIONS);
            crossword.squares[1].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[0]);
            await userEvent.keyboard('a');

            expect(inputs[0].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[2].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('renders the squares in the new active word as blue', async () => {
            const crossword = createNewCrossword({width: 5, height: 2});
            crossword.squares[1].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[0]);
            await userEvent.keyboard('a');

            expect(inputs[3].style.backgroundColor).toBe(BLUE_BACKGROUND);
            expect(inputs[4].style.backgroundColor).toBe(BLUE_BACKGROUND);
        });

        it('backs up to the previous non-black square and removes the value on backspace', async () => {
            const crossword = createNewCrossword(DIMENSIONS);
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[0]);
            await userEvent.keyboard('a');
            await userEvent.keyboard('b');
            await userEvent.keyboard('[Backspace]');
            await userEvent.keyboard('[Backspace]');

            expect((inputs[0] as HTMLInputElement).value).toBe('');
            expect((inputs[1] as HTMLInputElement).value).toBe('');
        });

        it('renders the backed-up active square as yellow', async () => {
            const crossword = createNewCrossword(DIMENSIONS);
            crossword.squares[2].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[3]);
            await userEvent.keyboard('[Backspace]');

            expect(inputs[1].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('renders the squares in the backed-up active word as blue', async () => {
            const crossword = createNewCrossword(DIMENSIONS);
            crossword.squares[2].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[3]);
            await userEvent.keyboard('[Backspace]');

            expect(inputs[0].style.backgroundColor).toBe(BLUE_BACKGROUND);
        });
    });

    describe('Arrow navigation', () => {
        it('does nothing on up arrow if already in the top row', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");
            
            await userEvent.click(inputs[1]);
            expect(inputs[1].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowUp]');

            expect(inputs[1].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on up arrow if all squares above are black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[1].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowUp]');

            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('moves the focus up on up arrow if the above square isnt black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowUp]');

            expect(inputs[4].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[1].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('skips black squares on up arrow', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[4].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[7]);
            expect(inputs[7].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowUp]');

            expect(inputs[7].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[1].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on down arrow if already in the bottom row', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[7]);
            expect(inputs[7].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowDown]');

            expect(inputs[7].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on down arrow if all squares below are black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[7].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowDown]');

            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('moves the focus down one on down arrow if the square below isnt black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowDown]');

            expect(inputs[4].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[7].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('skips black squares on down arrow', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[4].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[1]);
            expect(inputs[1].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowDown]');

            expect(inputs[1].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[7].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on right arrow if already in the rightmost column', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[5]);
            expect(inputs[5].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowRight]');

            expect(inputs[5].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on right arrow if all squares to the right are black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[5].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowRight]');

            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('moves the focus right on right arrow if the square to the right isnt black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowRight]');

            expect(inputs[4].style.backgroundColor).toBe(BLUE_BACKGROUND);
            expect(inputs[5].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('skips black squares on right arrow', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[4].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[3]);
            expect(inputs[3].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowRight]');

            expect(inputs[3].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[5].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on left arrow if already in the leftmost column', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[3]);
            expect(inputs[3].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowLeft]');

            expect(inputs[3].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('does nothing on left arrow if all squares to the left are black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[3].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowLeft]');

            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('moves the focus left on left arrow if the square to the left isnt black', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[4]);
            expect(inputs[4].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowLeft]');

            expect(inputs[4].style.backgroundColor).toBe(BLUE_BACKGROUND);
            expect(inputs[3].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });

        it('skips black squares on left arrow', async () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[4].color = SquareColor.BLACK;
            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TEXT} symmetryMode={SymmetryMode.NONE} />);
            const inputs = screen.queryAllByTestId("crossword-input");

            await userEvent.click(inputs[5]);
            expect(inputs[5].style.backgroundColor).toBe(YELLOW_BACKGROUND);

            await userEvent.keyboard('[ArrowLeft]');

            expect(inputs[5].style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect(inputs[3].style.backgroundColor).toBe(YELLOW_BACKGROUND);
        });
    });
});

describe('Black Toggle Mode', () => {
    it('renders a 15x15 grid', () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)} editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
        expect(screen.queryAllByTestId("crossword-square")).toHaveLength(225);
    });

    it('doesnt allow text entry', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
        const inputs = screen.queryAllByTestId("crossword-input");
        expect(inputs.length).toBe(0);

        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        await userEvent.keyboard('a');

        expect((squares[0] as HTMLElement).innerHTML).toBe('');
    });

    it('changes a square from white to black on one click', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
    });

    it('changes a square back to white on two clicks', async () => {
        render(<TestCrosswordHolder crossword={createNewCrossword(DIMENSIONS)}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
        const squares = screen.queryAllByTestId("inner-box");
        await userEvent.click(squares[0]);
        await userEvent.click(squares[0]);
        
        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });

    it('renders previously entered text', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].value = 'M';
        render(<TestCrosswordHolder crossword={crossword} editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
        const squares = screen.queryAllByTestId("inner-box");

        expect((squares[0] as HTMLElement).textContent).toBe('M');
    });

    it('renders previously entered black and white squares', () => {
        const crossword = createNewCrossword(DIMENSIONS);
        crossword.squares[0].color = SquareColor.BLACK;
        render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
        const squares = screen.queryAllByTestId("inner-box");

        expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
    });

    describe('No Symmetry', () => {
        it('doesnt change any other square colors when toggled white->black', async () => {
            render(<TestCrosswordHolder crossword={createNewCrossword({width: 2, height: 2})}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[0]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        });

        it('doesnt change any other square colors when toggled black->white', async () => {
            const crossword = createNewCrossword({width: 2, height: 2});
            for (let square of crossword.squares) {
                square.color = SquareColor.BLACK;
            }

            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.NONE} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[1]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        });
    });

    describe('Rotational Symmetry', () => {
        it('changes the rotationally opposite square to black when toggled black', async () => {
            render(<TestCrosswordHolder crossword={createNewCrossword({width: 2, height: 2})}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.ROTATIONAL} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[0]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        });

        it('changes the rotationally opposite square to white when toggled white', async () => {
            const crossword = createNewCrossword({width: 2, height: 2});
            for (let square of crossword.squares) {
                square.color = SquareColor.BLACK;
            }

            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.ROTATIONAL} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[1]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        });

        it('only changes the middle square when updating the middle square', async () => {
            render(<TestCrosswordHolder crossword={createNewCrossword({width: 3, height: 3})}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.ROTATIONAL} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[4]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[4] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);  // Middle square
            expect((squares[5] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[6] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[7] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[8] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        });
    });

    describe('Mirror Symmetry', () => {
        it('changes the mirror opposite square to black when toggled black', async () => {
            render(<TestCrosswordHolder crossword={createNewCrossword({width: 2, height: 2})}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.MIRROR} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[2]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        });

        it('changes the mirror opposite square to white when toggled white', async () => {
            const crossword = createNewCrossword({width: 2, height: 2});
            for (let square of crossword.squares) {
                square.color = SquareColor.BLACK;
            }

            render(<TestCrosswordHolder crossword={crossword}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.MIRROR} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[1]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[3] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
        });

        it('only changes the middle square of a row when updating that square', async () => {
            render(<TestCrosswordHolder crossword={createNewCrossword({width: 3, height: 1})}  editMode={EditMode.TOGGLE_BLACK} symmetryMode={SymmetryMode.ROTATIONAL} />);
            const squares = screen.queryAllByTestId("inner-box");
            await userEvent.click(squares[1]);

            expect((squares[0] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
            expect((squares[1] as HTMLElement).style.backgroundColor).toBe(BLACK_BACKGROUND);
            expect((squares[2] as HTMLElement).style.backgroundColor).toBe(WHITE_BACKGROUND);
        });
    });
});