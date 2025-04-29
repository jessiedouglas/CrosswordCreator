'use client'

import { Clue, Crossword, InputDirection } from '../models/crossword';

interface EditCluesSettings {
    crossword: Crossword;
}

interface EditableClueSettings {
    clue: Clue;
}

function EditableClue({clue}: EditableClueSettings) {
    return (
        <div>
            <span data-testid="clue-number">{clue.number}.</span>
            <input type="text" value={clue.text} data-testid="clue-input" readOnly={true} />
        </div>
    );
}

export function EditClues({crossword}: EditCluesSettings) {
    const getClueTSX = (clue: Clue) => {
        const key = `${clue.range.direction == InputDirection.ACROSS ? "across": "down"}-${clue.number}`;
        return (<EditableClue clue={clue} key={key}/>);
    }

    const acrossClues = crossword.clues.across.map(c => getClueTSX(c));
    const downClues = crossword.clues.down.map(c => getClueTSX(c));
    return (
        <section className="mt-8" data-testid="clues">
            <h2>Clues</h2>
            <div className="flex">
                <div>
                    <h3>Across</h3>
                    <div data-testid="across-clues">
                        {acrossClues}
                    </div>
                </div>
                <div>
                    <h3>Down</h3>
                    <div data-testid="down-clues">
                        {downClues}
                    </div>
                </div>
            </div>
        </section>
    );
}