"use client";

import { useEffect, useRef, useState } from "react";
import { updateNote } from "@/lib/utils/handle-update";
import { X, Check, Pencil } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import { ValidationAlertDialog } from "@/components/confirm-dialog";

export default function DailyNote({ id, note }: { id: string; note: string }) {
    const tRef = useRef<HTMLTextAreaElement>(null);

    const [inputNote, setInputNote] = useState(false);
    const [noteState, setNoteState] = useState(note);
    const [noteInput, setNoteInput] = useState(noteState);
    const [alertDialog, setAlertDialog] = useState(false);

    useEffect(() => {
        if (inputNote && tRef.current) {
            tRef.current.focus();
            // Move the cursor to the end of the text
            tRef.current.setSelectionRange(
                tRef.current.value.length,
                tRef.current.value.length
            );
            // Scroll to the end of the text
            tRef.current.scrollTop = tRef.current.scrollHeight;
        }
    }, [inputNote]);

    const handleNoteChange = async () => {
        if (noteState.trim().length > 400) {
            setAlertDialog(true);
            return;
        }

        setInputNote(false);
        setNoteState(noteInput);

        await updateNote(id, noteInput);
    };

    const handleInputNoteClose = () => {
        setInputNote(false);
        setNoteInput(noteState);
    };

    return (
        <div className="h-[calc(60%-1rem)] bbn rounded-md box-border px-4 py-2">
            <div className="flex-between h-10">
                <h2 className="font-bold">Note</h2>
                {inputNote ? (
                    <span className="flex gap-2">
                        <IconButton onClick={handleNoteChange}>
                            <Check size={15} />
                        </IconButton>
                        <IconButton onClick={handleInputNoteClose}>
                            <X size={15} />
                        </IconButton>
                    </span>
                ) : (
                    <IconButton onClick={() => setInputNote(true)}>
                        <Pencil size={15} />
                    </IconButton>
                )}
            </div>
            {inputNote ? (
                <textarea
                    ref={tRef}
                    name="note"
                    value={noteInput}
                    className="w-full h-[calc(100%-40px)] bbn p-1 rounded-md bg-transparent resize-none"
                    onChange={(e) => setNoteInput(e.target.value)}
                />
            ) : (
                <div className="w-full h-[calc(100%-40px)] text-ellipsis overflow-auto overflow-x-hidden">
                    <p>
                        {noteState || (
                            <span className="italic opacity-50">empty</span>
                        )}
                    </p>
                </div>
            )}

            <ValidationAlertDialog
                category="note"
                alertDialog={alertDialog}
                setAlertDialog={setAlertDialog}
            />
        </div>
    );
}
