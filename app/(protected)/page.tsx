import { CalendarView } from "@/components/CalendarView";

export default function HomePage() {
  return (
    <div className="flex flex-row min-h-screen w-full bg-background">
      <div className="flex flex-col h-full min-w-full px-6 py-10">
        <div className="mb-8 text-2xl font-bold text-foreground">
          your calendar
        </div>
        <CalendarView />
      </div>
    </div>
  );
}
