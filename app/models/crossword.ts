import { Input } from "postcss";
import { getActiveWordSquares } from "../helpers/square_navigators";
import next from "next";

export interface Dimensions {
    width: number;
    height: number;
}

export enum SquareColor {
    UNSPECIFIED = 'unspecified',
    BLACK = 'black',
    WHITE = 'white'
}

export interface Square {
    color: SquareColor;
    value: string;
    number: number|null;
    active: boolean;
    inActiveWord: boolean;
}

interface ClueSet {
    across: Clue[];  // Clue number to object
    down: Clue[];  // Clue number to object
}

export interface Clue {
    number: number;
    text: string;
    range: ClueRange;
}

export interface ClueRange {
    direction: InputDirection;
    startIndex: number;
    endIndex: number;
}

export enum InputDirection {
    UNSPECIFIED,
    ACROSS,
    DOWN
}

export class Crossword {
    public readonly dimensions: Dimensions;
    public readonly squares: Square[];
    public readonly clues: ClueSet;

    constructor(dimensions: Dimensions, squares: Square[]|null, clues: ClueSet|null) {
        this.validateDimensions(dimensions);
        this.dimensions = dimensions;
        if (squares) {
            this.squares = squares;
        } else {
            const numSquares = dimensions.width * dimensions.height;
            this.squares = [];
            for (let i=0; i<numSquares; i++) {
                const square: Square = {
                    color: SquareColor.WHITE,
                    value: '',
                    number: null,
                    active: false,
                    inActiveWord: false
                };
                this.squares.push(square);
            }
        }
        this.clues = this.calculateNumbersAndClues(clues);
    }

    private calculateNumbersAndClues(clues: ClueSet|null): ClueSet {
        const acrossClues: Clue[] = [];
        const downClues: Clue[] = [];
        const startIndexToClueAcross = this.getStartIndexToClue(InputDirection.ACROSS, clues);
        const startIndexToClueDown = this.getStartIndexToClue(InputDirection.DOWN, clues);
        let counter = 1;
        for (let i=0; i<this.squares.length; i++) {
            const square = this.squares[i];
            if (square.color == SquareColor.BLACK) {
                square.number = null;
            } else if (this.isLeftSquare(i) || this.squareIsRightOfBlack(i) || this.isTopSquare(i) || this.squareIsUnderBlack(i)) {
                square.number = counter;
                counter++;
                if (this.isLeftSquare(i) || this.squareIsRightOfBlack(i)) {
                    const range: ClueRange = {
                        direction: InputDirection.ACROSS,
                        startIndex: i,
                        endIndex: this.getLastIndexOfWord(i, InputDirection.ACROSS)
                    }
                    const prevClue = this.getPreviousClue(startIndexToClueAcross, range);
                    const clue: Clue = {
                        number: square.number,
                        text: prevClue ? prevClue.text : '',
                        range
                    };
                    acrossClues.push(clue);
                }
                if (this.isTopSquare(i) || this.squareIsUnderBlack(i)) {
                    const range: ClueRange = {
                        direction: InputDirection.DOWN,
                        startIndex: i,
                        endIndex: this.getLastIndexOfWord(i, InputDirection.DOWN)
                    }
                    const prevClue = this.getPreviousClue(startIndexToClueDown, range);
                    const clue: Clue = {
                        number: square.number,
                        text: prevClue ? prevClue.text : '',
                        range
                    };
                    downClues.push(clue);
                }
            } else {
                square.number = null;
            }
        }
        return {across: acrossClues, down: downClues};
    }

    private validateDimensions(dimensions: Dimensions): void {
        if (dimensions.width < 1 || !Number.isSafeInteger(dimensions.width) || dimensions.height < 1 || !Number.isSafeInteger(dimensions.height)) {
            throw new Error('Dimensions are invalid');
        }
    }

    private isTopSquare(index: number): boolean {
        return index >= 0 && index < this.dimensions.width;
    }

    private isBottomSquare(index: number): boolean {
        return index < this.squares.length && index >= this.dimensions.width * (this.dimensions.height - 1);
    }

    private isLeftSquare(index: number): boolean {
        return index >= 0 && index % this.dimensions.width == 0;
    }

    private isRightSquare(index: number): boolean {
        return index >= 0 && (index + 1) % this.dimensions.width == 0;
    }

    private squareIsRightOfBlack(index: number): boolean {
        return !this.isLeftSquare(index) && this.squares[index - 1].color == SquareColor.BLACK;
    }

    private squareIsUnderBlack(index: number): boolean {
        return !this.isTopSquare(index) && this.squares[index - this.dimensions.width].color == SquareColor.BLACK;
    }

    private getLastIndexOfWord(index: number, direction: InputDirection): number {
        let currentIndex = index;
        let searching = true;
        const incrementor = direction == InputDirection.ACROSS ? 1 : this.dimensions.width;
        while (searching) {
            const nextIndex = currentIndex + incrementor;
            if (direction == InputDirection.ACROSS ? this.isRightSquare(currentIndex) : this.isBottomSquare(currentIndex)) {
                searching = false;
            } else if (nextIndex > this.squares.length - 1 || this.squares[nextIndex].color == SquareColor.BLACK) {
                searching = false;
            } else {
                currentIndex = nextIndex;
            }
        }
        return currentIndex;
    } 

    private getStartIndexToClue(direction: InputDirection, clues: ClueSet|null): Record<number, Clue> {
        if (!clues) {
            return {};
        }
        const directionalClues = direction == InputDirection.ACROSS ? clues.across : clues.down;
        const startToClue: Record<number, Clue> = {};
        for (let clue of directionalClues) {
            startToClue[clue.range.startIndex] = clue;
        }
        return startToClue;
    }

    private getPreviousClue(startIndexToClue: Record<number, Clue>, range: ClueRange): Clue|null {
        const prevClue = startIndexToClue[range.startIndex];
        if (!prevClue || prevClue.range.endIndex != range.endIndex) {
            return null;
        }
        return prevClue;
    }
}

export function createNewCrossword(dimensions: Dimensions): Crossword {
    return new Crossword(dimensions, null, null);
}

export function duplicateCrossword(crossword: Crossword): Crossword {
    const squares: Square[] = crossword.squares.map(s => duplicateSquare(s));
    return new Crossword(duplicateDimensions(crossword.dimensions), squares, crossword.clues);
}

function duplicateDimensions(dimensions: Dimensions): Dimensions {
    return {
        width: dimensions.width,
        height: dimensions.height
    }
}

function duplicateSquare(square: Square): Square {
    return {
        value: square.value,
        color: square.color,
        number: square.number,
        active: square.active,
        inActiveWord: square.inActiveWord
    };
}

export function markActiveWordAndDuplicateCrossword(crossword: Crossword, direction: InputDirection): Crossword {
    // Clear current active marks
    for (let square of crossword.squares) {
        square.inActiveWord = false;
    }
    const activeWordSquares = getActiveWordSquares(direction, crossword);
    for (let activeWordSquare of activeWordSquares) {
        activeWordSquare.inActiveWord = true;
    }
    return duplicateCrossword(crossword);
}