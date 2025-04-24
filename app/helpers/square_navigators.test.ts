import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, Crossword, SquareColor } from '../models/crossword';
import { getPreviousNonBlackSquare, getNextNonBlackEmptySquare, getActiveWordSquares, getNextNonBlackSquareAbove, getNextNonBlackSquareBelow, getNextNonBlackSquareLeft, getNextNonBlackSquareRight } from './square_navigators';

describe('getPreviousNonBlackSquare', () => {
    it('returns the first square if the index is 0', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        const square = getPreviousNonBlackSquare(0, crossword);

        expect(square.number).toBe(1);
    });

    it('returns the previous square if the previous square is non-black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        const square = getPreviousNonBlackSquare(1, crossword);

        expect(square.number).toBe(1);
    });

    it('returns several squares back if the previous squares were black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[2].color = SquareColor.BLACK;
        const square = getPreviousNonBlackSquare(3, crossword);

        expect(square.number).toBe(1);
    });

    it('returns original square if there are only black squares before', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[0].color = SquareColor.BLACK;
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[2].color = SquareColor.BLACK;
        const square = getPreviousNonBlackSquare(3, crossword);

        expect(square.number).toBe(4);
    });

    it('throws an error if the index is too large', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getPreviousNonBlackSquare(10, crossword)).toThrow();
    });

    it('throws an error if the index is too small', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getPreviousNonBlackSquare(-1, crossword)).toThrow();
    });
});

describe('getNextNonBlackEmptySquare', () => {
    it('returns the last square if the index is the last entry', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        let counter = 0;
        for (let s of crossword.squares) {
            s.value = String(counter);
            counter++;
        }
        const square = getNextNonBlackEmptySquare(8, crossword);

        expect(square.value).toBe('8');
    });

    it('returns the original square if the index is the last non-black square', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        let counter = 0;
        for (let s of crossword.squares) {
            s.value = String(counter);
            counter++;
        }
        crossword.squares[8].color = SquareColor.BLACK;
        const square = getNextNonBlackEmptySquare(7, crossword);

        expect(square.value).toBe('7');
    });

    it('returns the next square if the next square is non-black and empty', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        const square = getNextNonBlackEmptySquare(1, crossword);

        expect(square.number).toBe(3);
    });

    it('returns several squares later if the following squares are not empty', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[1].value = 'A';
        crossword.squares[2].value = 'B';
        const square = getNextNonBlackEmptySquare(0, crossword);

        expect(square.number).toBe(4);
    });

    it('returns several squares later if the following squares are black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[2].color = SquareColor.BLACK;
        const square = getNextNonBlackEmptySquare(0, crossword);

        expect(square.number).toBe(4);
    });

    it('throws an error if the index is too large', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackEmptySquare(9, crossword)).toThrow();
    });

    it('throws an error if the index is too small', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackEmptySquare(-1, crossword)).toThrow();
    });
});

describe('getActiveWordSquares', () => {
    it('returns an empty list if no squares are marked active', () => {
        const crossword = createNewCrossword({width: 5, height: 3});

        expect(getActiveWordSquares(crossword)).toHaveLength(0);
    });

    it('returns the active square and all squares to the right if the active is the first square', () => {
        const crossword = createNewCrossword({width: 5, height: 3});
        populateIndicesAsValues(crossword);
        crossword.squares[6].color = SquareColor.BLACK;
        crossword.squares[7].active = true;

        const activeWordSquares = getActiveWordSquares(crossword);
        expect(activeWordSquares).toHaveLength(3);
        expect(activeWordSquares[0].value).toBe('7');
        expect(activeWordSquares[1].value).toBe('8');
        expect(activeWordSquares[2].value).toBe('9');
    });

    it('returns the active square and all squares to the left if the active is the last square', () => {
        const crossword = createNewCrossword({width: 5, height: 3});
        populateIndicesAsValues(crossword);
        crossword.squares[6].color = SquareColor.BLACK;
        crossword.squares[9].active = true;

        const activeWordSquares = getActiveWordSquares(crossword);
        expect(activeWordSquares).toHaveLength(3);
        expect(activeWordSquares[0].value).toBe('7');
        expect(activeWordSquares[1].value).toBe('8');
        expect(activeWordSquares[2].value).toBe('9');
    });

    it('returns all the way to the ends of the row if there are no black squares', () => {
        const crossword = createNewCrossword({width: 5, height: 3});
        populateIndicesAsValues(crossword);
        crossword.squares[7].active = true;

        const activeWordSquares = getActiveWordSquares(crossword);
        expect(activeWordSquares).toHaveLength(5);
        expect(activeWordSquares[0].value).toBe('5');
        expect(activeWordSquares[1].value).toBe('6');
        expect(activeWordSquares[2].value).toBe('7');
        expect(activeWordSquares[3].value).toBe('8');
        expect(activeWordSquares[4].value).toBe('9');
    });

    it('returns all the way to black squares if there are black squares before the ends of the row', () => {
        const crossword = createNewCrossword({width: 5, height: 3});
        populateIndicesAsValues(crossword);
        crossword.squares[5].color = SquareColor.BLACK;
        crossword.squares[9].color = SquareColor.BLACK;
        crossword.squares[7].active = true;

        const activeWordSquares = getActiveWordSquares(crossword);
        expect(activeWordSquares).toHaveLength(3);
        expect(activeWordSquares[0].value).toBe('6');
        expect(activeWordSquares[1].value).toBe('7');
        expect(activeWordSquares[2].value).toBe('8');
    });
});

