'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Search } from 'lucide-react'
import { Task, User, TaskStatus, STATUS_LABELS } from '@/types'
import Sidebar from '@/components/layout/Sidebar'
import BottomNav from '@/components/layout/BottomNav'
import TaskCard from '@/components/tasks/TaskCard'
import TaskModal from '@/components/tasks/TaskModal'

interface TasksPageProps {
  currentUser: User
}

const STATUSES: (TaskStatus | '')[] = ['', 'todo', 'in_progress', 'done', 'delayed']

export default function TasksPage({ currentUser }: TasksPageProps) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [users, setUsers] = useState<User[]>([])
  const [filterAssignee, setFilterAssignee] = useState('')
  const [filterStatus, setFilterStatus] = useState<TaskStatus | ''>('')
  const [search, setSearch] = useState('')
  const [showModal, setShowModal] = useState(false)
  const [editingTask, setEditingTask] = useState<Task | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchTasks = useCallback(async () => {
    const params = new URLSearchParams()
    if (filterAssignee) params.set('assignee_id', filterAssignee)
    if (filterStatus) params.set('status', filterStatus)
    const res = await fetch(`/api/tasks?${params}`)
    if (res.ok) {
      const data = await res.json()
      setTasks(data)
    }
    setLoading(false)
  }, [filterAssignee, filterStatus])

  const fetchUsers = async () => {
    const res = await fetch('/api/users')
    if (res.ok) setUsers(await res.json())
  }

  useEffect(() => { fetchUsers() }, [])
  useEffect(() => { fetchTasks() }, [fetchTasks])

  const handleSave = async (data: Partial<Task>) => {
    if (editingTask) {
      const res = await fetch(`/api/tasks/${editingTask.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const updated = await res.json()
        setTasks(prev => prev.map(t => t.id === updated.id ? updated : t))
      }
    } else {
      const res = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (res.ok) {
        const created = await res.json()
        setTasks(prev => [created, ...prev])
      }
    }
    setEditingTask(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('업무를 삭제하시겠습니까?')) return
    const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' })
    if (res.ok) setTasks(prev => prev.filter(t => t.id !== id))
  }

  const handleEdit = (task: Task) => {
    setEditingTask(task)
    setShowModal(true)
  }

  const filteredTasks = tasks.filter(t =>
    !search || t.title.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentUser={currentUser} />

      <main className="flex-1 flex flex-col pb-16 md:pb-0">
        <div className="bg-white border-b border-gray-200 px-6 py-5">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-xl font-bold text-gray-800">업무 목록</h2>
              <p className="text-sm text-gray-500 mt-0.5">총 {filteredTasks.length}건</p>
            </div>
            <button
              onClick={() => { setEditingTask(null); setShowModal(true) }}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span className="hidden sm:inline">업무 등록</span>
            </button>
          </div>

          <div className="flex flex-wrap gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="업무 검색..."
                className="pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-48"
              />
            </div>

            <select
              value={filterAssignee}
              onChange={e => setFilterAssignee(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">전체 담당자</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name} ({u.department})</option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value as TaskStatus | '')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{s ? STATUS_LABELS[s] : '전체 상태'}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex-1 p-6">
          {loading ? (
            <div className="flex items-center justify-center h-48">
              <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            </div>
          ) : filteredTasks.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-gray-400">
              <p className="text-sm">등록된 업무가 없습니다</p>
              <button
                onClick={() => { setEditingTask(null); setShowModal(true) }}
                className="mt-3 text-sm text-blue-600 hover:underline"
              >
                첫 번째 업무를 등록해 보세요
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {filteredTasks.map(task => (
                <TaskCard
                  key={task.id}
                  task={task}
                  onEdit={handleEdit}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      <BottomNav />

      {showModal && (
        <TaskModal
          task={editingTask}
          users={users}
          onClose={() => { setShowModal(false); setEditingTask(null) }}
          onSave={handleSave}
        />
      )}
    </div>
  )
}
