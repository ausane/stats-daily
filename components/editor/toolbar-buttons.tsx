"use client";

import { useState } from "react";
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
} from "lucide-react";
import { TooltipComponent } from "../ui/tooltip";
import { cn } from "@/lib/utils";
import { fontFamilies, fontSizes } from "./constants";

export function BoldButton({ editor }: { editor: Editor }) {
  return (
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
  );
}

export function ItalicButton({ editor }: { editor: Editor }) {
  return (
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
  );
}

export function UnderlineButton({ editor }: { editor: Editor }) {
  return (
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
  );
}

export function FontFamilyButton({ editor }: { editor: Editor }) {
  return (
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
  );
}

export function FontSizeButton({ editor }: { editor: Editor }) {
  return (
    <Select
      onValueChange={(value) => {
        editor.chain().focus().setMark("textStyle", { fontSize: value }).run();
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
  );
}

export function TextColorButton({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Text Color">
      <Input
        type="color"
        defaultValue="#000000"
        onChange={(e) => editor.chain().focus().setColor(e.target.value).run()}
        className="size-10 cursor-pointer"
      />
    </TooltipComponent>
  );
}

export function AlignLeftButton({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Align Left">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("left").run()}
        className={editor.isActive({ textAlign: "left" }) ? "bg-accent" : ""}
      >
        <AlignLeftIcon className="h-4 w-4" />
      </Button>
    </TooltipComponent>
  );
}

export function AlignCenterButton({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Align Center">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("center").run()}
        className={editor.isActive({ textAlign: "center" }) ? "bg-accent" : ""}
      >
        <AlignCenterIcon className="h-4 w-4" />
      </Button>
    </TooltipComponent>
  );
}

export function AlignRightButton({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Align Right">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor.chain().focus().setTextAlign("right").run()}
        className={editor.isActive({ textAlign: "right" }) ? "bg-accent" : ""}
      >
        <AlignRightIcon className="h-4 w-4" />
      </Button>
    </TooltipComponent>
  );
}

export function LinkButton({
  editor,
  linkUrl,
  setLinkUrl,
}: {
  editor: Editor;
  linkUrl: string;
  setLinkUrl: React.Dispatch<React.SetStateAction<string>>;
}) {
  const [linkError, setLinkError] = useState("");
  const [isLinkPopoverOpen, setIsLinkPopoverOpen] = useState(false);

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
  return (
    <Popover open={isLinkPopoverOpen} onOpenChange={handleLinkPopoverOpen}>
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
          {linkError && <div className="text-sm text-red-500">{linkError}</div>}
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
  );
}

export function HeadingLevel1Button({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Heading Level 1">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 1 }).run()
        }
        className={editor?.isActive("heading", { level: 1 }) ? "bg-accent" : ""}
      >
        <span>H1</span>
      </Button>
    </TooltipComponent>
  );
}

export function HeadingLevel2Button({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Heading Level 2">
      <Button
        variant="ghost"
        size="icon"
        onClick={() =>
          editor?.chain().focus().toggleHeading({ level: 2 }).run()
        }
        className={editor?.isActive("heading", { level: 2 }) ? "bg-accent" : ""}
      >
        <span>H2</span>
      </Button>
    </TooltipComponent>
  );
}

export function ListButton({ editor }: { editor: Editor }) {
  return (
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
  );
}

export function ListOrderedButton({ editor }: { editor: Editor }) {
  return (
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
  );
}

export function LineBreakButton({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Insert Line Break">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor?.chain().focus().setHardBreak().run()}
      >
        <span>BR</span>
      </Button>
    </TooltipComponent>
  );
}

export function HorizontalLineButton({ editor }: { editor: Editor }) {
  return (
    <TooltipComponent content="Insert Horizontal Line">
      <Button
        variant="ghost"
        size="icon"
        onClick={() => editor?.chain().focus().setHorizontalRule().run()}
      >
        <span>—</span>
      </Button>
    </TooltipComponent>
  );
}
