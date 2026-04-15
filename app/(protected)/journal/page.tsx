import { createClient } from "@/lib/supabase/server";
import { JournalEditor } from "@/components/editor/JournalEditor";

// supabase to get user data

export default async function JournalPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return <JournalEditor></JournalEditor>;
}
