import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import Heading from "@tiptap/extension-heading";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Blockquote from "@tiptap/extension-blockquote";
import CodeBlock from "@tiptap/extension-code-block";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import Highlight from "@tiptap/extension-highlight";
import { Editor, Extension, Mark, Node } from "@tiptap/core";

// ─── Types ────────────────────────────────────────────────────────────────────

export type ExtensionGroup = "Text Formatting" | "Structure" | "Enrichment";
export type ExtensionType = "mark" | "node" | "extension";

export interface ExtensionConfig {
  /** The Tiptap extension instance to pass to useEditor */
  extension: Extension | Mark | Node;
  /** Human-readable label shown in the toolbox */
  label: string;
  /** SVG path data for the icon (24x24 viewBox) */
  iconPath: string;
  /** Keyboard shortcut hint shown in the toolbox */
  shortcut?: string;
  /** Which toolbar group this belongs to */
  group: ExtensionGroup;
  /** Whether it's a mark, node, or generic extension */
  type: ExtensionType;
  /** The Tiptap active-check name (for editor.isActive()) */
  activeName?: string;
  /** Attributes passed to isActive() e.g. { level: 1 } for H1 */
  activeAttrs?: Record<string, unknown>;
  /** Execute this extension's primary command */
  command: (editor: Editor) => void;
  /** Return true if this extension is currently active in editor */
  isActive: (editor: Editor) => boolean;
  /** Whether this extension is enabled by default */
  defaultEnabled: boolean;
}

export type ExtensionKey =
  | "bold"
  | "italic"
  | "underline"
  | "strike"
  | "code"
  | "highlight"
  | "link"
  | "heading1"
  | "heading2"
  | "heading3"
  | "bulletList"
  | "orderedList"
  | "blockquote"
  | "codeBlock"
  | "horizontalRule";

// ─── Icon paths (24×24 viewBox SVG path data) ─────────────────────────────────

const icons: Record<ExtensionKey, string> = {
  bold: "M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z",
  italic: "M19 4h-9M14 20H5M15 4 9 20",
  underline: "M6 3v7a6 6 0 0 0 6 6 6 6 0 0 0 6-6V3M4 21h16",
  strike: "M16 4H9a3 3 0 0 0-2.83 4M14 12a4 4 0 0 1 0 8H6M4 12h16",
  code: "M16 18 22 12 16 6M8 6 2 12 8 18",
  highlight:
    "M9 3H5a2 2 0 0 0-2 2v4m6-6h10a2 2 0 0 1 2 2v4M9 3v18m0 0h10a2 2 0 0 0 2-2V9M9 21H5a2 2 0 0 1-2-2V9m0 0h18",
  link: "M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71",
  heading1: "M4 12h8M4 18V6M12 18V6M21 18h-4a2 2 0 0 1 0-4h2a2 2 0 0 0 0-4h-4",
  heading2: "M4 12h8M4 18V6M12 18V6M21 6h-4l-1 6",
  heading3: "M4 12h8M4 18V6M12 18V6M16 6h4M16 12h4M16 18h4",
  bulletList: "M9 6h11M9 12h11M9 18h11M5 6v.01M5 12v.01M5 18v.01",
  orderedList:
    "M10 6h11M10 12h11M10 18h11M4 6h1v4M4 10h2M6 18H4c0-1 2-2 2-3s-1-1.5-2-1",
  blockquote:
    "M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1zm12 0c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z",
  codeBlock:
    "M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2zM14 2v6h6M10 13l-2 2 2 2M14 17l2-2-2-2",
  horizontalRule: "M5 12h14",
};

// ─── Registry ─────────────────────────────────────────────────────────────────

