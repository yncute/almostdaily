"use client";

import { ToolboxConfig } from "@/hooks/useToolboxConfig";

// ─── Icon ─────────────────────────────────────────────────────────────────────

function Icon({ path, size = 16 }: { path: string; size?: number }) {
  return (
    <svg
      width={size}
      height={size}
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

// ─── Toggle Row ───────────────────────────────────────────────────────────────

interface ToggleRowProps {
  iconPath: string;
  label: string;
  shortcut?: string;
  enabled: boolean;
  onToggle: () => void;
}

function ToggleRow({
  iconPath,
  label,
  shortcut,
  enabled,
  onToggle,
}: ToggleRowProps) {
  return (
    <label className="flex items-center gap-3 py-1.5 cursor-pointer group">
      {/* Icon */}
      <span
        className={`transition-colors ${enabled ? "text-foreground" : "text-muted-foreground"}`}
      >
        <Icon path={iconPath} size={15} />
      </span>

      {/* Label */}
      <span
        className={`flex-1 text-sm transition-colors ${enabled ? "text-foreground" : "text-muted-foreground"}`}
      >
        {label}
      </span>

      {/* Shortcut hint */}
      {shortcut && (
        <kbd className="hidden sm:inline-flex text-[10px] text-muted-foreground bg-muted px-1.5 py-0.5 rounded font-mono">
          {shortcut}
        </kbd>
      )}

      {/* Toggle switch */}
      <button
        role="switch"
        aria-checked={enabled}
        onClick={onToggle}
        className={`
          relative inline-flex h-5 w-9 shrink-0 rounded-full border-2 border-transparent
          transition-colors duration-200 focus-visible:outline focus-visible:ring-2
          focus-visible:ring-ring focus-visible:ring-offset-2
          ${enabled ? "bg-primary" : "bg-input"}
        `}
      >
        <span
          className={`
            pointer-events-none block h-4 w-4 rounded-full bg-white shadow-lg ring-0
            transition-transform duration-200
            ${enabled ? "translate-x-4" : "translate-x-0"}
          `}
        />
      </button>
    </label>
  );
}

// ─── Toolbox ──────────────────────────────────────────────────────────────────

interface ToolboxProps {
  config: ToolboxConfig;
  className?: string;
}

/**
 * Renders a grouped list of extension toggles.
 * Drop it in a drawer, popover, or sidebar — it's layout-agnostic.
 *
 * @example
 * <Toolbox config={toolboxConfig} />
 */
export function Toolbox({ config, className = "" }: ToolboxProps) {
  const { groups, toggle, enableAll, reset } = config;

  return (
    <div className={`flex flex-col gap-6 ${className}`}>
      {/* Groups */}
      {groups.map(({ label, items }) => (
        <section key={label}>
          <h3 className="text-xs font-semibold uppercase tracking-widest text-muted-foreground mb-2">
            {label}
          </h3>
          <div className="flex flex-col divide-y divide-border">
            {items.map((item) => (
              <ToggleRow
                key={item.key}
                iconPath={item.iconPath}
                label={item.label}
                shortcut={item.shortcut}
                enabled={item.enabled}
                onToggle={() => toggle(item.key)}
              />
            ))}
          </div>
        </section>
      ))}

      {/* Footer actions */}
      <div className="flex gap-2 pt-2 border-t border-border">
        <button
          onClick={reset}
          className="flex-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 rounded hover:bg-muted"
        >
          Reset defaults
        </button>
        <button
          onClick={enableAll}
          className="flex-1 text-xs text-muted-foreground hover:text-foreground transition-colors py-1.5 rounded hover:bg-muted"
        >
          Enable all
        </button>
      </div>
    </div>
  );
}
