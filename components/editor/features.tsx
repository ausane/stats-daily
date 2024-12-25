import { useEffect, useState } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { Editor } from "@tiptap/core";
import { EditIcon, TrashIcon } from "lucide-react";
import Link from "next/link";

export const LinkPopover = ({ editor }: { editor: Editor }) => {
  const [link, setLink] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const [show, setShow] = useState(false);

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

        if (element) {
          const rect = element.getBoundingClientRect();
          const editorRect = editor.view.dom.getBoundingClientRect();

          setPosition({
            top: rect.bottom - editorRect.top,
            left: rect.left - editorRect.left,
          });
        }
      } else {
        setShow(false);
      }
    };

    editor.on("selectionUpdate", updatePopover);
    return () => {
      editor.off("selectionUpdate", updatePopover);
    };
  }, [editor]);

  const updateLink = (newHref: string) => {
    const { from } = editor.state.selection;
    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: newHref })
      .setTextSelection(from)
      .run();
  };

  if (!show || !editor) return null;

  return (
    <div
      className="absolute z-50 rounded-lg border bg-card p-2 shadow-lg"
      style={{
        top: `${position.top + 25}px`,
        left: `${position.left}px`,
      }}
    >
      {isEditing ? (
        <div className="flex gap-2">
          <Input
            value={link}
            onChange={(e) => setLink(e.target.value)}
            placeholder="Enter URL"
            className="h-9 w-64"
          />
          <Button
            size="sm"
            onClick={() => {
              if (link) {
                updateLink(link);
                setIsEditing(false);
              }
            }}
          >
            Save
          </Button>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <Link
            href={link}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 text-blue-500 hover:underline"
          >
            {link}
          </Link>
          <Button
            size="icon"
            variant="ghost"
            onClick={() => setIsEditing(true)}
          >
            <EditIcon className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
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
