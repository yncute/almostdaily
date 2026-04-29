"use client";

import { useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useToolboxConfig } from "@/hooks/useToolboxConfig";
import { Toolbar } from "./Toolbar";
import { Toolbox } from "./Toolbox";
import { createClient } from "@/lib/supabase/client";

// ─── Settings Icon ────────────────────────────────────────────────────────────

function SettingsIcon() {
  return (
    <svg
      width={16}
      height={16}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
      <circle cx="12" cy="12" r="3" />
    </svg>
  );
}

// ─── JournalEditor ────────────────────────────────────────────────────────────

/**
 * Full journal editor with toolbar and toolbox.
 *
 * The editor is keyed on `editorKey` so it remounts whenever the enabled
 * extension set changes — this is required because Tiptap extensions are
 * baked in at init time.
 */
interface JournalEditorProps {
  initialContent?: object | null;
  date?: string;
}

export function JournalEditor({ initialContent, date }: JournalEditorProps) {
  const toolboxConfig = useToolboxConfig();
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  const save = useCallback(
    (content: object) => {
      if (!date) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        await supabase
          .from("journal_entries")
          .upsert(
            { date, content, updated_at: new Date().toISOString() },
            { onConflict: "user_id,date" },
          );
      }, 1000);
    },
    [date, supabase],
  );

  const editorKey = Array.from(toolboxConfig.enabledKeys).sort().join(",");

  //   // Track a key we bump whenever enabled extensions change, forcing editor remount
  //   const [editorKey, setEditorKey] = useState(0);
  //   const prevKeysRef = useRef(toolboxConfig.enabledKeys);

  //   useEffect(() => {
  //     // Only remount if the set actually changed
  //     const prev = prevKeysRef.current;
  //     const next = toolboxConfig.enabledKeys;
  //     if (prev !== next) {
  //       prevKeysRef.current = next;
  //       setEditorKey((k) => k + 1);
  //     }
  //   }, [toolboxConfig.enabledKeys]);

  const editor = useEditor(
    {
      immediatelyRender: false,
      content: initialContent ?? undefined,
      onUpdate: ({ editor }) => save(editor.getJSON()),
      extensions: [
        // StarterKit provides Document, Paragraph, Text, History, etc.
        // Disable built-ins that we manage ourselves via the registry.
        StarterKit.configure({
          bold: false,
          italic: false,
          strike: false,
          code: false,
          heading: false,
          bulletList: false,
          orderedList: false,
          listItem: false,
          blockquote: false,
          codeBlock: false,
          horizontalRule: false,
        }),
        ...toolboxConfig.extensions,
      ],
      editorProps: {
        attributes: {
          class:
            "prose prose-sm prose-base dark:prose-invert max-w-none focus:outline-none min-h-[200px]",
        },
      },
    },
    [editorKey], // remount when extensions change
  );

  return (
    <div className="relative flex flex-col h-full rounded-lg overflow-hidden bg-background">
      {/* ── Topbar ── */}
      <div className="flex items-center gap-2 px-3 py-2 border-b border-border bg-muted/40">
        {editor && (
          <Toolbar
            editor={editor}
            enabledKeys={toolboxConfig.enabledKeys}
            className="flex-1"
          />
        )}
        <button
          title="Customize toolbar"
          aria-label="Customize toolbar"
          onClick={() => setToolboxOpen((o) => !o)}
          className={`
            p-1.5 rounded transition-colors ml-auto shrink-0
            ${
              toolboxOpen
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:text-foreground hover:bg-muted"
            }
          `}
        >
          <SettingsIcon />
        </button>
      </div>

      <div className="flex flex-1">
        {/* ── Editor ── */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>

        {/* ── Toolbox drawer ── */}
        {toolboxOpen && (
          <div className="w-64 border-l border-border px-4 py-4 overflow-y-auto shrink-0 bg-background">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold">Customize toolbar</h2>
              <button
                aria-label="Close"
                onClick={() => setToolboxOpen(false)}
                className="text-muted-foreground hover:text-foreground text-lg leading-none"
              >
                ×
              </button>
            </div>
            <Toolbox config={toolboxConfig} />
          </div>
        )}
      </div>
    </div>
  );
}
