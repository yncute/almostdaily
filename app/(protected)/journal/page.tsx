import { createClient } from "@/lib/supabase/server";
import Tiptap from "@/components/Tiptap";

// supabase to get user data

export default async function JournalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-black">
      <Tiptap></Tiptap>
    </div>
  );
}
