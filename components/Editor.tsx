"use client";

import { useCurrentEditor } from "@tiptap/react";
import React from "react";

const EditorJSONPreview = () => {
  const { editor } = useCurrentEditor();

  return <pre>{JSON.stringify(editor.getJSON(), null, 2)}</pre>;
};

export default EditorJSONPreview;
