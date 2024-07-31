"use client";

import { useState } from "react";
import { updateNote } from "@/lib/utils/handle-update";
import { X, Check, Pencil } from "lucide-react";
import IconButton from "@/components/ui/icon-button";

export default function DailyNote({ id, note }: { id: string; note: string }) {
    const [inputNote, setInputNote] = useState(false);
    const [noteState, setNoteState] = useState(note);

    const handleNoteChange = async () => {
        setInputNote(false);
        await updateNote(id, noteState);
    };

    return (
        <div className="h-1/2 bbn rounded-md box-border p-4">
            <div className="flex-between h-1/6">
                <h2 className="font-bold">Note</h2>
                {inputNote ? (
                    <span className="flex gap-2">
                        <IconButton onClick={handleNoteChange}>
                            <Check />
                        </IconButton>
                        <IconButton onClick={() => setInputNote(false)}>
                            <X />
                        </IconButton>
                    </span>
                ) : (
                    <IconButton onClick={() => setInputNote(true)}>
                        <Pencil />
                    </IconButton>
                )}
            </div>
            {inputNote ? (
                <textarea
                    name="note"
                    value={noteState}
                    className="w-full h-5/6 bbn p-1 rounded-md bg-transparent resize-none"
                    onChange={(e) => setNoteState(e.target.value)}
                />
            ) : (
                <div className="w-full h-5/6 text-ellipsis overflow-auto overflow-x-hidden">
                    <p>
                        {noteState || (
                            <span className="italic opacity-50">empty</span>
                        )}
                    </p>
                </div>
            )}
        </div>
    );
}
