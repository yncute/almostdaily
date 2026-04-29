import { createClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createClient();
  // Auth is guaranteed by (protected)/layout.tsx — user is always defined here
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-foreground">
          Welcome back{user?.email ? `, ${user.email}` : ""}
        </h1>
        <p className="mb-8 text-sm text-muted-foreground">
          You are signed in. Here is your account overview.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              User ID
            </p>
            <p className="mt-1 break-all font-mono text-sm text-card-foreground">
              {user?.id}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email
            </p>
            <p className="mt-1 text-sm text-card-foreground">{user?.email}</p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Email Confirmed
            </p>
            <p className="mt-1 text-sm text-card-foreground">
              {user?.email_confirmed_at
                ? new Date(user.email_confirmed_at).toLocaleDateString()
                : "Pending confirmation"}
            </p>
          </div>

          <div className="rounded-xl border bg-card p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last Sign In
            </p>
            <p className="mt-1 text-sm text-card-foreground">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : "N/A"}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
