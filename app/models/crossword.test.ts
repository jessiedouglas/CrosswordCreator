import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, SquareColor } from './crossword';

describe('Crossword', () => { 
    describe('initialization', () => {
        it('creates a number of squares equal to the product of the dimensions', () => {
            const crossword = createNewCrossword({height: 3, width: 5});
            expect(crossword.squares).toHaveLength(15);
        });

        it('throws an error if the width is less than 1', () => {
            expect(() => createNewCrossword({height: 3, width: 0})).toThrow();
        });

        it('throws an error if the height is less than 1', () => {
            expect(() => createNewCrossword({height: 0, width: 5})).toThrow();
        });

        it('throws an error if the width is not an integer', () => {
            expect(() => createNewCrossword({height: 3, width: 4.5})).toThrow();
        });

        it('throws an error if the height is not an integer', () => {
            expect(() => createNewCrossword({height: 3.5, width: 5})).toThrow();
        });

        it('creates all squares as white', () => {
            const crossword = createNewCrossword({height: 2, width: 2});
            expect(crossword.squares[0].color).toBe(SquareColor.WHITE);
            expect(crossword.squares[1].color).toBe(SquareColor.WHITE);
            expect(crossword.squares[2].color).toBe(SquareColor.WHITE);
            expect(crossword.squares[3].color).toBe(SquareColor.WHITE);
        });

        it('creates squares already numbered', () => {
            const crossword = createNewCrossword({height: 2, width: 2});
            expect(crossword.squares[0].number).toBe(1);
            expect(crossword.squares[1].number).toBe(2);
            expect(crossword.squares[2].number).toBe(3);
            expect(crossword.squares[3].number).toBeNull();
        });
    });

    describe('calculateNumbers', () => {
        it('only numbers top and left squares if there are no black squares', () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            // First row
            expect(crossword.squares[0].number).toBe(1);
            expect(crossword.squares[1].number).toBe(2);
            expect(crossword.squares[2].number).toBe(3);
            // Second row
            expect(crossword.squares[3].number).toBe(4);
            expect(crossword.squares[4].number).toBeNull();
            expect(crossword.squares[5].number).toBeNull();
            // Third row
            expect(crossword.squares[6].number).toBe(5);
            expect(crossword.squares[7].number).toBeNull();
            expect(crossword.squares[8].number).toBeNull();
        });

        it('doesnt number black squares', () => {
            const crossword = createNewCrossword({height: 2, width: 2});
            for (let square of crossword.squares) {
                square.color = SquareColor.BLACK;
            }
            crossword.calculateNumbers();

            expect(crossword.squares[0].number).toBeNull();
            expect(crossword.squares[1].number).toBeNull();
            expect(crossword.squares[2].number).toBeNull();
            expect(crossword.squares[3].number).toBeNull();
        });

        it('numbers squares to the bottom and right of black squares', () => {
            const crossword = createNewCrossword({height: 3, width: 3});
            crossword.squares[4].color = SquareColor.BLACK;
            crossword.calculateNumbers();

            // First row
            expect(crossword.squares[0].number).toBe(1);
            expect(crossword.squares[1].number).toBe(2);
            expect(crossword.squares[2].number).toBe(3);
            // Second row
            expect(crossword.squares[3].number).toBe(4);
            expect(crossword.squares[4].number).toBeNull();
            expect(crossword.squares[5].number).toBe(5);
            // Third row
            expect(crossword.squares[6].number).toBe(6);
            expect(crossword.squares[7].number).toBe(7);
            expect(crossword.squares[8].number).toBeNull();
        });
    });
});