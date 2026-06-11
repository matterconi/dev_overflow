"use client";

import "@/app/styles.scss";

import CodeInlineLowlight from "@nartix/tiptap-inline-code-highlight";
import { Editor } from "@tiptap/core";
import { CodeBlockLowlight } from "@tiptap/extension-code-block-lowlight";
import { Color } from "@tiptap/extension-color";
import ListItem from "@tiptap/extension-list-item";
import { Paragraph } from "@tiptap/extension-paragraph";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { EditorContent, EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { common, createLowlight } from "lowlight";
import { useTheme } from "next-themes";
import React, { useEffect } from "react";

interface TiptapProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: (element) => element.getAttribute("style"),
        renderHTML: (attributes) => {
          if (!attributes.style) {
            return {};
          }

          return { style: attributes.style };
        },
      },
    };
  },
});

const MenuBar = () => {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={!editor.can().chain().focus().toggleBold().run()}
          className={editor.isActive("bold") ? "is-active" : ""}
        >
          Bold
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={!editor.can().chain().focus().toggleItalic().run()}
          className={editor.isActive("italic") ? "is-active" : ""}
        >
          Italic
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={!editor.can().chain().focus().toggleStrike().run()}
          className={editor.isActive("strike") ? "is-active" : ""}
        >
          Strike
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={!editor.can().chain().focus().toggleCode().run()}
          className={editor.isActive("code") ? "is-active" : ""}
        >
          Code
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetAllMarks().run()}
        >
          Clear marks
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().clearNodes().run()}
        >
          Clear nodes
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive("paragraph") ? "is-active" : ""}
        >
          Paragraph
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive("heading", { level: 1 }) ? "is-active" : ""}
        >
          H1
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive("heading", { level: 2 }) ? "is-active" : ""}
        >
          H2
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive("heading", { level: 3 }) ? "is-active" : ""}
        >
          H3
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive("heading", { level: 4 }) ? "is-active" : ""}
        >
          H4
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive("heading", { level: 5 }) ? "is-active" : ""}
        >
          H5
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive("heading", { level: 6 }) ? "is-active" : ""}
        >
          H6
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive("bulletList") ? "is-active" : ""}
        >
          Bullet list
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive("orderedList") ? "is-active" : ""}
        >
          Ordered list
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive("codeBlock") ? "is-active" : ""}
        >
          Code block
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive("blockquote") ? "is-active" : ""}
        >
          Blockquote
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
        >
          Horizontal rule
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHardBreak().run()}
        >
          Hard break
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().undo().run()}
          disabled={!editor.can().chain().focus().undo().run()}
        >
          Undo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().redo().run()}
          disabled={!editor.can().chain().focus().redo().run()}
        >
          Redo
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setColor("#958DF1").run()}
          className={
            editor.isActive("textStyle", { color: "#958DF1" }) ? "is-active" : ""
          }
        >
          Purple
        </button>
      </div>
    </div>
  );
};

const getExtensions = (placeholder: string) => [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle,
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false,
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false,
    },
    codeBlock: false,
    paragraph: false,
  }),
  Placeholder.configure({
    placeholder,
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
  }),
  CodeInlineLowlight.configure({
    lowlight: createLowlight(common),
  }),
  CustomParagraph,
];

const ContentEditor = ({ value, onChange }: TiptapProps) => {
  const editorContext = useCurrentEditor();
  const editor = editorContext?.editor;

  useEffect(() => {
    if (!editor) return;

    const nextValue = value?.trim() ?? "";
    const currentValue = editor.getHTML().trim();

    if (currentValue === nextValue) return;

    if (!nextValue) {
      editor.commands.clearContent();
      return;
    }

    editor.commands.setContent(nextValue, { emitUpdate: false });
  }, [editor, value]);

  useEffect(() => {
    if (!editor) return;

    const handleUpdate = () => {
      const nextContent = editor.isEmpty ? "" : editor.getHTML();

      if (nextContent !== value) {
        onChange(nextContent);
      }
    };

    editor.on("update", handleUpdate);

    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, onChange, value]);

  return <EditorContent editor={editor as Editor | null} />;
};

export default function EditorWithTheme({
  value,
  onChange,
  placeholder = "Write the details here...",
}: TiptapProps) {
  const { resolvedTheme, theme } = useTheme();
  const editorTheme = resolvedTheme ?? theme ?? "light";

  return (
    <div className={`theme-${editorTheme}`}>
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={getExtensions(placeholder)}
        content={value}
        immediatelyRender={false}
        editorContainerProps={{ className: "editor-container" }}
      >
        <ContentEditor value={value} onChange={onChange} />
      </EditorProvider>
    </div>
  );
}
