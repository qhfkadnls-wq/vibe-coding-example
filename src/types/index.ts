export type TaskStatus = 'todo' | 'in_progress' | 'done' | 'delayed'

export interface User {
  id: string
  auth_user_id: string
  email: string
  name: string
  department: string
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  assignee_id: string
  title: string
  content: string
  deadline: string
  status: TaskStatus
  created_at: string
  updated_at: string
  assignee?: User
}

export const STATUS_LABELS: Record<TaskStatus, string> = {
  todo: '할 일',
  in_progress: '진행 중',
  done: '완료',
  delayed: '지연',
}

export const STATUS_COLORS: Record<TaskStatus, string> = {
  todo: 'bg-gray-100 text-gray-700',
  in_progress: 'bg-blue-100 text-blue-700',
  done: 'bg-green-100 text-green-700',
  delayed: 'bg-red-100 text-red-700',
}
