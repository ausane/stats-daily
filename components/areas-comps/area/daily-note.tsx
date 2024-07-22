"use client";

import Image from "next/image";
import { useState } from "react";
import { updateNote } from "@/lib/utils/handle-update";

export default function DailyNote({ id, note }: { id: string; note: string }) {
    const [noteState, setNoteState] = useState({ inputNote: false, note });

    const handleNoteChange = async () => {
        setNoteState((prev) => ({ ...prev, inputNote: false }));
        await updateNote(id, noteState.note);
    };

    return (
        <div className="w-4/12 h-full bbn rounded-md box-border p-4 max-md:hidden">
            <div className="flex-between h-1/6">
                <h2>Note:</h2>
                {noteState.inputNote ? (
                    <>
                        <button
                            onClick={handleNoteChange}
                            className="bbn p-1 rounded-md"
                        >
                            Update
                        </button>
                        <button
                            className="w-8 h-8 flex-center rounded-full bbn"
                            onClick={() =>
                                setNoteState({
                                    ...noteState,
                                    inputNote: false,
                                })
                            }
                        >
                            <Image
                                src="/cross1.svg"
                                alt="close"
                                height={12}
                                width={12}
                            />
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() =>
                            setNoteState({ ...noteState, inputNote: true })
                        }
                    >
                        {noteState.note ? "Edit" : "Create"}
                    </button>
                )}
            </div>
            {noteState.inputNote ? (
                <textarea
                    // type="text"
                    name="note"
                    value={noteState.note}
                    className="w-full h-5/6 bbn p-1 rounded-md bg-transparent resize-none"
                    onChange={(event) =>
                        setNoteState({
                            ...noteState,
                            note: event.target.value,
                        })
                    }
                />
            ) : (
                <div className="w-full h-5/6 text-ellipsis overflow-auto overflow-x-hidden">
                    {noteState.note}
                </div>
            )}
        </div>
    );
}
