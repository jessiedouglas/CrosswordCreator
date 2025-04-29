import { describe, expect, it } from '@jest/globals';
import { Clue, ClueRange, createNewCrossword, duplicateCrossword, InputDirection, markActiveWordAndDuplicateCrossword, SquareColor } from './crossword';

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

        it('creates empty clues for each across and down word', () => {
            const crossword = createNewCrossword({height: 2, width: 2});

            const across1: Clue = {
                number: 1,
                text: '',
                range: {
                    direction: InputDirection.ACROSS,
                    startIndex: 0,
                    endIndex: 1
                }
            };
            const across2: Clue = {
                number: 3,
                text: '',
                range: {
                    direction: InputDirection.ACROSS,
                    startIndex: 2,
                    endIndex: 3
                }
            };
            const down1: Clue = {
                number: 1,
                text: '',
                range: {
                    direction: InputDirection.DOWN,
                    startIndex: 0,
                    endIndex: 2
                }
            };
            const down2: Clue = {
                number: 2,
                text: '',
                range: {
                    direction: InputDirection.DOWN,
                    startIndex: 1,
                    endIndex: 3
                }
            };
            expect(crossword.clues.across).toHaveLength(2);
            expect(crossword.clues.across[0]).toEqual(across1);
            expect(crossword.clues.across[1]).toEqual(across2);
            expect(crossword.clues.down).toHaveLength(2);
            expect(crossword.clues.down[0]).toEqual(down1);
            expect(crossword.clues.down[1]).toEqual(down2);
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

        it('regenerates clues for squares', () => {
            const prevCrossword = createNewCrossword({height: 2, width: 2});
            prevCrossword.squares[0].color = SquareColor.BLACK;
            const newCrossword = duplicateCrossword(prevCrossword);

            const rangeAcross1: ClueRange = {
                direction: InputDirection.ACROSS,
                startIndex: 1,
                endIndex: 1
            };
            const rangeAcross2: ClueRange = {
                direction: InputDirection.ACROSS,
                startIndex: 2,
                endIndex: 3
            };
            const rangeDown1: ClueRange = {
                direction: InputDirection.DOWN,
                startIndex: 1,
                endIndex: 3
            };
            const rangeDown2: ClueRange = {
                direction: InputDirection.DOWN,
                startIndex: 2,
                endIndex: 2
            };
            expect(newCrossword.clues.across).toHaveLength(2);
            expect(newCrossword.clues.across[0].number).toBe(1);
            expect(newCrossword.clues.across[0].range).toEqual(rangeAcross1);
            expect(newCrossword.clues.across[1].number).toBe(2);
            expect(newCrossword.clues.across[1].range).toEqual(rangeAcross2);
            expect(newCrossword.clues.down).toHaveLength(2);
            expect(newCrossword.clues.down[0].number).toBe(1);
            expect(newCrossword.clues.down[0].range).toEqual(rangeDown1);
            expect(newCrossword.clues.down[1].number).toBe(2);
            expect(newCrossword.clues.down[1].range).toEqual(rangeDown2);
        });

        it('preserves previous across clues if the range is the same', () => {
            const prevCrossword = createNewCrossword({height: 1, width: 3});
            prevCrossword.clues.across[0].text = "Sample clue";
            const newCrossword = duplicateCrossword(prevCrossword);

            expect(newCrossword.clues.across[0].text).toBe('Sample clue');
        });

        it('preserves previous down clues if the range is the same', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 1});
            prevCrossword.clues.down[0].text = "Sample clue";
            const newCrossword = duplicateCrossword(prevCrossword);

            expect(newCrossword.clues.down[0].text).toBe('Sample clue');
        });

        it('removes previous across clues if the range isnt the same', () => {
            const prevCrossword = createNewCrossword({height: 1, width: 3});
            prevCrossword.clues.across[0].text = "Sample clue";
            prevCrossword.squares[2].color = SquareColor.BLACK;
            const newCrossword = duplicateCrossword(prevCrossword);

            expect(newCrossword.clues.across[0].text).toBe('');
        });

        it('removes previous down clues if the range isnt the same', () => {
            const prevCrossword = createNewCrossword({height: 3, width: 1});
            prevCrossword.clues.down[0].text = "Sample clue";
            prevCrossword.squares[2].color = SquareColor.BLACK;
            const newCrossword = duplicateCrossword(prevCrossword);

            expect(newCrossword.clues.down[0].text).toBe('');
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