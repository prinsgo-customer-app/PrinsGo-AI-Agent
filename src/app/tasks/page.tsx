"use client"

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CheckSquare, Clock, AlertTriangle, CheckCircle2, PlayCircle, Loader2 } from 'lucide-react'

const tasks = [
  { id: 'TSK-001', desc: 'Fix PrinsGo Partner login bug', status: 'RUNNING', type: 'Bug Fix', time: '10 mins ago', agent: 'Developer Skills' },
  { id: 'TSK-002', desc: 'Generate Weekly Revenue Report', status: 'COMPLETED', type: 'Analytics', time: '2 hours ago', agent: 'Business Analyst' },
  { id: 'TSK-003', desc: 'Deploy new payment gateway', status: 'WAITING_FOR_APPROVAL', type: 'Deployment', time: '5 hours ago', agent: 'DevOps Skills' },
  { id: 'TSK-004', desc: 'Create Instagram marketing campaign', status: 'PLANNING', type: 'Marketing', time: '1 day ago', agent: 'Marketing Manager' },
  { id: 'TSK-005', desc: 'Update GitHub dependencies', status: 'FAILED', type: 'Maintenance', time: '2 days ago', agent: 'Developer Skills' },
]

const getStatusIcon = (status: string) => {
  switch(status) {
    case 'RUNNING': return <Loader2 className="w-4 h-4 animate-spin text-amber-500" />
    case 'COMPLETED': return <CheckCircle2 className="w-4 h-4 text-brand-emerald" />
    case 'WAITING_FOR_APPROVAL': return <AlertTriangle className="w-4 h-4 text-amber-500" />
    case 'PLANNING': return <Clock className="w-4 h-4 text-blue-500" />
    case 'FAILED': return <AlertTriangle className="w-4 h-4 text-red-500" />
    default: return <PlayCircle className="w-4 h-4 text-foreground/50" />
  }
}

const getStatusBadge = (status: string) => {
  switch(status) {
    case 'RUNNING': return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700">RUNNING</Badge>
    case 'COMPLETED': return <Badge variant="outline" className="border-emerald-200 bg-emerald-50 text-emerald-700">COMPLETED</Badge>
    case 'WAITING_FOR_APPROVAL': return <Badge variant="outline" className="border-amber-200 bg-amber-50 text-amber-700 font-bold">APPROVAL NEEDED</Badge>
    case 'PLANNING': return <Badge variant="outline" className="border-blue-200 bg-blue-50 text-blue-700">PLANNING</Badge>
    case 'FAILED': return <Badge variant="destructive">FAILED</Badge>
    default: return <Badge variant="secondary">{status}</Badge>
  }
}

export default function TasksPage() {
  return (
    <div className="max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <div className="p-2 bg-brand-emerald/10 text-brand-emerald-dark rounded-lg">
            <CheckSquare className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Task Engine</h1>
            <p className="text-sm text-foreground/60">Monitor and manage agent executions</p>
          </div>
        </div>
        <Button variant="emerald">New Task</Button>
      </div>

      {/* Live Execution Highlight (simulated) */}
      <Card className="border-brand-emerald/30 shadow-md bg-brand-emerald/5 overflow-hidden">
        <CardHeader className="pb-3 bg-brand-white border-b border-brand-emerald/10">
          <div className="flex items-center justify-between">
            <CardTitle className="text-base flex items-center gap-2">
              <span className="relative flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-emerald opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-brand-emerald"></span>
              </span>
              Live Execution: TSK-001
            </CardTitle>
            <Badge variant="outline" className="bg-brand-white">Agent: Developer Skills</Badge>
          </div>
          <CardDescription className="font-medium text-foreground">Fix PrinsGo Partner login bug</CardDescription>
        </CardHeader>
        <CardContent className="pt-4 space-y-4">
          <div className="space-y-3 pl-2 border-l-2 border-brand-emerald/30 ml-2">
            <div className="flex items-center gap-3 text-sm text-foreground/70">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> Understand request
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground/70">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> Inspect repository
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground/70">
              <CheckCircle2 className="w-4 h-4 text-brand-emerald" /> Analyze error logs
            </div>
            <div className="flex items-center gap-3 text-sm font-medium text-foreground relative">
              <Loader2 className="w-4 h-4 text-amber-500 animate-spin absolute -left-6 bg-brand-gray" /> Modify authentication controller
            </div>
            <div className="flex items-center gap-3 text-sm text-foreground/40">
              <div className="w-4 h-4 rounded-full border-2 border-foreground/20"></div> Run tests
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Task List */}
      <Card className="border-brand-gray-dark/20 shadow-sm">
        <CardHeader>
          <CardTitle>All Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {tasks.map((task) => (
              <div key={task.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 rounded-xl border border-brand-gray-dark/10 hover:bg-brand-gray/30 transition-colors gap-4">
                <div className="flex items-start gap-4">
                  <div className="mt-1">{getStatusIcon(task.status)}</div>
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-mono text-foreground/50">{task.id}</span>
                      <h4 className="font-semibold text-sm">{task.desc}</h4>
                    </div>
                    <div className="flex items-center gap-3 text-xs text-foreground/60">
                      <span>{task.type}</span>
                      <span>•</span>
                      <span>{task.agent}</span>
                      <span>•</span>
                      <span>{task.time}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3 self-end sm:self-auto">
                  {getStatusBadge(task.status)}
                  <Button variant="ghost" size="sm" className="text-xs">View Details</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
