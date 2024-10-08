"use client";

import { useEffect, useRef, useState } from "react";
import { updateNote } from "@/lib/services/handle-update";
import { X, Check, Pencil } from "lucide-react";
import IconButton from "@/components/ui/icon-button";
import { ValidationAlertDialog } from "@/components/dialogs";
import { DailyNoteProps } from "@/lib/types";

export default function DailyNote({ areaId, note }: DailyNoteProps) {
  const tRef = useRef<HTMLTextAreaElement>(null);

  const [inputNote, setInputNote] = useState(false);
  const [noteState, setNoteState] = useState(note);
  const [noteInput, setNoteInput] = useState(noteState);
  const [alertDialog, setAlertDialog] = useState(false);

  useEffect(() => {
    const textarea = tRef.current;
    if (inputNote && textarea) {
      textarea.focus();
      // Move the cursor to the end of the text
      textarea.setSelectionRange(textarea.value.length, textarea.value.length);
      // Scroll to the end of the text
      textarea.scrollTop = textarea.scrollHeight;
    }

    const adjustHeight = () => {
      if (window.innerWidth <= 640 && textarea) {
        textarea.style.height = "auto"; // Reset the height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set it to the scroll height
      }
    };

    adjustHeight(); // Call it once on initial render
    window.addEventListener("resize", adjustHeight); // Adjust on window resize
    return () => window.removeEventListener("resize", adjustHeight); // Clean up listener
  }, [inputNote]);

  const handleNoteChange = async () => {
    if (noteInput.trim().length > 400) {
      setAlertDialog(true);
      return;
    }

    setInputNote(false);
    setNoteState(noteInput);

    await updateNote(areaId, noteInput);
  };

  const handleInputNoteClose = () => {
    setInputNote(false);
    setNoteInput(noteState);
  };

  return (
    <>
      <div className="flex-between sm:h-10">
        <h2 className="font-bold">Note</h2>
        {inputNote ? (
          <span className="flex gap-2">
            <IconButton
              onClick={handleNoteChange}
              aria-label="Save Edited Note"
            >
              <Check size={15} />
            </IconButton>
            <IconButton
              onClick={handleInputNoteClose}
              aria-label="Close Editing Note"
            >
              <X size={15} />
            </IconButton>
          </span>
        ) : (
          <IconButton
            onClick={() => setInputNote(true)}
            aria-label="Edit note of the area"
          >
            <Pencil size={15} />
          </IconButton>
        )}
      </div>
      {inputNote ? (
        <textarea
          ref={tRef}
          name="note"
          value={noteInput}
          className="bbn w-full rounded-md bg-transparent p-1 sm:h-[calc(100%-40px)] sm:resize-none"
          onChange={(e) => setNoteInput(e.target.value)}
          role="textbox"
          aria-label="Edit Note Textarea"
        />
      ) : (
        <div className="h-[calc(100%-40px)] w-full overflow-auto overflow-x-hidden text-ellipsis">
          <p>{noteState || <span className="italic opacity-50">empty</span>}</p>
        </div>
      )}

      <ValidationAlertDialog
        category="note"
        alertDialog={alertDialog}
        setAlertDialog={setAlertDialog}
      />
    </>
  );
}
