import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, duplicateCrossword, markActiveWordAndDuplicateCrossword, SquareColor } from './crossword';
import { InputDirection } from '../helpers/square_navigators';

describe('Crossword', () => { 
    describe('createNewCrossword', () => {
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

    describe('duplicateCrossword', () => {
        it('preserves the dimensions', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 7});

            const newCrossword = duplicateCrossword(prevCrossword);
            expect(newCrossword.dimensions.height).toBe(3);
            expect(newCrossword.dimensions.width).toBe(7);
        });

        it('preserves values and colors of squares', () => {
            const prevCrossword = createNewCrossword({height: 1, width: 2});
            prevCrossword.squares[0].value = 'a';
            prevCrossword.squares[1].color = SquareColor.BLACK;

            const newCrossword = duplicateCrossword(prevCrossword);
            expect(newCrossword.squares[0].color).toBe(SquareColor.WHITE);
            expect(newCrossword.squares[0].value).toBe('a');
            expect(newCrossword.squares[1].color).toBe(SquareColor.BLACK);
            expect(newCrossword.squares[1].value).toBe('');
        });

        it('regenerates numbers for squares', () => {
            const prevCrossword = createNewCrossword({height: 1, width: 2});
            prevCrossword.squares[0].color = SquareColor.BLACK;
            expect(prevCrossword.squares[0].number).toBe(1);
            expect(prevCrossword.squares[1].number).toBe(2);

            const newCrossword = duplicateCrossword(prevCrossword);
            expect(newCrossword.squares[0].number).toBe(null);
            expect(newCrossword.squares[1].number).toBe(1);
        });
    });

    describe('markActiveWordAndDuplicateCrossword', () => {
        it('preserves the active square', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 3});
            prevCrossword.squares[4].active = true;

            const newCrossword = markActiveWordAndDuplicateCrossword(prevCrossword, InputDirection.DOWN);
            expect(newCrossword.squares[0].active).toBe(false);
            expect(newCrossword.squares[1].active).toBe(false);
            expect(newCrossword.squares[2].active).toBe(false);
            expect(newCrossword.squares[3].active).toBe(false);
            expect(newCrossword.squares[4].active).toBe(true);
            expect(newCrossword.squares[5].active).toBe(false);
            expect(newCrossword.squares[6].active).toBe(false);
            expect(newCrossword.squares[7].active).toBe(false);
            expect(newCrossword.squares[8].active).toBe(false);
        });

        it('marks the active word in the across direction', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 3});
            prevCrossword.squares[1].active = true;

            const newCrossword = markActiveWordAndDuplicateCrossword(prevCrossword, InputDirection.ACROSS);
            expect(newCrossword.squares[0].inActiveWord).toBe(true);
            expect(newCrossword.squares[1].inActiveWord).toBe(true);
            expect(newCrossword.squares[2].inActiveWord).toBe(true);
            expect(newCrossword.squares[3].inActiveWord).toBe(false);
            expect(newCrossword.squares[4].inActiveWord).toBe(false);
            expect(newCrossword.squares[5].inActiveWord).toBe(false);
            expect(newCrossword.squares[6].inActiveWord).toBe(false);
            expect(newCrossword.squares[7].inActiveWord).toBe(false);
            expect(newCrossword.squares[8].inActiveWord).toBe(false);
        });

        it('marks the active word in the down direction', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 3});
            prevCrossword.squares[1].active = true;

            const newCrossword = markActiveWordAndDuplicateCrossword(prevCrossword, InputDirection.DOWN);
            expect(newCrossword.squares[0].inActiveWord).toBe(false);
            expect(newCrossword.squares[1].inActiveWord).toBe(true);
            expect(newCrossword.squares[2].inActiveWord).toBe(false);
            expect(newCrossword.squares[3].inActiveWord).toBe(false);
            expect(newCrossword.squares[4].inActiveWord).toBe(true);
            expect(newCrossword.squares[5].inActiveWord).toBe(false);
            expect(newCrossword.squares[6].inActiveWord).toBe(false);
            expect(newCrossword.squares[7].inActiveWord).toBe(true);
            expect(newCrossword.squares[8].inActiveWord).toBe(false);
        });

        it('preserves the dimensions', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 7});

            const newCrossword = markActiveWordAndDuplicateCrossword(prevCrossword, InputDirection.ACROSS);
            expect(newCrossword.dimensions.height).toBe(3);
            expect(newCrossword.dimensions.width).toBe(7);
        });

        it('preserves values and colors of squares', () => {
            const prevCrossword = createNewCrossword({height: 1, width: 2});
            prevCrossword.squares[0].value = 'a';
            prevCrossword.squares[1].color = SquareColor.BLACK;

            const newCrossword = markActiveWordAndDuplicateCrossword(prevCrossword, InputDirection.ACROSS);
            expect(newCrossword.squares[0].color).toBe(SquareColor.WHITE);
            expect(newCrossword.squares[0].value).toBe('a');
            expect(newCrossword.squares[1].color).toBe(SquareColor.BLACK);
            expect(newCrossword.squares[1].value).toBe('');
        });

        it('regenerates numbers for squares', () => {
            const prevCrossword = createNewCrossword({height: 1, width: 2});
            prevCrossword.squares[0].color = SquareColor.BLACK;
            expect(prevCrossword.squares[0].number).toBe(1);
            expect(prevCrossword.squares[1].number).toBe(2);

            const newCrossword = markActiveWordAndDuplicateCrossword(prevCrossword, InputDirection.DOWN);
            expect(newCrossword.squares[0].number).toBe(null);
            expect(newCrossword.squares[1].number).toBe(1);
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
            const prevCrossword = createNewCrossword({height: 2, width: 2});
            for (let square of prevCrossword.squares) {
                square.color = SquareColor.BLACK;
            }
            const crossword = duplicateCrossword(prevCrossword);

            expect(crossword.squares[0].number).toBeNull();
            expect(crossword.squares[1].number).toBeNull();
            expect(crossword.squares[2].number).toBeNull();
            expect(crossword.squares[3].number).toBeNull();
        });

        it('numbers squares to the bottom and right of black squares', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 3});
            prevCrossword.squares[4].color = SquareColor.BLACK;
            const crossword = duplicateCrossword(prevCrossword);

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