export interface Crossword {
    squares: Square[];
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

export function createNewCrossword(): Crossword {
    const squares: Square[] = [];
    for (let i=0; i<225; i++) {
        const square: Square = {
            color: SquareColor.WHITE,
            value: ''
        };
        squares.push(square);
    }
    return {squares};
}