"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "./ui/button";

type Mood = "awful" | "bad" | "okay" | "good" | "great";

const MOODS: { value: Mood; label: string; emoji: string }[] = [
  { value: "awful", label: "awful", emoji: "😞" },
  { value: "bad", label: "bad", emoji: "😕" },
  { value: "okay", label: "okay", emoji: "😐" },
  { value: "good", label: "good", emoji: "🙂" },
  { value: "great", label: "great", emoji: "😄" },
];

interface MoodTrackerProps {
  date: string;
  userId: string;
  initialMood?: Mood | null;
}

export function MoodTracker({ date, userId, initialMood }: MoodTrackerProps) {
  const [selected, setSelected] = useState<Mood | null>(initialMood ?? null);
  const [saving, setSaving] = useState(false);
  const supabase = createClient();

  async function handleSelect(mood: Mood) {
    setSelected(mood);
    setSaving(true);

    const { error } = await supabase
      .from("journal_entries")
      .upsert(
        { user_id: userId, date, mood, updated_at: new Date().toISOString() },
        { onConflict: "user_id, date" },
      );

    if (error) {
      console.error("Failed to save mood:", error);
      setSelected(initialMood ?? null); // revert on failure
    }

    setSaving(false);
  }

  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-muted-foreground shrink-0">
        {saving ? "saving…" : "mood"}
      </span>
      <div className="flex gap-1">
        {MOODS.map(({ value, label, emoji }) => (
          <Button
            key={value}
            title={label}
            aria-label={label}
            aria-pressed={selected === value}
            onClick={() => handleSelect(value)}
            className={`
              flex flex-col items-center gap-0.5 px-2.5 py-1.5 rounded-md text-xs
              transition-colors border
              ${
                selected === value
                  ? "bg-primary/10 border-primary/30 text-primary"
                  : "border-transparent text-muted-foreground hover:bg-muted hover:text-foreground"
              }
            `}
          >
            <span className="text-base leading-none">{emoji}</span>
            <span className="leading-none">{label}</span>
          </Button>
        ))}
      </div>
    </div>
  );
}