export const EXTENSION_REGISTRY: Record<ExtensionKey, ExtensionConfig> = {
  // ── Text Formatting (Marks) ──────────────────────────────────────────────
  bold: {
    extension: Bold,
    label: "Bold",
    iconPath: icons.bold,
    shortcut: "⌘B",
    group: "Text Formatting",
    type: "mark",
    activeName: "bold",
    command: (editor) => editor.chain().focus().toggleBold().run(),
    isActive: (editor) => editor.isActive("bold"),
    defaultEnabled: true,
  },
  italic: {
    extension: Italic,
    label: "Italic",
    iconPath: icons.italic,
    shortcut: "⌘I",
    group: "Text Formatting",
    type: "mark",
    activeName: "italic",
    command: (editor) => editor.chain().focus().toggleItalic().run(),
    isActive: (editor) => editor.isActive("italic"),
    defaultEnabled: true,
  },
  underline: {
    extension: Underline,
    label: "Underline",
    iconPath: icons.underline,
    shortcut: "⌘U",
    group: "Text Formatting",
    type: "mark",
    activeName: "underline",
    command: (editor) => editor.chain().focus().toggleUnderline().run(),
    isActive: (editor) => editor.isActive("underline"),
    defaultEnabled: true,
  },
  strike: {
    extension: Strike,
    label: "Strikethrough",
    iconPath: icons.strike,
    shortcut: "⌘⇧X",
    group: "Text Formatting",
    type: "mark",
    activeName: "strike",
    command: (editor) => editor.chain().focus().toggleStrike().run(),
    isActive: (editor) => editor.isActive("strike"),
    defaultEnabled: false,
  },
  code: {
    extension: Code,
    label: "Inline Code",
    iconPath: icons.code,
    shortcut: "⌘E",
    group: "Text Formatting",
    type: "mark",
    activeName: "code",
    command: (editor) => editor.chain().focus().toggleCode().run(),
    isActive: (editor) => editor.isActive("code"),
    defaultEnabled: false,
  },
  highlight: {
    extension: Highlight,
    label: "Highlight",
    iconPath: icons.highlight,
    group: "Text Formatting",
    type: "mark",
    activeName: "highlight",
    command: (editor) => editor.chain().focus().toggleHighlight().run(),
    isActive: (editor) => editor.isActive("highlight"),
    defaultEnabled: false,
  },

  // ── Structure (Nodes) ────────────────────────────────────────────────────
  heading1: {
    extension: Heading.configure({ levels: [1] }),
    label: "Heading 1",
    iconPath: icons.heading1,
    shortcut: "⌘⌥1",
    group: "Structure",
    type: "node",
    activeName: "heading",
    activeAttrs: { level: 1 },
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 1 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 1 }),
    defaultEnabled: true,
  },
  heading2: {
    extension: Heading.configure({ levels: [2] }),
    label: "Heading 2",
    iconPath: icons.heading2,
    shortcut: "⌘⌥2",
    group: "Structure",
    type: "node",
    activeName: "heading",
    activeAttrs: { level: 2 },
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 2 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 2 }),
    defaultEnabled: true,
  },
  heading3: {
    extension: Heading.configure({ levels: [3] }),
    label: "Heading 3",
    iconPath: icons.heading3,
    shortcut: "⌘⌥3",
    group: "Structure",
    type: "node",
    activeName: "heading",
    activeAttrs: { level: 3 },
    command: (editor) =>
      editor.chain().focus().toggleHeading({ level: 3 }).run(),
    isActive: (editor) => editor.isActive("heading", { level: 3 }),
    defaultEnabled: false,
  },
  bulletList: {
    extension: BulletList,
    label: "Bullet List",
    iconPath: icons.bulletList,
    shortcut: "⌘⇧8",
    group: "Structure",
    type: "node",
    activeName: "bulletList",
    command: (editor) => editor.chain().focus().toggleBulletList().run(),
    isActive: (editor) => editor.isActive("bulletList"),
    defaultEnabled: true,
  },
  orderedList: {
    extension: OrderedList,
    label: "Numbered List",
    iconPath: icons.orderedList,
    shortcut: "⌘⇧7",
    group: "Structure",
    type: "node",
    activeName: "orderedList",
    command: (editor) => editor.chain().focus().toggleOrderedList().run(),
    isActive: (editor) => editor.isActive("orderedList"),
    defaultEnabled: true,
  },
  blockquote: {
    extension: Blockquote,
    label: "Blockquote",
    iconPath: icons.blockquote,
    shortcut: "⌘⇧B",
    group: "Structure",
    type: "node",
    activeName: "blockquote",
    command: (editor) => editor.chain().focus().toggleBlockquote().run(),
    isActive: (editor) => editor.isActive("blockquote"),
    defaultEnabled: false,
  },

  // ── Enrichment ───────────────────────────────────────────────────────────
  link: {
    extension: Link.configure({ openOnClick: false }),
    label: "Link",
    iconPath: icons.link,
    shortcut: "⌘K",
    group: "Enrichment",
    type: "mark",
    activeName: "link",
    command: (editor) => {
      const url = window.prompt("Enter URL");
      if (url) editor.chain().focus().setLink({ href: url }).run();
    },
    isActive: (editor) => editor.isActive("link"),
    defaultEnabled: true,
  },
  codeBlock: {
    extension: CodeBlock,
    label: "Code Block",
    iconPath: icons.codeBlock,
    shortcut: "⌘⌥C",
    group: "Enrichment",
    type: "node",
    activeName: "codeBlock",
    command: (editor) => editor.chain().focus().toggleCodeBlock().run(),
    isActive: (editor) => editor.isActive("codeBlock"),
    defaultEnabled: false,
  },
  horizontalRule: {
    extension: HorizontalRule,
    label: "Divider",
    iconPath: icons.horizontalRule,
    group: "Enrichment",
    type: "node",
    command: (editor) => editor.chain().focus().setHorizontalRule().run(),
    isActive: () => false,
    defaultEnabled: false,
  },
};

