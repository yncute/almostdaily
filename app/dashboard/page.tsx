import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function signOut() {
  'use server'
  const supabase = await createClient()
  await supabase.auth.signOut()
  revalidatePath('/', 'layout')
  redirect('/login')
}

export default async function DashboardPage() {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="text-lg font-semibold text-gray-900">Dashboard</span>
          <form action={signOut}>
            <button
              type="submit"
              className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              Sign out
            </button>
          </form>
        </div>
      </nav>

      <main className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="mb-2 text-2xl font-bold text-gray-900">
          Welcome back{user.email ? `, ${user.email}` : ''}
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
              {user.id}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email
            </p>
            <p className="mt-1 text-sm text-gray-800">{user.email}</p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Email Confirmed
            </p>
            <p className="mt-1 text-sm text-gray-800">
              {user.email_confirmed_at
                ? new Date(user.email_confirmed_at).toLocaleDateString()
                : 'Pending confirmation'}
            </p>
          </div>

          <div className="rounded-xl border bg-white p-6 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-wide text-gray-400">
              Last Sign In
            </p>
            <p className="mt-1 text-sm text-gray-800">
              {user.last_sign_in_at
                ? new Date(user.last_sign_in_at).toLocaleString()
                : 'N/A'}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
