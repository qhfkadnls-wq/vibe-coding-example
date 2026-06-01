'use client'

import { Task, STATUS_LABELS, STATUS_COLORS } from '@/types'
import { Calendar, User, Pencil, Trash2 } from 'lucide-react'

interface TaskCardProps {
  task: Task
  onEdit: (task: Task) => void
  onDelete: (id: string) => void
}

export default function TaskCard({ task, onEdit, onDelete }: TaskCardProps) {
  const isOverdue =
    task.status !== 'done' &&
    task.deadline &&
    new Date(task.deadline) < new Date()

  const deadlineText = task.deadline
    ? new Date(task.deadline).toLocaleDateString('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : '-'

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-3 mb-3">
        <h3 className="text-sm font-semibold text-gray-800 line-clamp-2 flex-1">{task.title}</h3>
        <span className={`shrink-0 px-2.5 py-1 rounded-full text-xs font-medium ${STATUS_COLORS[task.status]}`}>
          {STATUS_LABELS[task.status]}
        </span>
      </div>

      {task.content && (
        <p className="text-xs text-gray-500 mb-3 line-clamp-2">{task.content}</p>
      )}

      <div className="space-y-1.5">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <User className="w-3.5 h-3.5" />
          <span>
            {task.assignee?.name ?? '-'}
            {task.assignee?.department && (
              <span className="text-gray-400"> · {task.assignee.department}</span>
            )}
          </span>
        </div>
        <div className={`flex items-center gap-2 text-xs ${isOverdue ? 'text-red-500' : 'text-gray-500'}`}>
          <Calendar className="w-3.5 h-3.5" />
          <span>{deadlineText}{isOverdue && ' (기한 초과)'}</span>
        </div>
      </div>

      <div className="flex gap-2 mt-4 pt-3 border-t border-gray-100">
        <button
          onClick={() => onEdit(task)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
        >
          <Pencil className="w-3.5 h-3.5" />
          수정
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-red-500 hover:bg-red-50 rounded-lg transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          삭제
        </button>
      </div>
    </div>
  )
}
