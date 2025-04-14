export interface Dimensions {
    width: number;
    height: number;
}

export enum SquareColor {
    UNSPECIFIED = 'unspecified',
    BLACK = 'black',
    WHITE = 'white'
}

interface Square {
    color: SquareColor;
    value: string;
    number: number|null;
}

export class Crossword {
    public dimensions: Dimensions;
    public squares: Square[];

    constructor(dimensions: Dimensions) {
        this.validateDimensions(dimensions);
        this.dimensions = dimensions;
        const numSquares = dimensions.width * dimensions.height;
        this.squares = [];
        for (let i=0; i<numSquares; i++) {
            const square: Square = {
                color: SquareColor.WHITE,
                value: '',
                number: null,
            };
            this.squares.push(square);
        }
        this.calculateNumbers();
    }

    public calculateNumbers(): void {
        let counter = 1;
        for (let i=0; i<this.squares.length; i++) {
            const square = this.squares[i];
            if (square.color == SquareColor.BLACK) {
                square.number = null;
            } else if (this.isTopSquare(i) || this.isLeftSquare(i) || this.squareIsRightOfOrUnderBlack(i)) {
                square.number = counter;
                counter++;
            } else {
                square.number = null;
            }
        }
    }

    private validateDimensions(dimensions: Dimensions): void {
        if (dimensions.width < 1 || !Number.isSafeInteger(dimensions.width) || dimensions.height < 1 || !Number.isSafeInteger(dimensions.height)) {
            throw new Error('Dimensions are invalid');
        }
    }

    private isTopSquare(index: number): boolean {
        return index >= 0 && index < this.dimensions.width;
    }

    private isLeftSquare(index: number): boolean {
        return index >= 0 && index % this.dimensions.width == 0;
    }

    private squareIsRightOfOrUnderBlack(index: number): boolean {
        const rightOfBlack = !this.isLeftSquare(index) && this.squares[index - 1].color == SquareColor.BLACK;
        const underBlack = !this.isTopSquare(index) && this.squares[index - this.dimensions.width].color == SquareColor.BLACK;
        return rightOfBlack || underBlack;
    }
}

export function createNewCrossword(dimensions: Dimensions): Crossword {
    return new Crossword(dimensions);
}