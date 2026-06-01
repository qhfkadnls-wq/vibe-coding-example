import { createServerClient } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const origin = new URL(request.url).origin

  const collectedCookies: { name: string; value: string; options: Record<string, unknown> }[] = []

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            collectedCookies.push({ name, value, options: options as Record<string, unknown> })
          })
        },
      },
    }
  )

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

  const response = NextResponse.redirect(data.url)

  collectedCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  })

  return response
}
