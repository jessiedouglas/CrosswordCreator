'use client'

import {EditMode, EditableCrossword} from "./crossword/editable_crossword";

export default function Home() {
  return (
    <main className="flex size-full justify-center pt-[100px]">
        <EditableCrossword editMode={EditMode.TOGGLE_BLACK}></EditableCrossword>
    </main>
  );
}
