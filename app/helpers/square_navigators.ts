import { start } from "repl";
import { Crossword, Square, SquareColor } from "../models/crossword";
import { Input } from "postcss";
import next from "next";


export enum InputDirection {
    UNSPECIFIED,
    ACROSS,
    DOWN
}

/**
 * Gets the previous square in order that isn't black. If there are no previous
 * non-black squares, returns the square indicated by the starting index.
 * 
 * @param startingIndex The square's index to look before to find a nonblack 
 * square.
 * @param crossword The crossword to search through.
 */
export function getPreviousNonBlackSquare(direction: InputDirection, startingIndex: number, crossword: Crossword): Square {
    if (startingIndex == 0) {
        return crossword.squares[startingIndex];
    }
    if (direction == InputDirection.ACROSS) {
        // This is just the last square in the array that isn't black
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
    }  else if (direction == InputDirection.DOWN) {
        // Step 1: Check to see if there are are any previous letters in the
        // same word.
        const squareAbove = getSquareAbove(startingIndex, crossword);
        if (squareAbove && squareAbove.color != SquareColor.BLACK) {
            return squareAbove;
        }
        // Step 2: If this was the first square of a word, find the previous
        // word in traversal order and return the last square of that word.
        const lastWordIndex = getPreviousWordIndex(direction, startingIndex, crossword);
        if (lastWordIndex == -1) {
            // No previous word or previous square. Return the original square.
            return crossword.squares[startingIndex];
        }
        let currentIndex = lastWordIndex;
        let squareBelow = getSquareBelow(currentIndex, crossword);
        while (squareBelow && squareBelow.color != SquareColor.BLACK) {
            currentIndex += crossword.dimensions.width;
            squareBelow = getSquareBelow(currentIndex, crossword);
        }
        return crossword.squares[currentIndex];
    } else {
        throw new Error('Unspecified input direction');
    }
}

/**
 * Gets the next square after the starting index that both empty (no value) and 
 * is not black. If no square exists, the square indicated by the starting
 * index is returned.
 * 
 * @param direction
 * @param startingIndex The square's index to look after to find a nonblack
 * empty square.
 * @param crossword The crossword to search through.
 */
export function getNextNonBlackEmptySquare(direction: InputDirection, startingIndex: number, crossword: Crossword): Square {
    if (startingIndex < 0) {
        throw new Error('Index out of bounds.');
    }
    if (startingIndex == crossword.squares.length - 1) {
        return crossword.squares[startingIndex];
    }
    let nextSquare = getNextOpenSquareInWord(direction, startingIndex, crossword);
    if (nextSquare) {
        return nextSquare;
    }

    let nextWordIndex = getNextWordIndex(direction, startingIndex, crossword);
    while (nextWordIndex > -1) {
        if (!crossword.squares[nextWordIndex].value) {
            return crossword.squares[nextWordIndex];
        }
        nextSquare = getNextOpenSquareInWord(direction, nextWordIndex, crossword);
        if (nextSquare) {
            return nextSquare;
        }
        nextWordIndex = getNextWordIndex(direction, nextWordIndex, crossword);
    }
    // All the following squares were black or had values. Return the original
    // square.
    return crossword.squares[startingIndex];
};

/**
 * @param direction
 * @param crossword 
 * @returns A list of squares in the active word (as indicated by the 'active' 
 * property) in the given direction. If there is no active word, returns an 
 * empty list.
 */
export function getActiveWordSquares(direction: InputDirection, crossword: Crossword): Square[] {
    if (direction == InputDirection.UNSPECIFIED) {
        throw new Error('Unspecified input direction');
    }

    const activeSquareIndex = crossword.squares.findIndex((s) => s.active);
    if (activeSquareIndex == -1) {
        // Not found
        return [];
    }
    let firstSquareIndex = getFirstSquareIndexOfCurrentWord(direction, activeSquareIndex, crossword);

    let currentIndex = firstSquareIndex;
    const activeWordSquares = [crossword.squares[currentIndex]];
    let searching = true;
    while (searching) {
        const nextSquare = direction == InputDirection.ACROSS ? getSquareRight(currentIndex, crossword) : getSquareBelow(currentIndex, crossword);
        if (!nextSquare || nextSquare.color == SquareColor.BLACK) {
            searching = false;
        } else {
            activeWordSquares.push(nextSquare);
            currentIndex += direction == InputDirection.ACROSS ? 1 : crossword.dimensions.width;
        }
    }
    return activeWordSquares;
}

