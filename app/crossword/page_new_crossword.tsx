'use client'

import { useState } from "react";
import { PageCrosswordEdit } from "./page_crossword_edit";
import { createNewCrossword, Crossword, Dimensions } from "../models/crossword";

interface DimensionsSelectorSettings {
    setDimensions: Function;
}

enum DimensionsOptions {
    UNSPECIFIED,
    WEEKDAY,
    SUNDAY,
    CUSTOM
}

function DimensionsSelector({setDimensions}: DimensionsSelectorSettings) {
    // Preserve selected value in case of error
    const [lastSelected, setLastSelected] = useState(DimensionsOptions.WEEKDAY);
    const [error, setError] = useState({
        message: '',
        widthError: false,
        heightError: false
    });

    const selectCustomDimensions = () => {
        const customRadio = document.getElementById("custom") as HTMLInputElement;
        customRadio.checked = true;
        setLastSelected(DimensionsOptions.CUSTOM);
    };

    const submitDimensions = (formData: FormData) => {
        // Clear previous error
        setError({
            message: '',
            widthError: false,
            heightError: false
        });
        const selected: DimensionsOptions = Number(formData.get("dimensions"));
        setLastSelected(selected);
        let dimensions: Dimensions;
        if (selected == DimensionsOptions.WEEKDAY) {
            dimensions = {
                height: 15,
                width: 15
            };
            setDimensions(dimensions);
        } else if (selected == DimensionsOptions.SUNDAY) {
            dimensions = {
                height: 21,
                width: 21
            }
            setDimensions(dimensions);
        } else if (selected == DimensionsOptions.UNSPECIFIED) {
            throw new Error('No dimensions specified');
        } else {
            // Custom
            dimensions = {
                width: Number(formData.get('custom-width')),
                height: Number(formData.get('custom-height'))
            };
            const widthError = dimensions.width < 1 || !Number.isSafeInteger(dimensions.width);
            const heightError = dimensions.height < 1 || !Number.isSafeInteger(dimensions.height);
            if (widthError || heightError) {
                setError({
                    message: 'Please enter valid values for width and height.',
                    widthError,
                    heightError
                });
            } else {
                setDimensions(dimensions);
            }
        }
        
    }

    return (
        <form action={submitDimensions} className="w-fit">
            <fieldset className="w-fit flex flex-col justify-center mt-8 pt-2 mb-8">
                <legend className="font-bold text-xl">Select dimensions:</legend>
                <div className="flex flex-col w-fit px-8 text-lg">
                    <label>
                        <input type="radio" id="weekday" name="dimensions" value={DimensionsOptions.WEEKDAY} data-testid="dimensions-weekday" defaultChecked={lastSelected == DimensionsOptions.WEEKDAY} />
                        <span className="radio-label">15x15 (NYT Mon-Sat)</span>
                    </label>
                    <label>
                        <input type="radio" id="sunday" name="dimensions" value={DimensionsOptions.SUNDAY} data-testid="dimensions-sunday" defaultChecked={lastSelected == DimensionsOptions.SUNDAY} />
                        <span className="radio-label">21x21 (NYT Sun)</span>
                    </label>

                    {error.message && <p id="error-message" data-testid="error-message">{error.message}</p>}
                    <label>
                        <input type="radio" id="custom" name="dimensions" value={DimensionsOptions.CUSTOM} data-testid="dimensions-custom" 
                        defaultChecked={lastSelected == DimensionsOptions.CUSTOM}/>
                        <span className="radio-label">Custom</span>
                        <div className="pl-8">
                            <span>w: <input type="text" name="custom-width" className={(error.widthError ? "error " : "") + "number-input"} data-testid="custom-width" onClick={selectCustomDimensions}></input></span>
                            <span className="mx-2">×</span>
                            <span>h: <input type="text" name="custom-height" className={(error.heightError ? "error " : "") + "number-input"} data-testid="custom-height" onClick={selectCustomDimensions}></input></span>
                        </div>
                    </label>
                </div>
            </fieldset>
            <button className="button ml-8" data-testid="select-button">Select</button>
        </form>
    );
}

export function PageNewCrossword() {
    function nullCrosswordInitializer(): Crossword|null {
        return null;
    }
    const [crossword, setCrossword] = useState(nullCrosswordInitializer);

    const setDimensions = (dimensions: Dimensions) => {
        setCrossword(createNewCrossword(dimensions));
    }

    let content;
    if (crossword) {
        content = <PageCrosswordEdit crossword={crossword} />
    } else {
        content = <DimensionsSelector setDimensions={setDimensions} />
    }
    return (
        <main className="size-full flex flex-wrap flex-col content-center">
            <h1 className="w-fit font-bold text-7xl mb-12">New Crossword</h1>
            {content}
        </main>
    );
}