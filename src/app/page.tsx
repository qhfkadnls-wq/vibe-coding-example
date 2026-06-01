import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import TasksPage from './tasks-page'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: currentUser } = await supabase
    .from('users')
    .select('*')
    .eq('auth_user_id', user.id)
    .single()

  if (!currentUser) {
    redirect('/onboarding')
  }

  return <TasksPage currentUser={currentUser} />
}
