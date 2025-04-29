import { describe, expect, it } from '@jest/globals';
import { createNewCrossword, Crossword, duplicateCrossword, InputDirection, SquareColor } from '../models/crossword';
import { getPreviousNonBlackSquare, getNextNonBlackEmptySquare, getActiveWordSquares, getNextNonBlackSquareAbove, getNextNonBlackSquareBelow, getNextNonBlackSquareLeft, getNextNonBlackSquareRight } from './square_navigators';

describe('getPreviousNonBlackSquare', () => {
    describe('Across', () => {
        it('returns the first square if the index is 0', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getPreviousNonBlackSquare(InputDirection.ACROSS, 0, crossword);
    
            expect(square.number).toBe(1);
        });
    
        it('returns the previous square if the previous square is non-black', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getPreviousNonBlackSquare(InputDirection.ACROSS, 1, crossword);
    
            expect(square.number).toBe(1);
        });
    
        it('returns several squares back if the previous squares were black', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[1].color = SquareColor.BLACK;
            crossword.squares[2].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword); // Redo numbers
            const square = getPreviousNonBlackSquare(InputDirection.ACROSS, 3, crossword);
    
            expect(square.number).toBe(1);
        });
    
        it('returns original square if there are only black squares before', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[0].color = SquareColor.BLACK;
            crossword.squares[1].color = SquareColor.BLACK;
            crossword.squares[2].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword);  // Redo numbers
            const square = getPreviousNonBlackSquare(InputDirection.ACROSS, 3, crossword);
    
            expect(square.number).toBe(1);
        });
    
        it('throws an error if the index is too large', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getPreviousNonBlackSquare(InputDirection.ACROSS, 10, crossword)).toThrow();
        });
    
        it('throws an error if the index is too small', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getPreviousNonBlackSquare(InputDirection.ACROSS, -1, crossword)).toThrow();
        });
    });

    describe('Down', () => {
        it('returns the previous square in the word if there is one', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getPreviousNonBlackSquare(InputDirection.DOWN, 4, crossword);

            expect(square.number).toBe(2);
        });

        it('returns last square of the previous word in the same row if the first square is the first square of a word', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getPreviousNonBlackSquare(InputDirection.DOWN, 1, crossword);

            expect(square.number).toBe(5);
        });

        it('returns last square of the last word in an upper row if the first square is the first square of the first word in a row', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[0].color = SquareColor.BLACK;
            crossword.squares[3].color = SquareColor.BLACK;
            populateIndicesAsValues(crossword);
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getPreviousNonBlackSquare(InputDirection.DOWN, 6, crossword);

            expect(square.value).toBe('8');
        });

        it('returns the original square if the index is 0', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getPreviousNonBlackSquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(1);
        });

        it('returns the original square if original square is the first non-black square', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[0].color = SquareColor.BLACK;
            crossword.squares[1].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getPreviousNonBlackSquare(InputDirection.DOWN, 2, crossword);

            expect(square.number).toBe(1);
        });

        it('throws an error if the index is too large', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getPreviousNonBlackSquare(InputDirection.DOWN, 10, crossword)).toThrow();
        });
    
        it('throws an error if the index is too small', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getPreviousNonBlackSquare(InputDirection.DOWN, -1, crossword)).toThrow();
        });
    });
});

