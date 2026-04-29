import { CalendarView } from "@/components/CalendarView";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-2xl px-6 py-10">
        <div className="mb-8 text-2xl font-bold text-foreground">
          your calendar
        </div>
        <CalendarView />
      </div>
    </div>
  );
}
