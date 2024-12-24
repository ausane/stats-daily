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
import { Editor, Extension, RawCommands } from "@tiptap/core";
import debounce from "lodash/debounce";
import { Button } from "@/components/ui/button";
import Input from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  AlignLeftIcon,
  AlignCenterIcon,
  AlignRightIcon,
  ListIcon,
  ListOrderedIcon,
  LinkIcon,
  TypeIcon,
} from "lucide-react";
import { ScrollArea } from "./ui/scroll-area";
import { useRouter } from "next/navigation";
import Heading from "@tiptap/extension-heading";
import { TooltipComponent } from "./ui/tooltip";
import { handleKeyDownEnter } from "@/lib/utils";

const FontSize = Extension.create({
  name: "fontSize",
  addOptions() {
    return {
      types: ["textStyle"],
    };
  },
  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          fontSize: {
            default: null,
            parseHTML: (element) => element.style.fontSize,
            renderHTML: (attributes) => {
              if (!attributes.fontSize) return {};
              return {
                style: `font-size: ${attributes.fontSize}`,
              };
            },
          },
        },
      },
    ];
  },
  addCommands() {
    return {
      setFontSize:
        (fontSize: string) =>
        ({ chain }: { chain: any }) => {
          return chain().setMark("textStyle", { fontSize }).run();
        },
    } as Partial<RawCommands>;
  },
});

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

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="mx-auto max-w-4xl space-y-4">
        <EditorToolBar editor={editor as Editor} />
        <ScrollArea className="h-[300px] rounded-lg border bg-card">
          <EditorContent
            editor={editor}
            className="size-full p-4 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
          />
        </ScrollArea>
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {editor?.storage.characterCount.words() ?? 0} words
          </div>
          <div className="space-x-2">
            <Button variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
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
        </div>
      </div>
    </div>
  );
}