describe('getNextNonBlackEmptySquare', () => {
    describe('Across', () => {
        it('returns the last square if the index is the last entry', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            populateIndicesAsValues(crossword);
            const square = getNextNonBlackEmptySquare(InputDirection.ACROSS, 8, crossword);
    
            expect(square.value).toBe('8');
        });
    
        it('returns the original square if the index is the last non-black square', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            populateIndicesAsValues(crossword);
            crossword.squares[8].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.ACROSS, 7, crossword);
    
            expect(square.value).toBe('7');
        });
    
        it('returns the next square if the next square is non-black and empty', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getNextNonBlackEmptySquare(InputDirection.ACROSS, 1, crossword);
    
            expect(square.number).toBe(3);
        });
    
        it('returns several squares later if the following squares are not empty', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[1].value = 'A';
            crossword.squares[2].value = 'B';
            const square = getNextNonBlackEmptySquare(InputDirection.ACROSS, 0, crossword);
    
            expect(square.number).toBe(4);
        });
    
        it('returns several squares later if the following squares are black', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[1].color = SquareColor.BLACK;
            crossword.squares[2].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.ACROSS, 0, crossword);
    
            expect(square.number).toBe(2);
        });
    
        it('throws an error if the index is too large', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getNextNonBlackEmptySquare(InputDirection.ACROSS, 9, crossword)).toThrow();
        });
    
        it('throws an error if the index is too small', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getNextNonBlackEmptySquare(InputDirection.ACROSS, -1, crossword)).toThrow();
        });
    });

    describe('Down', () => {
        it('returns the next square in the same word if it is empty', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(4);
        });

        it('skips to the next empty square in the same word if the following letters are filled in', () => {
            const crossword = createNewCrossword({width: 3, height: 4});
            crossword.squares[3].value = 'A';
            crossword.squares[6].value = 'B';
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(6);
        });

        it('skips to the first letter of the next word that starts in the same row if that is empty and the rest of the word is full', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[3].value = 'A';
            crossword.squares[6].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(2);
        });

        it('skips to the next empty square of the next word that starts in the same row if the rest of the word is full', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[3].color = SquareColor.BLACK;
            crossword.squares[1].value = 'A';
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(4);
        });

        it('skips to a later word if all words that start in that row are full', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[2].color = SquareColor.BLACK;
            crossword.squares[1].value = 'C';
            crossword.squares[4].value = 'A';
            crossword.squares[7].value = 'T';
            crossword.squares[3].value = 'D';
            crossword.squares[6].value = 'O';
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(4);
        });

        it('returns the last square if all other following squares have values', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[3].value = 'T';
            crossword.squares[6].color = SquareColor.BLACK;
            crossword.squares[1].value = 'D';
            crossword.squares[4].value = 'O';
            crossword.squares[7].color = SquareColor.BLACK;
            crossword.squares[2].value = 'C';
            crossword.squares[5].value = 'A';
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 0, crossword);

            expect(square.number).toBe(5);
        });

        it('returns the last square if all other following squares are black', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[2].color = SquareColor.BLACK;
            crossword.squares[5].color = SquareColor.BLACK;
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 7, crossword);

            expect(square.number).toBe(5);
        });

        it('returns the original square if that square is the last one', () => {
            const crossword = createNewCrossword({width: 3, height: 1});
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 2, crossword);
            
            expect(square.number).toBe(3);
        });

        it('returns the original square if all the following squares are full', () => {
            let crossword = createNewCrossword({width: 3, height: 3});
            crossword.squares[2].color = SquareColor.BLACK;
            crossword.squares[1].value = 'C';
            crossword.squares[4].value = 'A';
            crossword.squares[7].value = 'T';
            crossword.squares[5].value = 'D';
            crossword.squares[8].value = 'O';
            crossword = duplicateCrossword(crossword);  // Redo numbering
            const square = getNextNonBlackEmptySquare(InputDirection.DOWN, 6, crossword);

            expect(square.number).toBe(5);
        });

        it('throws an error if the index is too large', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getNextNonBlackEmptySquare(InputDirection.DOWN, 9, crossword)).toThrow();
        });
    
        it('throws an error if the index is too small', () => {
            const crossword = createNewCrossword({width: 3, height: 3});
    
            expect(() => getNextNonBlackEmptySquare(InputDirection.DOWN, -1, crossword)).toThrow();
        });
    });
});

