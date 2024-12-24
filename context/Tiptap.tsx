'use client'

import '@/app/styles.scss'

import { CodeBlockLowlight } from '@tiptap/extension-code-block-lowlight';
import CodeInlineLowlight from '@nartix/tiptap-inline-code-highlight';
import { common, createLowlight } from 'lowlight';

import { Color } from '@tiptap/extension-color'
import ListItem from '@tiptap/extension-list-item'
import TextStyle from '@tiptap/extension-text-style'
import { Paragraph } from '@tiptap/extension-paragraph';
import Placeholder from '@tiptap/extension-placeholder';
import { EditorProvider, useCurrentEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import { useTheme } from 'next-themes';
import React, { useEffect, useState } from 'react'

const CustomParagraph = Paragraph.extend({
  addAttributes() {
    return {
      style: {
        default: null,
        parseHTML: element => element.getAttribute('style'),
        renderHTML: attributes => {
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
  const { editor } = useCurrentEditor()

  if (!editor) {
    return null
  }

  return (
    <div className="control-group">
      <div className="button-group">
        <button
          onClick={() => editor.chain().focus().toggleBold().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleBold()
              .run()
          }
          className={editor.isActive('bold') ? 'is-active' : ''}
        >
          Bold
        </button>
        <button
          onClick={() => editor.chain().focus().toggleItalic().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleItalic()
              .run()
          }
          className={editor.isActive('italic') ? 'is-active' : ''}
        >
          Italic
        </button>
        <button
          onClick={() => editor.chain().focus().toggleStrike().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleStrike()
              .run()
          }
          className={editor.isActive('strike') ? 'is-active' : ''}
        >
          Strike
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCode().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .toggleCode()
              .run()
          }
          className={editor.isActive('code') ? 'is-active' : ''}
        >
          Code
        </button>
        <button onClick={() => editor.chain().focus().unsetAllMarks().run()}>
          Clear marks
        </button>
        <button onClick={() => editor.chain().focus().clearNodes().run()}>
          Clear nodes
        </button>
        <button
          onClick={() => editor.chain().focus().setParagraph().run()}
          className={editor.isActive('paragraph') ? 'is-active' : ''}
        >
          Paragraph
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
          className={editor.isActive('heading', { level: 1 }) ? 'is-active' : ''}
        >
          H1
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
          className={editor.isActive('heading', { level: 2 }) ? 'is-active' : ''}
        >
          H2
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
          className={editor.isActive('heading', { level: 3 }) ? 'is-active' : ''}
        >
          H3
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 4 }).run()}
          className={editor.isActive('heading', { level: 4 }) ? 'is-active' : ''}
        >
          H4
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 5 }).run()}
          className={editor.isActive('heading', { level: 5 }) ? 'is-active' : ''}
        >
          H5
        </button>
        <button
          onClick={() => editor.chain().focus().toggleHeading({ level: 6 }).run()}
          className={editor.isActive('heading', { level: 6 }) ? 'is-active' : ''}
        >
          H6
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
        >
          Bullet list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
        >
          Ordered list
        </button>
        <button
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
          className={editor.isActive('codeBlock') ? 'is-active' : ''}
        >
          Code block
        </button>
        <button
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
        >
          Blockquote
        </button>
        <button onClick={() => editor.chain().focus().setHorizontalRule().run()}>
          Horizontal rule
        </button>
        <button onClick={() => editor.chain().focus().setHardBreak().run()}>
          Hard break
        </button>
        <button
          onClick={() => editor.chain().focus().undo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .undo()
              .run()
          }
        >
          Undo
        </button>
        <button
          onClick={() => editor.chain().focus().redo().run()}
          disabled={
            !editor.can()
              .chain()
              .focus()
              .redo()
              .run()
          }
        >
          Redo
        </button>
        <button
          onClick={() => editor.chain().focus().setColor('#958DF1').run()}
          className={editor.isActive('textStyle', { color: '#958DF1' }) ? 'is-active' : ''}
        >
          Purple
        </button>
      </div>
    </div>
  )
}

const extensions = [
  Color.configure({ types: [TextStyle.name, ListItem.name] }),
  TextStyle.configure({ types: [ListItem.name] }),
  StarterKit.configure({
    bulletList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    orderedList: {
      keepMarks: true,
      keepAttributes: false, // TODO : Making this as `false` becase marks are not preserved when I try to preserve attrs, awaiting a bit of help
    },
    codeBlock: false
  }),
  CodeBlockLowlight.configure({
    lowlight: createLowlight(common),
  }),
  CodeInlineLowlight.configure({
    lowlight: createLowlight(common),
  }),
  CustomParagraph,
]

const content = `
<p style="font-size: 0.8rem; color: grey">Write here the content on your question and the detailed explanation of your problem, using the style commands in the address bar above...</p>
`

const ContentEditor = ({ value, onChange }) => {
  const editorContext = useCurrentEditor();
  const editor = editorContext?.editor;
  const [isPlaceholderCleared, setIsPlaceholderCleared] = useState(false);

  useEffect(() => {
    if (!editor) return;

    const placeholderText =
      'Write here the content on your question and the detailed explanation of your problem, using the style commands in the address bar above...';
    const placeholderStyle = 'font-size: 0.8rem; color: grey';

    const handleTransaction = ({ transaction }) => {
      const placeholderStep = transaction.steps.find(step => {
        const slice = step.slice?.content?.content?.[0];
        const textNode = slice?.content?.content?.[0];
        return (
          slice?.attrs?.style === placeholderStyle &&
          textNode?.text.includes(placeholderText)
        );
      });

      if (placeholderStep) {
        setIsPlaceholderCleared(false); // Reset the cleared flag
        editor.commands.blur(); // Programmatically blur to trigger focus again
      }
    };

    const handleFocus = () => {
      if (isPlaceholderCleared) return;

      const jsonContent = editor.getJSON();
      if (
        jsonContent.content &&
        jsonContent.content.length === 1 &&
        jsonContent.content[0].type === 'paragraph' &&
        jsonContent.content[0].attrs?.style === placeholderStyle &&
        jsonContent.content[0].content?.[0]?.text === placeholderText
      ) {
        editor.commands.clearContent(); // Clear the placeholder
        setIsPlaceholderCleared(true); // Mark as cleared
      }
    };
    
    const handleUpdate = () => {
      const content = editor.getHTML();
      if (content !== value) {
        onChange(content);
      }
    };

    editor.on('focus', handleFocus);
    editor.on('transaction', handleTransaction);
    editor.on('update', handleUpdate);

    return () => {
      editor.off('focus', handleFocus);
      editor.off('transaction', handleTransaction);
      editor.off('update', handleUpdate);
    };
  }, [editor, isPlaceholderCleared]);

  return <EditorContent />;
};

export default function EditorWithTheme({ value, onChange }) {
  const { theme } = useTheme(); // Access the current theme

  return (
    <div className={`theme-${theme}`}>
      <EditorProvider
      slotBefore={<MenuBar />}
      extensions={extensions}
      content={content}
      editorContainerProps={{ className: 'editor-container' }}
    >
      <ContentEditor value={value} onChange={onChange}/>
    </EditorProvider>
    </div>
  );
}