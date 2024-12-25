import { Extension, RawCommands } from "@tiptap/core";

export const FontSize = Extension.create({
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

export const EnterBehavior = Extension.create({
  name: "enterBehavior",

  addKeyboardShortcuts() {
    return {
      Enter: ({ editor }) => {
        const { selection } = editor.state;
        const { $from } = selection;

        // Check if the current node is a paragraph and is empty
        if (
          $from.parent.type.name === "paragraph" &&
          $from.parent.textContent === ""
        ) {
          editor.commands.insertContent("<br>");
          return true; // Prevent the default behavior
        }

        return false; // Allow default behavior if conditions aren't met
      },
    };
  },
});