// ─── Derived helpers ──────────────────────────────────────────────────────────

/** All extension keys grouped by their group label */
export const EXTENSION_GROUPS: Record<ExtensionGroup, ExtensionKey[]> = {
  "Text Formatting": [],
  Structure: [],
  Enrichment: [],
};

for (const [key, config] of Object.entries(EXTENSION_REGISTRY) as [
  ExtensionKey,
  ExtensionConfig,
][]) {
  EXTENSION_GROUPS[config.group].push(key);
}

/** Keys that are enabled by default */
export const DEFAULT_ENABLED_KEYS = new Set<ExtensionKey>(
  (Object.entries(EXTENSION_REGISTRY) as [ExtensionKey, ExtensionConfig][])
    .filter(([, c]) => c.defaultEnabled)
    .map(([k]) => k),
);

/**
 * Some extensions share the same underlying Tiptap extension (e.g. heading1/2/3
 * all use Heading). This deduplicates them so useEditor receives each once.
 */
export function resolveExtensions(enabledKeys: Set<ExtensionKey>) {
  const seen = new Set<string>();
  const resolved = [];

  // ListItem is always required when any list type is active
  const needsListItem =
    enabledKeys.has("bulletList") || enabledKeys.has("orderedList");
  if (needsListItem) {
    resolved.push(ListItem);
    seen.add("ListItem");
  }

  for (const key of enabledKeys) {
    const config = EXTENSION_REGISTRY[key];
    const name = config.extension.name;

    // Heading: merge all active levels into one extension
    if (name === "heading") {
      if (!seen.has("heading")) {
        const levels = (
          (["heading1", "heading2", "heading3"] as ExtensionKey[]).filter((k) =>
            enabledKeys.has(k),
          ) as ExtensionKey[]
        ).map((k) => (k === "heading1" ? 1 : k === "heading2" ? 2 : 3)) as (
          | 1
          | 2
          | 3
        )[];

        resolved.push(Heading.configure({ levels }));
        seen.add("heading");
      }
      continue;
    }

    if (!seen.has(name)) {
      resolved.push(config.extension);
      seen.add(name);
    }
  }

  return resolved;
}
