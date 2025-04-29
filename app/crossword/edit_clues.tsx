'use client'

import { Clue, Crossword, duplicateCrossword, InputDirection } from '../models/crossword';

interface EditCluesSettings {
    crossword: Crossword;
    setCrossword: (c: Crossword|null) => void;
}

interface EditableClueSettings {
    index: number;
    clue: Clue;
    updateClue: (i: number, c: Clue) => void;
}

function EditableClue({index, clue, updateClue}: EditableClueSettings) {
    const onInsertText = (e: React.FormEvent<HTMLInputElement>) => {
        clue.text = e.currentTarget.value;
        updateClue(index, clue);
    };

    return (
        <div>
            <span data-testid="clue-number">{clue.number}.</span>
            <input type="text" value={clue.text} data-testid="clue-input" onChange={onInsertText} />
        </div>
    );
}

export function EditClues({crossword, setCrossword}: EditCluesSettings) {
    const updateClue = (index: number, clue: Clue) => {
        const clueList = clue.range.direction == InputDirection.ACROSS ? crossword.clues.across : crossword.clues.down;
        clueList[index] = clue;
        setCrossword(duplicateCrossword(crossword));
    }

    const getClueTSX = (index: number, clue: Clue) => {
        const key = `${clue.range.direction == InputDirection.ACROSS ? "across": "down"}-${clue.number}`;
        return (<EditableClue index={index} clue={clue} updateClue={updateClue} key={key}/>);
    }

    const acrossClues = [];
    for (let i=0; i < crossword.clues.across.length; i++) {
        acrossClues.push(getClueTSX(i, crossword.clues.across[i]));
    }
    const downClues = [];
    for (let i=0; i < crossword.clues.down.length; i++) {
        downClues.push(getClueTSX(i, crossword.clues.down[i]));
    }
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