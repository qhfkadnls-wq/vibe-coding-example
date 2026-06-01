import { createServerClient, type CookieMethodsServer } from '@supabase/ssr'
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')

  console.log('[callback] code:', code ? 'present' : 'missing')
  console.log('[callback] cookies:', request.cookies.getAll().map(c => c.name))

  if (!code) {
    console.log('[callback] no code, redirecting to login')
    return NextResponse.redirect(`${origin}/login`)
  }

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
      } as CookieMethodsServer,
    }
  )

  const { error } = await supabase.auth.exchangeCodeForSession(code)

  console.log('[callback] exchangeCodeForSession error:', error)
  console.log('[callback] collectedCookies:', collectedCookies.map(c => c.name))

  if (error) {
    return NextResponse.redirect(`${origin}/login?error=${encodeURIComponent(error.message)}`)
  }

  const { data: { user } } = await supabase.auth.getUser()

  console.log('[callback] user:', user?.id ?? 'null')

  if (!user) {
    return NextResponse.redirect(`${origin}/login?error=user_not_found`)
  }

  const { data: existingUser } = await supabase
    .from('users')
    .select('id')
    .eq('auth_user_id', user.id)
    .single()

  const redirectUrl = existingUser ? `${origin}/` : `${origin}/onboarding`
  console.log('[callback] redirecting to:', redirectUrl)

  const response = NextResponse.redirect(redirectUrl)

  collectedCookies.forEach(({ name, value, options }) => {
    response.cookies.set(name, value, options as Parameters<typeof response.cookies.set>[2])
  })

  return response
}
