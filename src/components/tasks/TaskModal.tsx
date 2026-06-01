'use client'

import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Task, User, TaskStatus, STATUS_LABELS } from '@/types'

interface TaskModalProps {
  task?: Task | null
  users: User[]
  onClose: () => void
  onSave: (data: Partial<Task>) => Promise<void>
}

const STATUSES: TaskStatus[] = ['todo', 'in_progress', 'done', 'delayed']

export default function TaskModal({ task, users, onClose, onSave }: TaskModalProps) {
  const [form, setForm] = useState({
    title: '',
    content: '',
    assignee_id: '',
    deadline: '',
    status: 'todo' as TaskStatus,
  })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        content: task.content || '',
        assignee_id: task.assignee_id,
        deadline: task.deadline ? task.deadline.split('T')[0] : '',
        status: task.status,
      })
    }
  }, [task])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    try {
      await onSave({
        ...form,
        deadline: form.deadline ? new Date(form.deadline).toISOString() : '',
      })
      onClose()
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-xl">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800">
            {task ? '업무 수정' : '업무 등록'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">업무 제목 *</label>
            <input
              type="text"
              required
              value={form.title}
              onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="업무 제목을 입력하세요"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">업무 내용</label>
            <textarea
              value={form.content}
              onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
              placeholder="업무 내용을 입력하세요"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">담당자 *</label>
              <select
                required
                value={form.assignee_id}
                onChange={e => setForm(f => ({ ...f, assignee_id: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">선택</option>
                {users.map(u => (
                  <option key={u.id} value={u.id}>
                    {u.name} ({u.department})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">마감 일정 *</label>
              <input
                type="date"
                required
                value={form.deadline}
                onChange={e => setForm(f => ({ ...f, deadline: e.target.value }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">상태 *</label>
            <select
              value={form.status}
              onChange={e => setForm(f => ({ ...f, status: e.target.value as TaskStatus }))}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {STATUSES.map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
            >
              취소
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
            >
              {loading ? '저장 중...' : '저장'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
