import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, Crossword, SquareColor } from '../models/crossword';
import { getPreviousNonBlackSquare, getNextNonBlackEmptySquare, getActiveWordSquares } from './square_navigators';

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

        expect(() => getNextNonBlackEmptySquare(10, crossword)).toThrow();
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

function populateIndicesAsValues(crossword: Crossword): void {
    for (let i=0; i<crossword.squares.length; i++) {
        crossword.squares[i].value = String(i);
    }
}