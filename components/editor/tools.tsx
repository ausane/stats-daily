"use client";

import { useState, useCallback, useEffect, useRef } from "react";
import { Editor } from "@tiptap/core";
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
  Plus,
} from "lucide-react";
import { TooltipComponent } from "../ui/tooltip";
import { cn, handleKeyDownEnter } from "@/lib/utils";
import { usePopper } from "react-popper";
import { ScrollArea, ScrollBar } from "../ui/scroll-area";

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

export function EditorToolBar({ editor }: { editor: Editor }) {
  const [linkError, setLinkError] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);
  const [showToolbar, setShowToolbar] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "top",
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  });

  const updateToolbarVisibility = useCallback(() => {
    if (!editor) return;

    const selection = editor.view.state.selection;
    const isVisible = editor.view.hasFocus() && !selection.empty;

    if (isVisible) {
      const { from, to } = selection;
      const start = editor.view.coordsAtPos(from);
      const end = editor.view.coordsAtPos(to);

      const rect = {
        left: start.left,
        top: start.top,
        right: end.right,
        bottom: end.bottom,
        width: end.right - start.left,
        height: end.bottom - start.top,
      };

      setReferenceElement(rect as unknown as HTMLElement);
      setShowToolbar(true);

      // Check if the selected text is a link
      const linkMark = editor.view.state.doc
        .nodeAt(from)
        ?.marks.find((mark) => mark.type.name === "link");
      if (linkMark) {
        setLinkUrl(linkMark.attrs.href);
      } else {
        setLinkUrl("");
      }
    } else {
      setShowToolbar(false);
    }
  }, [editor]);

  useEffect(() => {
    if (!editor) return;

    editor.on("selectionUpdate", updateToolbarVisibility);
    editor.on("focus", updateToolbarVisibility);

    return () => {
      editor.off("selectionUpdate", updateToolbarVisibility);
      editor.off("focus", updateToolbarVisibility);
    };
  }, [editor, updateToolbarVisibility]);

  const setLink = () => {
    if (!linkUrl) {
      setLinkError("Please enter a URL");
      return;
    }

    const validateUrl = (url: string) => {
      try {
        const urlToCheck = url.match(/^https?:\/\//) ? url : `https://${url}`;
        new URL(urlToCheck);
        return urlToCheck;
      } catch {
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

    editor?.chain().focus().setLink({ href: validatedUrl }).run();
    handleLinkPopoverOpen(false);
  };

  const handleLinkPopoverOpen = (open: boolean) => {
    setIsLinkPopoverOpen(open);
    if (!open) {
      setLinkUrl("");
      setLinkError("");
    }
  };

  if (!editor) return null;

  return (
    <>
      {showToolbar && (
        <div
          ref={setPopperElement}
          style={styles.popper}
          {...attributes.popper}
          className="z-50 flex flex-wrap items-center gap-2 rounded-lg border bg-card p-2 shadow-sm"
        >
          <ScrollArea className="h-10 w-80 sm:w-96 lg:w-auto">
            <div className="flex-start gap-1">
              <TooltipComponent content="Bold">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleBold().run()}
                  className={editor.isActive("bold") ? "bg-accent" : ""}
                >
                  <BoldIcon className="h-4 w-4" />
                </Button>
              </TooltipComponent>

              <TooltipComponent content="Italic">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleItalic().run()}
                  className={editor.isActive("italic") ? "bg-accent" : ""}
                >
                  <ItalicIcon className="h-4 w-4" />
                </Button>
              </TooltipComponent>

              <TooltipComponent content="Underline">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => editor.chain().focus().toggleUnderline().run()}
                  className={editor.isActive("underline") ? "bg-accent" : ""}
                >
                  <UnderlineIcon className="h-4 w-4" />
                </Button>
              </TooltipComponent>

              <Select
                onValueChange={(value) => {
                  editor.chain().focus().setFontFamily(value).run();
                  editor.view.focus();
                }}
                defaultValue="Default"
              >
                <TooltipComponent content="Font Family">
                  <SelectTrigger
                    className="w-[180px]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <TypeIcon className="h-4 w-4" />
                    <SelectValue placeholder="Font Family" />
                  </SelectTrigger>
                </TooltipComponent>
                <SelectContent>
                  {fontFamilies.map((font) => (
                    <SelectItem
                      key={font}
                      value={font}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {font}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                onValueChange={(value) => {
                  editor
                    .chain()
                    .focus()
                    .setMark("textStyle", { fontSize: value })
                    .run();
                  editor.view.focus();
                }}
                defaultValue="16px"
              >
                <TooltipComponent content="Font Size">
                  <SelectTrigger
                    className="w-[100px]"
                    onMouseDown={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                    }}
                  >
                    <SelectValue placeholder="Size" />
                  </SelectTrigger>
                </TooltipComponent>
                <SelectContent>
                  {fontSizes.map(({ label, value }) => (
                    <SelectItem
                      key={value}
                      value={value}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <TooltipComponent content="Text Color">
                <Input
                  type="color"
                  defaultValue="#000000"
                  onChange={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  className="size-10 cursor-pointer"
                />
              </TooltipComponent>

              <TooltipComponent content="Align Left">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={
                    editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""
                  }
                >
                  <AlignLeftIcon className="h-4 w-4" />
                </Button>
              </TooltipComponent>

              <TooltipComponent content="Align Center">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={
                    editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""
                  }
                >
                  <AlignCenterIcon className="h-4 w-4" />
                </Button>
              </TooltipComponent>

              <TooltipComponent content="Align Right">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={
                    editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""
                  }
                >
                  <AlignRightIcon className="h-4 w-4" />
                </Button>
              </TooltipComponent>

              <Popover
                open={isLinkPopoverOpen}
                onOpenChange={handleLinkPopoverOpen}
              >
                <TooltipComponent content="Insert Link">
                  <PopoverTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsLinkPopoverOpen(true)}
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
                      placeholder="Enter URL (e.g., example.com)"
                      value={linkUrl}
                      onChange={(e) => {
                        setLinkUrl(e.target.value);
                        setLinkError("");
                      }}
                      onKeyDown={(e) => e.key === "Enter" && setLink()}
                      className={cn(linkError ? "border-red-500" : "", "h-10")}
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
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      )}
    </>
  );
}

export function EditorBlockTools({ editor }: { editor: Editor }) {
  return (
    <Popover>
      <PopoverTrigger className="flex-center size-10 rounded-md border hover:bg-accent">
        <Plus className="size-4" />
      </PopoverTrigger>
      <PopoverContent side="bottom" className="w-auto p-2">
        <ScrollArea className="h-72 w-10">
          <div className="flex flex-col gap-1">
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

            <TooltipComponent content="Heading Level 3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() =>
                  editor?.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={
                  editor?.isActive("heading", { level: 3 }) ? "bg-accent" : ""
                }
              >
                <span>H3</span>
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
                onClick={() =>
                  editor?.chain().focus().toggleOrderedList().run()
                }
                className={editor?.isActive("orderedList") ? "bg-accent" : ""}
              >
                <ListOrderedIcon className="h-4 w-4" />
              </Button>
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
                onClick={() =>
                  editor?.chain().focus().setHorizontalRule().run()
                }
              >
                <span>—</span>
              </Button>
            </TooltipComponent>
          </div>
        </ScrollArea>
      </PopoverContent>
    </Popover>
  );
}