export function EditorToolBar({ editor }: { editor: Editor }) {
  const [linkError, setLinkError] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkText, setLinkText] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const linkInputRef = useRef<HTMLInputElement>(null);

  const setLink = () => {
    if (!linkUrl) {
      setLinkError("Please enter a URL");
      return;
    }
    const validateUrl = (url: string) => {
      if (!url) return false;
      try {
        const urlToCheck = url.match(/^https?:\/\//) ? url : `https://${url}`;
        new URL(urlToCheck);
        return urlToCheck;
      } catch (error) {
        return false;
      }
    };

    const validatedUrl = validateUrl(linkUrl);
    if (!validatedUrl) {
      setLinkError(
        "Please enter a valid URL (e.g., example.com or https://example.com)",
      );
      return;
    }

    const selectedText = editor?.state.doc.textBetween(
      editor.state.selection.from,
      editor.state.selection.to,
    );

    if (selectedText) {
      editor?.chain().focus().setLink({ href: validatedUrl }).run();
    } else if (linkText) {
      editor
        ?.chain()
        .focus()
        .insertContent([
          {
            type: "text",
            marks: [{ type: "link", attrs: { href: validatedUrl } }],
            text: linkText,
          },
        ])
        .run();
    } else {
      editor
        ?.chain()
        .focus()
        .insertContent([
          {
            type: "text",
            marks: [{ type: "link", attrs: { href: validatedUrl } }],
            text: validatedUrl,
          },
        ])
        .run();
    }

    handleLinkPopoverOpen(false);
  };

  const handleLinkPopoverOpen = (open: boolean) => {
    if (open) {
      setIsLinkPopoverOpen(true);
    } else {
      setLinkUrl("");
      setLinkText("");
      setLinkError("");
      setIsLinkPopoverOpen(false);
    }
  };

  const fontFamilies = [
    "Default",
    "Arial",
    "Times New Roman",
    "Courier New",
    "Sans-serif",
    "Georgia",
    "Verdana",
    "Lucida Console",
    "Monospace",
  ];

  const fontSizes = [
    { label: "Smaller", value: "12px" },
    { label: "Small", value: "14px" },
    { label: "Medium", value: "16px" },
    { label: "Large", value: "18px" },
    { label: "Larger", value: "20px" },
  ];

  const focusLinkInput = () => linkInputRef.current?.focus();

  return (
    <div className="sticky top-4 z-40 flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2 shadow-sm">
      <TooltipComponent content="Bold">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBold().run()}
          className={editor?.isActive("bold") ? "bg-accent" : ""}
        >
          <BoldIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Italic">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleItalic().run()}
          className={editor?.isActive("italic") ? "bg-accent" : ""}
        >
          <ItalicIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Underline">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleUnderline().run()}
          className={editor?.isActive("underline") ? "bg-accent" : ""}
        >
          <UnderlineIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Heading Level 1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 1 }).run()
          }
          className={
            editor?.isActive("heading", { level: 1 }) ? "bg-accent" : ""
          }
        >
          <span>H1</span>
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Heading Level 2">
        <Button
          variant="ghost"
          size="icon"
          onClick={() =>
            editor?.chain().focus().toggleHeading({ level: 2 }).run()
          }
          className={
            editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""
          }
        >
          <span>H2</span>
        </Button>
      </TooltipComponent>

      <Select
        onValueChange={(value) =>
          editor?.chain().focus().setFontFamily(value).run()
        }
        defaultValue="Default"
      >
        <TooltipComponent content="Font Family">
          <SelectTrigger className="w-[180px]">
            <TypeIcon className="h-4 w-4" />
            <SelectValue placeholder="Font Family" />
          </SelectTrigger>
        </TooltipComponent>
        <SelectContent>
          {fontFamilies.map((font) => (
            <SelectItem key={font} value={font}>
              {font}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select
        onValueChange={(value) =>
          editor
            ?.chain()
            .focus()
            .setMark("textStyle", { fontSize: value })
            .run()
        }
        defaultValue="16px"
      >
        <TooltipComponent content="Font Size">
          <SelectTrigger className="w-[100px]">
            <SelectValue placeholder="Size" />
          </SelectTrigger>
        </TooltipComponent>
        <SelectContent>
          {fontSizes.map(({ label, value }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <TooltipComponent content="Text Color">
        <Input
          type="color"
          defaultValue="#ffffff"
          onChange={(e) =>
            editor?.chain().focus().setColor(e.target.value).run()
          }
          className="size-10 cursor-pointer"
        />
      </TooltipComponent>

      <TooltipComponent content="Insert Line Break">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setHardBreak().run()}
        >
          <span>BR</span>
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Insert Horizontal Line">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setHorizontalRule().run()}
        >
          <span>—</span>
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Align Left">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("left").run()}
          className={editor?.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
        >
          <AlignLeftIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Align Center">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("center").run()}
          className={
            editor?.isActive({ textAlign: "center" }) ? "bg-accent" : ""
          }
        >
          <AlignCenterIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Align Right">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().setTextAlign("right").run()}
          className={
            editor?.isActive({ textAlign: "right" }) ? "bg-accent" : ""
          }
        >
          <AlignRightIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Bullet List">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleBulletList().run()}
          className={editor?.isActive("bulletList") ? "bg-accent" : ""}
        >
          <ListIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <TooltipComponent content="Ordered List">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => editor?.chain().focus().toggleOrderedList().run()}
          className={editor?.isActive("orderedList") ? "bg-accent" : ""}
        >
          <ListOrderedIcon className="h-4 w-4" />
        </Button>
      </TooltipComponent>

      <Popover open={isLinkPopoverOpen} onOpenChange={handleLinkPopoverOpen}>
        <TooltipComponent content="Insert Link">
          <PopoverTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setIsLinkPopoverOpen(true);
                setLinkError("");
                const selectedText = editor?.state.doc.textBetween(
                  editor.state.selection.from,
                  editor.state.selection.to,
                );
                if (selectedText) setLinkText(selectedText);
              }}
              className={isLinkPopoverOpen ? "bg-accent" : ""}
            >
              <LinkIcon className="h-4 w-4" />
            </Button>
          </PopoverTrigger>
        </TooltipComponent>
        <PopoverContent className="w-80">
          <div className="flex flex-col space-y-2">
            <Input
              type="text"
              placeholder="Enter link text (optional)"
              value={linkText}
              onChange={(e) => setLinkText(e.target.value)}
              onKeyDown={(e) => handleKeyDownEnter(e, focusLinkInput)}
              className="h-10"
            />
            <Input
              ref={linkInputRef}
              type="text"
              placeholder="Enter URL (e.g., example.com)"
              value={linkUrl}
              onChange={(e) => {
                setLinkUrl(e.target.value);
                setLinkError("");
              }}
              onKeyDown={(e) => handleKeyDownEnter(e, setLink)}
              className={`h-10 ${linkError ? "border-red-500" : ""}`}
            />
            {linkError && (
              <div className="text-sm text-red-500">{linkError}</div>
            )}
            <div className="flex justify-end space-x-2">
              <Button
                variant="outline"
                onClick={() => handleLinkPopoverOpen(false)}
              >
                Cancel
              </Button>
              <Button onClick={setLink}>Add Link</Button>
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
