import { createClient } from '@/lib/supabase/server'

export default async function DashboardPage() {
  const supabase = await createClient()
  // Auth is guaranteed by (protected)/layout.tsx — user is always defined here
  const {
    data: { user },
  } = await supabase.auth.getUser()

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Welcome back{user?.email ? `, ${user.email}` : ''}
        </h1>
        <p className="mb-8 text-sm text-gray-500">
          You are signed in. Here is your account overview.
        </p>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              User ID
            </p>
            <p className="mt-1 break-all font-mono text-sm text-gray-800">
              {user?.id}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email
            </p>
            <p className="mt-1 text-sm text-gray-800">{user?.email}</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email Confirmed
            </p>
            <p className="mt-1 text-sm text-gray-800">
              {user?.email_confirmed_at
                ? new Date(user.email_confirmed_at).toLocaleDateString()
                : 'Pending confirmation'}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Last Sign In
            </p>
            <p className="mt-1 text-sm text-gray-800">
              {user?.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
