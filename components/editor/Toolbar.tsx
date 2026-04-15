"use client";

import { Editor } from "@tiptap/react";
import { EXTENSION_REGISTRY, ExtensionKey } from "@/lib/extensions/registry";

// ─── Icon ─────────────────────────────────────────────────────────────────────

function Icon({ path }: { path: string }) {
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
      <path d={path} />
    </svg>
  );
}

// ─── Toolbar Button ────────────────────────────────────────────────────────────

interface ToolbarButtonProps {
  iconPath: string;
  label: string;
  active: boolean;
  onClick: () => void;
}

function ToolbarButton({
  iconPath,
  label,
  active,
  onClick,
}: ToolbarButtonProps) {
  return (
    <button
      title={label}
      aria-label={label}
      aria-pressed={active}
      onMouseDown={(e) => {
        // Prevent editor losing focus on click
        e.preventDefault();
        onClick();
      }}
      className={`
        p-1.5 rounded transition-colors
        ${
          active
            ? "bg-primary text-primary-foreground"
            : "text-muted-foreground hover:text-foreground hover:bg-muted"
        }
      `}
    >
      <Icon path={iconPath} />
    </button>
  );
}

// ─── Toolbar ──────────────────────────────────────────────────────────────────

interface ToolbarProps {
  editor: Editor;
  enabledKeys: Set<ExtensionKey>;
  className?: string;
}

/**
 * Renders toolbar buttons for all currently enabled extensions.
 * Buttons are ordered and grouped to match the registry groups.
 *
 * @example
 * <Toolbar editor={editor} enabledKeys={toolboxConfig.enabledKeys} />
 */
export function Toolbar({ editor, enabledKeys, className = "" }: ToolbarProps) {
  // Ordered list of enabled keys, preserving registry insertion order
  const enabledEntries = (
    Object.entries(EXTENSION_REGISTRY) as [
      ExtensionKey,
      (typeof EXTENSION_REGISTRY)[ExtensionKey],
    ][]
  ).filter(([key]) => enabledKeys.has(key));

  // Group entries by their group label, preserving order
  const grouped = enabledEntries.reduce<
    { group: string; entries: typeof enabledEntries }[]
  >((acc, entry) => {
    const [, config] = entry;
    const last = acc[acc.length - 1];
    if (last && last.group === config.group) {
      last.entries.push(entry);
    } else {
      acc.push({ group: config.group, entries: [entry] });
    }
    return acc;
  }, []);

  return (
    <div
      role="toolbar"
      aria-label="Text formatting"
      className={`flex items-center gap-0.5 flex-wrap ${className}`}
    >
      {grouped.map(({ group, entries }, groupIndex) => (
        <span key={group} className="flex items-center gap-0.5">
          {/* Divider between groups */}
          {groupIndex > 0 && (
            <span className="w-px h-5 bg-border mx-1" aria-hidden />
          )}
          {entries.map(([key, config]) => (
            <ToolbarButton
              key={key}
              iconPath={config.iconPath}
              label={config.label}
              active={config.isActive(editor)}
              onClick={() => config.command(editor)}
            />
          ))}
        </span>
      ))}
    </div>
  );
}
