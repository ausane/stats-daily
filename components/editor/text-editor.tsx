"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import FontFamily from "@tiptap/extension-font-family";
import CharacterCount from "@tiptap/extension-character-count";
import Underline from "@tiptap/extension-underline";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "../ui/scroll-area";
import { useRouter } from "next/navigation";
import Heading from "@tiptap/extension-heading";
import { EditorBlockTools, EditorToolBar } from "./toolbar";
import { format } from "date-fns";
import { EnterBehavior, FontSize } from "./extensions";
import { LinkPopover } from "./features";

export default function EditorComponent({
  content,
  noteId,
}: {
  noteId: string | null;
  content: string;
}) {
  const [mounted, setMounted] = useState(false);
  const [saving, setSaving] = useState(false);

  const lastSavedContentRef = useRef(content);
  const router = useRouter();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      TextStyle,
      Color,
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      Heading.configure({
        levels: [1, 2],
      }),
      CharacterCount,
      Underline,
      FontSize,
      BulletList.configure({
        keepMarks: true,
        HTMLAttributes: {
          class: "list-disc ml-4",
        },
      }),
      OrderedList.configure({
        keepMarks: true,
        HTMLAttributes: {
          class: "list-decimal ml-4",
        },
      }),
      EnterBehavior,
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
    content: content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (newContent !== lastSavedContentRef.current) {
        debouncedSave(newContent);
      }
    },
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  const debouncedSave = useCallback(
    debounce(async (content) => {
      if (!content || content.replace(/<[^>]*>/g, "").trim().length === 0) {
        console.warn("Skipped saving due to empty content.");
        return;
      }
      try {
        const response = await fetch("/api/note", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ noteId, content }),
        });
        if (!response.ok) {
          console.error("Error saving content");
        }
        return response.json();
      } catch (error) {
        console.error("Error saving content:", error);
      }
    }, 2000),
    [noteId],
  );

  useEffect(() => {
    if (editor) {
      const content = editor.getHTML();
      debouncedSave(content);
    }
  }, [editor, debouncedSave]);

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
