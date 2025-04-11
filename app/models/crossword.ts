export interface Crossword {
    dimensions: Dimensions;
    squares: Square[];
}

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
}

export function createNewCrossword(dimensions: Dimensions): Crossword {
    const numSquares = dimensions.width * dimensions.height;
    const squares: Square[] = [];
    for (let i=0; i<numSquares; i++) {
        const square: Square = {
            color: SquareColor.WHITE,
            value: ''
        };
        squares.push(square);
    }
    return {dimensions, squares};
}