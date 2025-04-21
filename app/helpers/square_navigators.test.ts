import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, SquareColor } from '../models/crossword';
import { getPreviousNonBlackSquare, getNextNonBlackEmptySquare } from './square_navigators';

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