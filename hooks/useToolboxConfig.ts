"use client";

import { useCallback, useMemo, useState } from "react";
import {
  DEFAULT_ENABLED_KEYS,
  EXTENSION_GROUPS,
  EXTENSION_REGISTRY,
  ExtensionGroup,
  ExtensionKey,
  resolveExtensions,
} from "@/lib/extensions/registry";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface ToolboxConfig {
  /** Currently enabled extension keys */
  enabledKeys: Set<ExtensionKey>;
  /** Resolved Tiptap extensions array — pass directly to useEditor */
  extensions: ReturnType<typeof resolveExtensions>;
  /** Grouped structure for rendering the toolbox UI */
  groups: {
    label: ExtensionGroup;
    items: {
      key: ExtensionKey;
      label: string;
      iconPath: string;
      shortcut?: string;
      enabled: boolean;
    }[];
  }[];
  /** Toggle a single extension on/off */
  toggle: (key: ExtensionKey) => void;
  /** Enable all extensions */
  enableAll: () => void;
  /** Reset to defaults */
  reset: () => void;
}

// ─── Hook ─────────────────────────────────────────────────────────────────────

/**
 * Central hook that manages which Tiptap extensions are active.
 *
 * @param initialKeys - Override the default enabled set (e.g. loaded from DB)
 *
 * @example
 * const { extensions, groups, toggle } = useToolboxConfig();
 * const editor = useEditor({ extensions: [...StarterKit, ...extensions] });
 */
export function useToolboxConfig(
  initialKeys: Set<ExtensionKey> = DEFAULT_ENABLED_KEYS,
): ToolboxConfig {
  const [enabledKeys, setEnabledKeys] = useState<Set<ExtensionKey>>(
    new Set(initialKeys),
  );

  const toggle = useCallback((key: ExtensionKey) => {
    setEnabledKeys((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });
  }, []);

  const enableAll = useCallback(() => {
    setEnabledKeys(new Set(Object.keys(EXTENSION_REGISTRY) as ExtensionKey[]));
  }, []);

  const reset = useCallback(() => {
    setEnabledKeys(new Set(DEFAULT_ENABLED_KEYS));
  }, []);

  const extensions = useMemo(
    () => resolveExtensions(enabledKeys),
    [enabledKeys],
  );

  const groups = useMemo(
    () =>
      (
        Object.entries(EXTENSION_GROUPS) as [ExtensionGroup, ExtensionKey[]][]
      ).map(([label, keys]) => ({
        label,
        items: keys.map((key) => ({
          key,
          label: EXTENSION_REGISTRY[key].label,
          iconPath: EXTENSION_REGISTRY[key].iconPath,
          shortcut: EXTENSION_REGISTRY[key].shortcut,
          enabled: enabledKeys.has(key),
        })),
      })),
    [enabledKeys],
  );

  return { enabledKeys, extensions, groups, toggle, enableAll, reset };
}