describe('getActiveWordSquares', () => {
    describe('Across', () => {
        it('returns an empty list if no squares are marked active', () => {
            const crossword = createNewCrossword({width: 5, height: 3});
    
            expect(getActiveWordSquares(InputDirection.ACROSS, crossword)).toHaveLength(0);
        });
    
        it('returns the active square and all squares to the right if the active is the first square', () => {
            const crossword = createNewCrossword({width: 5, height: 3});
            populateIndicesAsValues(crossword);
            crossword.squares[6].color = SquareColor.BLACK;
            crossword.squares[7].active = true;
    
            const activeWordSquares = getActiveWordSquares(InputDirection.ACROSS, crossword);
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
    
            const activeWordSquares = getActiveWordSquares(InputDirection.ACROSS, crossword);
            expect(activeWordSquares).toHaveLength(3);
            expect(activeWordSquares[0].value).toBe('7');
            expect(activeWordSquares[1].value).toBe('8');
            expect(activeWordSquares[2].value).toBe('9');
        });
    
        it('returns all the way to the ends of the row if there are no black squares', () => {
            const crossword = createNewCrossword({width: 5, height: 3});
            populateIndicesAsValues(crossword);
            crossword.squares[7].active = true;
    
            const activeWordSquares = getActiveWordSquares(InputDirection.ACROSS, crossword);
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
    
            const activeWordSquares = getActiveWordSquares(InputDirection.ACROSS, crossword);
            expect(activeWordSquares).toHaveLength(3);
            expect(activeWordSquares[0].value).toBe('6');
            expect(activeWordSquares[1].value).toBe('7');
            expect(activeWordSquares[2].value).toBe('8');
        });
    });
    
    describe('Down', () => {
        it('returns an empty list if no squares are marked active', () => {
            const crossword = createNewCrossword({width: 5, height: 3});
    
            expect(getActiveWordSquares(InputDirection.DOWN, crossword)).toHaveLength(0);
        });

        it('returns the active square and all squares below if the active is the first square', () => {
            const crossword = createNewCrossword({width: 3, height: 5});
            populateIndicesAsValues(crossword);
            crossword.squares[4].color = SquareColor.BLACK;
            crossword.squares[7].active = true;
    
            const activeWordSquares = getActiveWordSquares(InputDirection.DOWN, crossword);
            expect(activeWordSquares).toHaveLength(3);
            expect(activeWordSquares[0].value).toBe('7');
            expect(activeWordSquares[1].value).toBe('10');
            expect(activeWordSquares[2].value).toBe('13');
        });

        it('returns the active square and all squares above if the active is the last square', () => {
            const crossword = createNewCrossword({width: 3, height: 5});
            populateIndicesAsValues(crossword);
            crossword.squares[4].color = SquareColor.BLACK;
            crossword.squares[13].active = true;
    
            const activeWordSquares = getActiveWordSquares(InputDirection.DOWN, crossword);
            expect(activeWordSquares).toHaveLength(3);
            expect(activeWordSquares[0].value).toBe('7');
            expect(activeWordSquares[1].value).toBe('10');
            expect(activeWordSquares[2].value).toBe('13');
        });

        it('returns all the way to the ends of the column if there are no black squares', () => {
            const crossword = createNewCrossword({width: 3, height: 5});
            populateIndicesAsValues(crossword);
            crossword.squares[7].active = true;
    
            const activeWordSquares = getActiveWordSquares(InputDirection.DOWN, crossword);
            expect(activeWordSquares).toHaveLength(5);
            expect(activeWordSquares[0].value).toBe('1');
            expect(activeWordSquares[1].value).toBe('4');
            expect(activeWordSquares[2].value).toBe('7');
            expect(activeWordSquares[3].value).toBe('10');
            expect(activeWordSquares[4].value).toBe('13');
        });

        it('returns all the way to black squares if there are black squares before the ends of the row', () => {
            const crossword = createNewCrossword({width: 3, height: 5});
            populateIndicesAsValues(crossword);
            crossword.squares[1].color = SquareColor.BLACK;
            crossword.squares[13].color = SquareColor.BLACK;
            crossword.squares[7].active = true;
    
            const activeWordSquares = getActiveWordSquares(InputDirection.DOWN, crossword);
            expect(activeWordSquares).toHaveLength(3);
            expect(activeWordSquares[0].value).toBe('4');
            expect(activeWordSquares[1].value).toBe('7');
            expect(activeWordSquares[2].value).toBe('10');
        });
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