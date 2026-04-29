import { notFound } from "next/navigation";
import { JournalEditor } from "@/components/editor/JournalEditor";
import { createClient } from "@/lib/supabase/server";

interface Props {
  params: Promise<{ date: string }>;
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default async function JournalDayPage({ params }: Props) {
  const { date } = await params;

  // Validate date format
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) notFound();

  const supabase = await createClient();
  const { data: entry } = await supabase
    .from("journal_entries")
    .select("content")
    .eq("date", date)
    .maybeSingle();

  return (
    <div className="flex flex-col h-[calc(100vh-57px)]">
      <div className="border-b border-border px-6 py-4">
        <p className="text-sm text-muted-foreground">{formatDate(date)}</p>
      </div>
      <div className="flex-1 overflow-hidden">
        <JournalEditor initialContent={entry?.content ?? null} date={date} />
      </div>
    </div>
  );
}
