import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { searchParams } = new URL(request.url)
  const assigneeId = searchParams.get('assignee_id')
  const status = searchParams.get('status')

  let query = supabase
    .from('tasks')
    .select('*, assignee:users(*)')
    .order('created_at', { ascending: false })

  if (assigneeId) query = query.eq('assignee_id', assigneeId)
  if (status) query = query.eq('status', status)

  const { data, error } = await query

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}

export async function POST(request: Request) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const body = await request.json()
  const { title, content, assignee_id, deadline, status } = body

  if (!title || !assignee_id || !deadline || !status) {
    return NextResponse.json({ error: 'Required fields missing' }, { status: 400 })
  }

  const now = new Date().toISOString()
  const { data, error } = await supabase
    .from('tasks')
    .insert({ title, content, assignee_id, deadline, status, created_at: now, updated_at: now })
    .select('*, assignee:users(*)')
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json(data)
}
