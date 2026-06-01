import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  if (code) {
    const supabase = await createClient()
    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { data: existingUser } = await supabase
          .from('users')
          .select('id')
          .eq('auth_user_id', user.id)
          .single()

        if (existingUser) {
          return NextResponse.redirect(`${origin}/`)
        } else {
          return NextResponse.redirect(`${origin}/onboarding`)
        }
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`)
}