/**
 * @param index 
 * @param crossword
 * @returns The next square left in the same row that is not black. If none
 * exist, returns null.
 */
export function getNextNonBlackSquareLeft(index: number, crossword: Crossword): Square|null {
    let nextLeftSquare = getSquareLeft(index, crossword);
    let currentIndex = index;
    while (nextLeftSquare && nextLeftSquare.color == SquareColor.BLACK) {
        currentIndex--;
        nextLeftSquare = getSquareLeft(currentIndex, crossword);
    }
    return nextLeftSquare;
}

/**
 * @param index 
 * @param crossword
 * @returns The next square right in the same row that is not black. If none
 * exist, returns null.
 */
export function getNextNonBlackSquareRight(index: number, crossword: Crossword): Square|null {
    let nextRightSquare = getSquareRight(index, crossword);
    let currentIndex = index;
    while (nextRightSquare && nextRightSquare.color == SquareColor.BLACK) {
        currentIndex++;
        nextRightSquare = getSquareRight(currentIndex, crossword);
    }
    return nextRightSquare;
}

/**
 * @param index 
 * @param crossword
 * @returns The next square above in the same column that is not black. If none
 * exist, returns null.
 */
export function getNextNonBlackSquareAbove(index: number, crossword: Crossword): Square|null {
    let nextAboveSquare = getSquareAbove(index, crossword);
    let currentIndex = index;
    while (nextAboveSquare && nextAboveSquare.color == SquareColor.BLACK) {
        currentIndex -= crossword.dimensions.width;
        nextAboveSquare = getSquareAbove(currentIndex, crossword);
    }
    return nextAboveSquare;
}

/**
 * @param index 
 * @param crossword
 * @returns The next square below in the same column that is not black. If none
 * exist, returns null.
 */
export function getNextNonBlackSquareBelow(index: number, crossword: Crossword): Square|null {
    let nextBelowSquare = getSquareBelow(index, crossword);
    let currentIndex = index;
    while (nextBelowSquare && nextBelowSquare.color == SquareColor.BLACK) {
        currentIndex += crossword.dimensions.width;
        nextBelowSquare = getSquareBelow(currentIndex, crossword);
    }
    return nextBelowSquare;
}

/**
 * @param direction 
 * @param startingIndex 
 * @param crossword 
 * @returns The next square within the same word (directionally) that doesn't
 * have a value. Returns null if there are no more such squares in the word,
 * including if the letter is the last letter in the word.
 */
function getNextOpenSquareInWord(direction: InputDirection, startingIndex: number, crossword: Crossword): Square|null {
    if (direction == InputDirection.UNSPECIFIED) {
        throw new Error('Unspecified input direction');
    }

    let i = startingIndex;
    let nextSquare = direction == InputDirection.ACROSS ? getSquareRight(i, crossword) : getSquareBelow(i, crossword);
     while (nextSquare && nextSquare.color != SquareColor.BLACK && nextSquare.value) {
        i += direction == InputDirection.ACROSS ? 1 : crossword.dimensions.width;
        nextSquare = direction == InputDirection.ACROSS ? getSquareRight(i, crossword): getSquareBelow(i, crossword);
    }
    if (nextSquare && !nextSquare.value && nextSquare.color != SquareColor.BLACK) {
        return nextSquare;
    }
    return null;
}


/**
 * @param direction 
 * @param startingIndex 
 * @param crossword 
 * @returns The index of the first square of the next word in the given 
 * direction (i.e., the word after the one the startingIndex square is in).
 * If the startingIndex is in the last word of the given direction, returns -1.
 */
