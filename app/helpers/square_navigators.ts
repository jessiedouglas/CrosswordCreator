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