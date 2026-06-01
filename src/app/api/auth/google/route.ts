import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${origin}/auth/callback`,
      skipBrowserRedirect: true,
    },
  })

  if (error || !data?.url) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error?.message ?? 'OAuth 실패')}`)
  }

  return NextResponse.redirect(data.url)
}