function getNextWordIndex(direction: InputDirection, startingIndex: number, crossword: Crossword): number {
    if (direction == InputDirection.ACROSS) {
        // This is either the next non-black square after the next black square
        // in the array of squares, or the next non-black square on the next row
        let seenBlack = false;
        let nextRow = (startingIndex + 1) % crossword.dimensions.width == 0;
        for (let i = startingIndex + 1; i < crossword.squares.length; i++) {
            if (i % crossword.dimensions.width == 0) {
                nextRow = true;
            }
            if (crossword.squares[i].color == SquareColor.BLACK) {
                seenBlack = true;
            } else if (seenBlack || nextRow) {
                return i;
            }
        }
        return -1;
    } else if (direction == InputDirection.DOWN) {
        // Words are ordered by the row of their first square. Words in the
        // same row are then ordered left to right.

        // Step 1: Find the row of the first letter of the word.
        const firstLetterIndex = getFirstSquareIndexOfCurrentWord(direction, startingIndex, crossword);;

        // Step 2: The next word will start in the square that is the next
        // in the array that is also at the start of a word.
        let currentIndex = firstLetterIndex + 1;
        if (currentIndex == crossword.squares.length) {
            return -1;
        }
        let squareAbove = getSquareAbove(currentIndex, crossword);
        let searching = true;
        while (searching == true) {
            if (crossword.squares[currentIndex].color != SquareColor.BLACK && (!squareAbove || squareAbove.color == SquareColor.BLACK)) {
                searching = false;
            } else if (currentIndex + 1 == crossword.squares.length) {
                searching = false;
                currentIndex = -1;
            } else {
                currentIndex += 1;
                squareAbove = getSquareAbove(currentIndex, crossword);
            }
        }
        return currentIndex;
    } else {
        throw new Error('Unspecified input direction');
    }
}

/**
 * @param direction 
 * @param startingIndex 
 * @param crossword 
 * @returns The index of the first square of the previous word in the given 
 * direction (i.e., the word before the one the startingIndex square is in).
 * If the startingIndex is in the first word of the given direction, returns -1.
 */
function getPreviousWordIndex(direction: InputDirection, startingIndex: number, crossword: Crossword): number {
    const wordFirstLetterIndex = getFirstSquareIndexOfCurrentWord(direction, startingIndex, crossword);

    if (direction == InputDirection.ACROSS) {
        // The last index of the previous word will be the first non-black
        // square after the last black square in the squares array, or the 
        // first non-black square after moving up a row
        let seenBlack = false;
        let newRow = false;
        for (let i = wordFirstLetterIndex - 1; i >= 0; i--) {
            if (i + 1 % crossword.dimensions.width == 0) {
                newRow = true;
            }
            if (crossword.squares[i].color == SquareColor.BLACK) {
                seenBlack = true;
            } else if (seenBlack || newRow) {
                return getFirstSquareIndexOfCurrentWord(direction, i, crossword);
            }
        }
        return -1;
    } else if (direction == InputDirection.DOWN) {
        // The previous word will start with the first square encountered
        // traversing backwards in the squares array that is a first square
        // of any DOWN word.
        let i = wordFirstLetterIndex - 1;
        while (i >= 0) {
            const square = crossword.squares[i];
            const squareAbove = getSquareAbove(i, crossword);
            if (square.color != SquareColor.BLACK && (!squareAbove || squareAbove.color == SquareColor.BLACK)) {
                return i;
            }
            i--;
        }
        // No square found
        return -1;
    } else {
        throw new Error('Unspecified input direction');
    }
}

/**
 * Finds the index of the square that contains the first letter in the word
 * of the given direction that contains the square at the given starting index.
 * @param direction 
 * @param startingIndex 
 * @param crossword 
 */
function getFirstSquareIndexOfCurrentWord(direction: InputDirection, startingIndex: number, crossword: Crossword): number {
    let currentIndex = startingIndex;
    let prevSquare = direction == InputDirection.ACROSS ? getSquareLeft(currentIndex, crossword) : getSquareAbove(currentIndex, crossword);
    while (prevSquare && prevSquare.color != SquareColor.BLACK) {
        currentIndex -= direction == InputDirection.ACROSS ? 1 : crossword.dimensions.width;
        prevSquare = direction == InputDirection.ACROSS ? getSquareLeft(currentIndex, crossword) : getSquareAbove(currentIndex, crossword);
    }
    return currentIndex;
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

/**
 * @param index 
 * @param crossword 
 * @returns The square above the given index, or null if the square is
 * on the top edge of the crossword.
 */
function getSquareAbove(index: number, crossword: Crossword): Square|null {
    if (index < 0 || index >= crossword.squares.length) {
        throw new Error('Index out of bounds');
    }
    if (index < crossword.dimensions.width) {
        return null;
    }
    return crossword.squares[index - crossword.dimensions.width];
}

/**
 * @param index 
 * @param crossword 
 * @returns The square below the given index, or null if the square is
 * on the bottom edge of the crossword.
 */
function getSquareBelow(index: number, crossword: Crossword): Square|null {
    if (index < 0 || index >= crossword.squares.length) {
        throw new Error('Index out of bounds');
    }
    if (index >= (crossword.dimensions.width * (crossword.dimensions.height - 1))) {
        return null;
    }
    return crossword.squares[index + crossword.dimensions.width];
}