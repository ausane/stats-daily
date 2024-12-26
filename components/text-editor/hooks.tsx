"use client";

import debounce from "lodash/debounce";
import { useCallback, useEffect } from "react";
import { useEditor, Editor } from "@tiptap/react";
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
import Heading from "@tiptap/extension-heading";
import { EnterBehavior, FontSize } from "./extensions";
import { MutableRefObject } from "react";

export function useDebouncedSave(noteId: string | null, delay = 2000) {
  const debouncedSaveCallback = useCallback(() => {
    const saveContent = async (content: string) => {
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
    };

    return debounce((content: string) => saveContent(content), delay);
  }, [noteId, delay]);

  useEffect(() => {
    const debouncedFn = debouncedSaveCallback();
    return () => {
      debouncedFn.cancel();
    };
  }, [debouncedSaveCallback]);

  return debouncedSaveCallback();
}

export type EditorConfigurationProps = {
  content: string;
  lastSavedContentRef: MutableRefObject<string>;
  onContentUpdate: (content: string) => void;
};

export function useEditorConfiguration({
  content,
  lastSavedContentRef,
  onContentUpdate,
}: EditorConfigurationProps): Editor | null {
  return useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
        orderedList: false,
      }),
      Color,
      FontSize,
      TextStyle,
      Underline,
      EnterBehavior,
      CharacterCount,
      Heading.configure({
        levels: [1, 2],
      }),
      FontFamily.configure({
        types: ["textStyle"],
      }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
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
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-blue-500 underline",
        },
      }),
    ],
    editorProps: {
      attributes: {
        class: "prose max-w-none focus:outline-none",
      },
    },
    content,
    immediatelyRender: false,
    onUpdate: ({ editor }) => {
      const newContent = editor.getHTML();
      if (newContent !== lastSavedContentRef.current) {
        onContentUpdate(newContent);
      }
    },
  });
}