describe('getNextNonBlackSquareLeft', () => {
    it('throws if the index is too small', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareLeft(-1, crossword)).toThrow();
    });

    it('throws if the index is too large', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareLeft(9, crossword)).toThrow();
    });

    it('returns null if the square is in the left column', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(getNextNonBlackSquareLeft(0, crossword)).toBeNull();
    });

    it('returns null if there are only black squares left of the square', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[0].color = SquareColor.BLACK;
        crossword.squares[1].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareLeft(2, crossword)).toBeNull();
    });

    it('returns the square to the left if it isnt black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        populateIndicesAsValues(crossword);

        expect(getNextNonBlackSquareLeft(4, crossword)!.value).toBe('3');
    });

    it('skips some squares if the ones to the left are black', () => {
        const crossword = createNewCrossword({width: 4, height: 4});
        populateIndicesAsValues(crossword);
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[2].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareLeft(3, crossword)!.value).toBe('0');
    });
});

describe('getNextNonBlackSquareRight', () => {
    it('throws if the index is too small', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareRight(-1, crossword)).toThrow();
    });

    it('throws if the index is too large', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareRight(9, crossword)).toThrow();
    });

    it('returns null if the square is in the right column', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(getNextNonBlackSquareRight(8, crossword)).toBeNull();
    });

    it('returns null if there are only black squares right of the square', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[2].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareRight(0, crossword)).toBeNull();
    });

    it('returns the square to the right if it isnt black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        populateIndicesAsValues(crossword);

        expect(getNextNonBlackSquareRight(4, crossword)!.value).toBe('5');
    });

    it('skips some squares if the ones to the right are black', () => {
        const crossword = createNewCrossword({width: 4, height: 4});
        populateIndicesAsValues(crossword);
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[2].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareRight(0, crossword)!.value).toBe('3');
    });
});

describe('getNextNonBlackSquareAbove', () => {
    it('throws if the index is too small', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareAbove(-1, crossword)).toThrow();
    });

    it('throws if the index is too large', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareAbove(9, crossword)).toThrow();
    });

    it('returns null if the square is in the top row', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(getNextNonBlackSquareAbove(2, crossword)).toBeNull();
    });
    
    it('returns null if there are only black squares above the square', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[1].color = SquareColor.BLACK;
        crossword.squares[4].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareAbove(7, crossword)).toBeNull();
    });

    it('returns the square above if it isnt black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        populateIndicesAsValues(crossword);

        expect(getNextNonBlackSquareAbove(4, crossword)!.value).toBe('1');
    });

    it('skips some squares if the ones above are black', () => {
        const crossword = createNewCrossword({width: 4, height: 4});
        populateIndicesAsValues(crossword);
        crossword.squares[4].color = SquareColor.BLACK;
        crossword.squares[8].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareAbove(12, crossword)!.value).toBe('0');
    });
});

describe('getNextNonBlackSquareBelow', () => {
    it('throws if the index is too small', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareBelow(-1, crossword)).toThrow();
    });

    it('throws if the index is too large', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(() => getNextNonBlackSquareBelow(9, crossword)).toThrow();
    });

    it('returns null if the square is in the top row', () => {
        const crossword = createNewCrossword({width: 3, height: 3});

        expect(getNextNonBlackSquareBelow(6, crossword)).toBeNull();
    });

    it('returns null if there are only black squares below the square', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        crossword.squares[4].color = SquareColor.BLACK;
        crossword.squares[7].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareBelow(1, crossword)).toBeNull();
    });

    it('returns the square below if it isnt black', () => {
        const crossword = createNewCrossword({width: 3, height: 3});
        populateIndicesAsValues(crossword);

        expect(getNextNonBlackSquareBelow(4, crossword)!.value).toBe('7');
    });

    it('skips some squares if the ones below are black', () => {
        const crossword = createNewCrossword({width: 4, height: 4});
        populateIndicesAsValues(crossword);
        crossword.squares[4].color = SquareColor.BLACK;
        crossword.squares[8].color = SquareColor.BLACK;

        expect(getNextNonBlackSquareBelow(0, crossword)!.value).toBe('12');
    });
});

function populateIndicesAsValues(crossword: Crossword): void {
    for (let i=0; i<crossword.squares.length; i++) {
        crossword.squares[i].value = String(i);
    }
}