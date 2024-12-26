"use client";

import { useEffect, useRef, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/core";
import { CheckIcon, PencilIcon, TrashIcon } from "lucide-react";
import { usePopper } from "react-popper";
import Link from "next/link";

export const LinkPopover = ({ editor }: { editor: Editor }) => {
  const [link, setLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [show, setShow] = useState(false);
  const [referenceElement, setReferenceElement] = useState<HTMLElement | null>(
    null,
  );
  const [popperElement, setPopperElement] = useState<HTMLDivElement | null>(
    null,
  );

  const linkInputRef = useRef<HTMLInputElement | null>(null);

  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
    modifiers: [
      { name: "flip", enabled: true },
      { name: "preventOverflow", enabled: true },
      { name: "offset", options: { offset: [0, 8] } },
    ],
  });

  useEffect(() => {
    const updatePopover = () => {
      const { from, to } = editor.state.selection;
      const nodeAt = editor.state.doc.nodeAt(from);
      const linkMark = nodeAt?.marks.find((mark) => mark.type.name === "link");

      if (from !== to) {
        setShow(false);
        return;
      }

      if (linkMark) {
        setLink(linkMark.attrs.href);
        setShow(true);
        const domResult = editor.view.domAtPos(from);
        const element = domResult.node.parentElement;
        setReferenceElement(element);
      } else {
        setShow(false);
        setReferenceElement(null);
      }
    };

    editor.on("selectionUpdate", updatePopover);
    return () => {
      editor.off("selectionUpdate", updatePopover);
    };
  }, [editor]);

  const updateLink = () => {
    if (!link) return;

    const { from } = editor.state.selection;

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: link })
      .setTextSelection(from)
      .run();

    setIsEditing(false);
  };

  if (!show || !editor) return null;

  return (
    <div
      ref={setPopperElement}
      style={styles.popper}
      {...attributes.popper}
      className="z-50 rounded-lg border bg-card p-2 shadow-lg"
    >
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            ref={linkInputRef}
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter URL"
            onKeyDown={(e) => e.key === "Enter" && updateLink()}
          />
          <Button size="icon" className="size-8" onClick={updateLink}>
            <CheckIcon className="h-4 w-4" />
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-1">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="mr-1 flex items-center border-r-2 pr-2 text-blue-500 hover:underline"
          >
            {link}
          </Link>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => {
              setIsEditing(true);
              setTimeout(() => linkInputRef.current?.focus(), 0);
            }}
          >
            <PencilIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="size-8"
            onClick={() => {
              editor.chain().focus().extendMarkRange("link").unsetLink().run();
              setShow(false);
            }}
          >
            <TrashIcon className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
};
