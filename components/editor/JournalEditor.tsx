"use client";

import { useState, useCallback, useRef } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useToolboxConfig } from "@/hooks/useToolboxConfig";
import { Toolbar } from "./Toolbar";
import { Toolbox } from "./Toolbox";
import { createClient } from "@/lib/supabase/client";
import { ChevronUp, ChevronDown, Settings2 } from "lucide-react";

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
  userId?: string;
}

export function JournalEditor({
  initialContent,
  date,
  userId,
}: JournalEditorProps) {
  const toolboxConfig = useToolboxConfig();
  const [toolboxOpen, setToolboxOpen] = useState(false);
  const [toolbarOpen, setToolbarOpen] = useState(true);
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const supabase = createClient();

  const save = useCallback(
    (content: object) => {
      if (!date || !userId) return;
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(async () => {
        const { error } = await supabase.from("journal_entries").upsert(
          {
            user_id: userId,
            date,
            content,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id,date" },
        );
        if (error) console.error("Save failed:", error);
      }, 1000);
    },
    [date, userId, supabase],
  );

  const editorKey = Array.from(toolboxConfig.enabledKeys).sort().join(",");

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

      {editor && toolbarOpen ? (
        <div className="flex items-center gap-2 p-2 border-b border-border bg-muted/40">
          <Toolbar
            editor={editor}
            enabledKeys={toolboxConfig.enabledKeys}
            className="flex-1"
          />
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
            <Settings2></Settings2>
          </button>
          <button
            title="Enable and disable toolbar"
            aria-label="Enable and disable toolbar"
            onClick={() => setToolbarOpen((o) => !o)}
            className={`
            p-1.5 rounded transition-colors ml-auto shrink-0
            ${
              toolbarOpen
                ? "text-muted-foreground hover:text-foreground hover:bg-muted"
                : "bg-primary text-primary-foreground"
            }
          `}
          >
            <ChevronUp />
          </button>
        </div>
      ) : (
        <button
          title="Enable and disable toolbar"
          aria-label="Enable and disable toolbar"
          onClick={() => setToolbarOpen((o) => !o)}
          className={`
           absolute z-1 right-0 top-0 m-2 p-1.5 rounded transition-colors ml-auto shrink-0
            ${"text-muted-foreground hover:text-foreground hover:bg-muted"}
          `}
        >
          <ChevronDown />
        </button>
      )}

      <div className="flex flex-1">
        {/* ── Editor ── */}
        <div className="flex-1 px-6 py-4 overflow-y-auto">
          <EditorContent editor={editor} />
        </div>

        {/* ── Toolbox drawer ── */}
        {toolboxOpen && toolbarOpen && (
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
