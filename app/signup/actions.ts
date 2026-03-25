'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function signUp(formData: FormData) {
  const email = formData.get('email') as string
  const password = formData.get('password') as string
  const confirmPassword = formData.get('confirmPassword') as string

  if (password !== confirmPassword) {
    redirect('/signup?error=' + encodeURIComponent('Passwords do not match.'))
  }

  if (password.length < 6) {
    redirect('/signup?error=' + encodeURIComponent('Password must be at least 6 characters.'))
  }

  const supabase = await createClient()

  const { data, error } = await supabase.auth.signUp({ email, password })

  if (error) {
    redirect('/signup?error=' + encodeURIComponent(error.message))
  }

  // If email confirmation is disabled in Supabase, the user session is active immediately
  if (data.session) {
    revalidatePath('/', 'layout')
    redirect('/dashboard')
  }

  // Email confirmation required — prompt the user to check their inbox
  redirect('/signup?message=' + encodeURIComponent('Check your email to confirm your account before signing in.'))
}
