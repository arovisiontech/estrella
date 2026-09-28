"use client";

import { useEffect, useRef, useState } from "react";
import {
  Bold,
  Italic,
  Underline,
  Strikethrough,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Palette,
  RotateCcw,
  RotateCw,
  RemoveFormatting,
} from "lucide-react";

type RichTextEditorProps = {
  value: string;
  onChange: (htmlValue: string) => void;
  placeholder?: string;
};

const COLOR_OPTIONS = [
  "#000000",
  "#ffffff",
  "#dc2626", // Red
  "#ea580c", // Orange
  "#d97706", // Amber
  "#16a34a", // Green
  "#0284c7", // Blue
  "#4f46e5", // Indigo
  "#7c3aed", // Purple
  "#db2777", // Pink
  "#52525b", // Zinc 600
  "#a1a1aa", // Zinc 400
];

const FONT_SIZES = [
  { label: "Normal", value: "3" },
  { label: "Small", value: "2" },
  { label: "Large", value: "4" },
  { label: "Extra Large", value: "5" },
  { label: "Heading 1", value: "6" },
  { label: "Heading 2", value: "5" },
];

export default function RichTextEditor({ value, onChange, placeholder = "Enter full product description..." }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showColorPicker, setShowColorPicker] = useState(false);
  const [selectedColor, setSelectedColor] = useState("#000000");

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || "";
    }
  }, [value]);

  const execCommand = (command: string, value: string = "") => {
    if (!editorRef.current) return;
    editorRef.current.focus();
    document.execCommand(command, false, value);
    handleContentChange();
  };

  const handleContentChange = () => {
    if (editorRef.current) {
      const html = editorRef.current.innerHTML;
      onChange(html);
    }
  };

  const applyColor = (color: string) => {
    setSelectedColor(color);
    execCommand("foreColor", color);
    setShowColorPicker(false);
  };

  const applyFontSize = (size: string) => {
    execCommand("fontSize", size);
  };

  return (
    <div className="border border-slate-300 rounded-lg overflow-hidden bg-white text-slate-900 shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-1 p-2 bg-slate-50 border-b border-slate-200 select-none">
        {/* Font Size Selector */}
        <select
          onChange={(e) => applyFontSize(e.target.value)}
          defaultValue="3"
          className="bg-white text-slate-700 text-xs px-2 py-1.5 rounded border border-slate-300 focus:outline-none focus:border-[#00AEF0] cursor-pointer"
          title="Font Size / Heading"
        >
          {FONT_SIZES.map((fs) => (
            <option key={fs.value + fs.label} value={fs.value}>
              {fs.label}
            </option>
          ))}
        </select>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Basic Styling */}
        <button
          type="button"
          onClick={() => execCommand("bold")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Bold (Ctrl+B)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("italic")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Italic (Ctrl+I)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("underline")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Underline (Ctrl+U)"
        >
          <Underline className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("strikeThrough")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Strikethrough"
        >
          <Strikethrough className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Color Picker */}
        <div className="relative">
          <button
            type="button"
            onClick={() => setShowColorPicker(!showColorPicker)}
            className="flex items-center gap-1 p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
            title="Text Color"
          >
            <Palette className="w-4 h-4" />
            <span className="w-3 h-3 rounded-full border border-slate-400" style={{ backgroundColor: selectedColor }} />
          </button>

          {showColorPicker && (
            <div className="absolute top-full left-0 mt-1 p-2 bg-white border border-slate-300 rounded-lg shadow-xl z-50 grid grid-cols-4 gap-1.5 w-36">
              {COLOR_OPTIONS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => applyColor(c)}
                  className="w-6 h-6 rounded border border-slate-300 hover:scale-110 transition cursor-pointer"
                  style={{ backgroundColor: c }}
                  title={c}
                />
              ))}
            </div>
          )}
        </div>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Alignment */}
        <button
          type="button"
          onClick={() => execCommand("justifyLeft")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Align Left"
        >
          <AlignLeft className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("justifyCenter")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Align Center"
        >
          <AlignCenter className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("justifyRight")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Align Right"
        >
          <AlignRight className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("justifyFull")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Justify"
        >
          <AlignJustify className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Lists */}
        <button
          type="button"
          onClick={() => execCommand("insertUnorderedList")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Bulleted List"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("insertOrderedList")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Numbered List"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="h-4 w-px bg-slate-300 mx-1" />

        {/* Undo / Redo / Clear */}
        <button
          type="button"
          onClick={() => execCommand("undo")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Undo"
        >
          <RotateCcw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("redo")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Redo"
        >
          <RotateCw className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => execCommand("removeFormat")}
          className="p-1.5 hover:bg-slate-200 text-slate-700 hover:text-slate-900 rounded transition cursor-pointer"
          title="Remove Formatting"
        >
          <RemoveFormatting className="w-4 h-4" />
        </button>
      </div>

      {/* Editor Content Area */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleContentChange}
        onBlur={handleContentChange}
        className="rich-text-content p-4 min-h-[180px] max-h-[400px] overflow-y-auto outline-none text-sm text-slate-800 leading-relaxed focus:ring-1 focus:ring-[#00AEF0] max-w-none bg-white"
        data-placeholder={placeholder}
      />
    </div>
  );
}
