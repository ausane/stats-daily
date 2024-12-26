"use client";

import { useState, useEffect, useRef } from "react";
import { EditorContent } from "@tiptap/react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import { EditorBlockTools, EditorToolBar } from "./toolbar";
import { format } from "date-fns";
import { LinkPopover } from "./features";
import { useDebouncedSave, useEditorConfiguration } from "./hooks";

export default function EditorComponent({
  content,
  noteId,
}: {
  noteId: string | null;
  content: string;
}) {
  const [saving, setSaving] = useState(false);
  const [mounted, setMounted] = useState(false);

  const router = useRouter();
  const lastSavedContentRef = useRef(content);
  const debouncedSave = useDebouncedSave(noteId);

  const editor = useEditorConfiguration({
    content,
    lastSavedContentRef,
    onContentUpdate: debouncedSave,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = async () => {
    if (!editor) {
      alert("Please provide content.");
      return;
    }
    const content = editor.getHTML();
    if (!content || content.replace(/<[^>]*>/g, "").trim().length === 0) {
      alert("Please add some content before saving");
      return;
    }
    setSaving(true);
    try {
      await debouncedSave(content);
      const today = new Date();
      router.push(`/notes/${today.toISOString().split("T")[0]}`);
    } catch (error) {
      alert("Error saving note. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  if (!mounted || !editor) return null;

  return (
    <div className="mx-auto box-border h-screen max-w-4xl bg-background p-4">
      <header className="flex-between mb-4">
        <p className="text-2xl font-bold">
          {format(new Date(), "MMMM d, yyyy")}
        </p>
        <EditorBlockTools editor={editor} />
      </header>
      <div className="h-[calc(100%-4rem)]">
        <ScrollArea className="relative h-[calc(100%-4rem)] rounded-lg border bg-card">
          <EditorContent
            editor={editor}
            className="size-full p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
          <EditorToolBar editor={editor} />
          <LinkPopover editor={editor} />
        </ScrollArea>
        <div className="mt-4 flex items-center justify-between">
          <div className="space-x-2">
            <Button
              onClick={handleSave}
              disabled={
                saving ||
                editor
                  ?.getHTML()
                  .replace(/<[^>]*>/g, "")
                  .trim().length === 0
              }
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
          <div className="text-sm text-muted-foreground">
            {editor?.storage.characterCount.words() ?? 0} words
          </div>
        </div>
      </div>
    </div>
  );
}
