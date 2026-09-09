"use client"
import React, { useEffect } from 'react';
import { useAuthStore } from '@/store/authStore';
import { useTaskStore } from '@/store/taskStore';
import api from '@/lib/api';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

export default function TasksPage() {
  const workspaceId = useAuthStore((state) => state.workspaceId);
  const { tasks, setTasks } = useTaskStore();

  useEffect(() => {
    if (workspaceId) {
      api.get(`/ai-agent/tasks?workspaceId=${workspaceId}`)
        .then(res => setTasks(res.data.tasks))
        .catch(console.error);
    }
  }, [workspaceId, setTasks]);

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold">Tasks</h1>
      <div className="grid grid-cols-1 gap-4">
        {tasks.map((task: Record<string, unknown>) => (
          <Card key={task._id as string} className="shadow-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-lg font-medium">{task.description as string}</CardTitle>
              <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}
                     className={task.status === 'COMPLETED' ? 'bg-brand-emerald' : ''}>
                {task.status as string}
              </Badge>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">Started: {new Date(task.createdAt as string).toLocaleString()}</p>
              {task.result ? (
                <div className="mt-4 p-4 bg-gray-50 rounded-md text-sm whitespace-pre-wrap">
                  {(task.result as Record<string, unknown>).text as string}
                </div>
              ) : null}
            </CardContent>
          </Card>
        ))}
        {tasks.length === 0 && <p className="text-gray-500">No tasks found for this workspace.</p>}
      </div>
    </div>
  );
}
