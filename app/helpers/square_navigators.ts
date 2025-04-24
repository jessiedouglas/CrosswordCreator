import { start } from "repl";
import { Crossword, Square, SquareColor } from "../models/crossword";
/**
 * Gets the previous square in order that isn't black. If there are no previous
 * non-black squares, returns the square indicated by the starting index.
 * 
 * @param startingIndex The square's index to look before to find a nonblack 
 * square.
 * @param crossword The crossword to search through.
 */
export function getPreviousNonBlackSquare(startingIndex: number, crossword: Crossword): Square {
    if (startingIndex == 0) {
        return crossword.squares[startingIndex];
    }
    let i = startingIndex - 1;
    let prevSquare = crossword.squares[i];
    while (prevSquare.color == SquareColor.BLACK && i > 0) {
        i--;
        prevSquare = crossword.squares[i];
    }
    if (i == 0 && prevSquare.color == SquareColor.BLACK) {
        // All squares prior were black. Return the original square.
        return crossword.squares[startingIndex];
    }
    return prevSquare;
}

/**
 * Gets the next square after the starting index that both empty (no value) and 
 * is not black. If no square exists, the square indicated by the starting
 * index is returned.
 * 
 * @param startingIndex The square's index to look after to find a nonblack
 * empty square.
 * @param crossword The crossword to search through.
 */
export function getNextNonBlackEmptySquare(startingIndex: number, crossword: Crossword): Square {
    if (startingIndex < 0) {
        throw new Error('Index out of bounds.');
    }
    if (startingIndex == crossword.squares.length - 1) {
        return crossword.squares[startingIndex];
    }
    let i = startingIndex + 1;
    let nextSquare = crossword.squares[i];
    while ((nextSquare.color == SquareColor.BLACK || nextSquare.value) && i + 1 < crossword.squares.length) {
        i++;
        nextSquare = crossword.squares[i];
    }
    if (i == crossword.squares.length - 1 && (nextSquare.value || nextSquare.color == SquareColor.BLACK)) {
        // All the following squares were black or empty. Return the original 
        // square instead.
        return crossword.squares[startingIndex];
    }
    return nextSquare;
};

/**
 * @param crossword 
 * @returns A list of squares in the active word as indicated by the 'active' 
 * property. If there is no active word, returns an empty list.
 */
export function getActiveWordSquares(crossword: Crossword): Square[] {
    const activeSquareIndex = crossword.squares.findIndex((s) => s.active);
    if (activeSquareIndex == -1) {
        // Not found
        return [];
    }
    // Find index of first square
    let currentIndex = activeSquareIndex;
    let searching = true;
    while (searching) {
        const squareLeft = getSquareLeft(currentIndex, crossword);
        if (!squareLeft || squareLeft.color == SquareColor.BLACK) {
            searching = false;
        } else {
            currentIndex--;
        }
    }

    const activeWordSquares = [crossword.squares[currentIndex]];
    searching = true;
    while (searching) {
        const squareRight = getSquareRight(currentIndex, crossword);
        if (!squareRight || squareRight.color == SquareColor.BLACK) {
            searching = false;
        } else {
            activeWordSquares.push(squareRight);
            currentIndex++;
        }
    }
    return activeWordSquares;
}

/**
 * @param index 
 * @param crossword 
 * @returns The square to the left of the given index, or null if the square is
 * on the left edge of the crossword.
 */
function getSquareLeft(index: number, crossword: Crossword): Square|null {
    if (index < 0 || index >= crossword.squares.length) {
        throw new Error('Index out of bounds');
    }
    if (index % crossword.dimensions.width == 0) {
        return null;
    }
    return crossword.squares[index - 1];
}

/**
 * @param index 
 * @param crossword 
 * @returns The square to the right of the given index, or null if the square is
 * on the right edge of the crossword.
 */
function getSquareRight(index: number, crossword: Crossword): Square|null {
    if (index < 0 || index >= crossword.squares.length) {
        throw new Error('Index out of bounds');
    }
    if (index % crossword.dimensions.width == crossword.dimensions.width - 1) {
        return null;
    }
    return crossword.squares[index + 1];
}