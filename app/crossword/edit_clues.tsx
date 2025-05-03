'use client'

import { getClueWordIndices } from '../helpers/square_navigators';
import { Clue, Crossword, duplicateCrossword, InputDirection } from '../models/crossword';

interface EditCluesSettings {
    crossword: Crossword;
    setCrossword: (c: Crossword|null) => void;
}

interface EditableClueSettings {
    index: number;
    clue: Clue;
    updateClue: (i: number, c: Clue) => void;
    highlightActiveWord: (c: Clue) => void;
}

function EditableClue({index, clue, updateClue, highlightActiveWord}: EditableClueSettings) {
    const onInsertText = (e: React.FormEvent<HTMLTextAreaElement>) => {
        clue.text = e.currentTarget.value;
        updateClue(index, clue);
    };

    const onFocus = () => {
        highlightActiveWord(clue);
    }

    return (
        <div className="flex mb-2">
            <p className="font-bold w-[24px] mr-2" data-testid="clue-number">{clue.number}.</p>
            <textarea className="clue-input px-2 py-1 resize-none" value={clue.text} data-testid="clue-input" onChange={onInsertText} onFocus={onFocus} cols={30} maxLength={200}/>
        </div>
    );
}

export function EditClues({crossword, setCrossword}: EditCluesSettings) {
    const updateClue = (index: number, clue: Clue) => {
        const clueList = clue.range.direction == InputDirection.ACROSS ? crossword.clues.across : crossword.clues.down;
        clueList[index] = clue;
        setCrossword(duplicateCrossword(crossword));
    }

    const highlightActiveWord = (clue: Clue) => { 
        for (let square of crossword.squares) {
            square.inActiveWord = false;
        }
        const clueWordIndices = getClueWordIndices(clue, crossword);
        for (let i of clueWordIndices) {
            crossword.squares[i].inActiveWord = true;
        }
        setCrossword(duplicateCrossword(crossword));
    }

    const getClueTSX = (index: number, clue: Clue) => {
        const key = `${clue.range.direction == InputDirection.ACROSS ? "across": "down"}-${clue.number}`;
        return (<EditableClue index={index} clue={clue} updateClue={updateClue} highlightActiveWord={highlightActiveWord} key={key}/>);
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
            <div className="flex flex-wrap h-[60dvh] overflow-y-auto">
                <div className='mr-2'>
                    <h3>Across</h3>
                    <div className="" data-testid="across-clues">
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