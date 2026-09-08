import React from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { Badge } from '@/components/ui/Badge'
import {
  Mic,
  Image as ImageIcon,
  Paperclip,
  Send,
  Activity,
  CheckCircle2,
  Clock,
  Zap
} from 'lucide-react'

export default function Home() {
  return (
    <div className="max-w-5xl mx-auto space-y-8">
      {/* Hero Section */}
      <section className="text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 text-foreground">
          What do you want me to do?
        </h1>
        <p className="text-lg text-foreground/60 max-w-2xl mx-auto mb-8">
          Your Intelligent Digital Workforce is ready. Ask me to manage projects, analyze data, or automate tasks.
        </p>

        {/* Main Input Area */}
        <div className="max-w-3xl mx-auto">
          <div className="relative flex items-center bg-brand-white rounded-2xl shadow-sm border border-brand-gray-dark/20 p-2 overflow-hidden focus-within:ring-2 focus-within:ring-brand-emerald focus-within:border-transparent transition-all">
            <Input
              type="text"
              placeholder="E.g., Analyze today's business performance..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 h-14 text-lg px-4 flex-1 bg-transparent"
            />
            <div className="flex items-center gap-2 pr-2">
              <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground rounded-full">
                <Mic className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground rounded-full">
                <ImageIcon className="w-5 h-5" />
              </Button>
              <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground rounded-full">
                <Paperclip className="w-5 h-5" />
              </Button>
              <Button variant="emerald" size="icon" className="rounded-xl h-12 w-12 ml-2 shadow-sm">
                <Send className="w-5 h-5" />
              </Button>
            </div>
          </div>

          {/* Quick Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {['Check server health', 'Create an Instagram campaign', 'Review GitHub PRs', 'Generate a report'].map((suggestion) => (
              <Badge key={suggestion} variant="secondary" className="px-3 py-1.5 text-sm cursor-pointer hover:bg-brand-gray-dark/20 transition-colors">
                {suggestion}
              </Badge>
            ))}
          </div>
        </div>
      </section>

      {/* Dashboard Metrics */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-brand-gray-dark/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/60">Active Tasks</p>
                <p className="text-3xl font-bold">12</p>
              </div>
              <div className="p-2 bg-brand-emerald/10 text-brand-emerald-dark rounded-lg">
                <Zap className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-foreground/60">
              <span className="text-brand-emerald font-medium">+3</span> since yesterday
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-gray-dark/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/60">Completed</p>
                <p className="text-3xl font-bold">148</p>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <CheckCircle2 className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-foreground/60">
              <span className="text-brand-emerald font-medium">+24</span> this week
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-gray-dark/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/60">Pending Approvals</p>
                <p className="text-3xl font-bold">2</p>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <Clock className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-amber-600 font-medium cursor-pointer hover:underline">
              Review required
            </div>
          </CardContent>
        </Card>

        <Card className="border-brand-gray-dark/10 shadow-sm">
          <CardContent className="p-6 flex flex-col gap-4">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <p className="text-sm font-medium text-foreground/60">System Health</p>
                <p className="text-3xl font-bold text-brand-emerald-dark">99.9%</p>
              </div>
              <div className="p-2 bg-brand-gray text-foreground/70 rounded-lg">
                <Activity className="w-5 h-5" />
              </div>
            </div>
            <div className="text-sm text-foreground/60">
              All systems operational
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
        <Card className="border-brand-gray-dark/10 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Recent Agent Activity</CardTitle>
            <CardDescription>Latest actions performed by your AI workforce</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Analyzed PrinsGo Backend error logs", time: "10 mins ago", status: "Completed" },
              { title: "Generated weekly marketing report", time: "2 hours ago", status: "Completed" },
              { title: "Updating GitHub dependencies", time: "Just now", status: "Running" }
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-brand-gray/30">
                <div className="flex items-center gap-3">
                  <div className={`w-2 h-2 rounded-full ${activity.status === 'Running' ? 'bg-amber-500 animate-pulse' : 'bg-brand-emerald'}`}></div>
                  <div className="space-y-0.5">
                    <p className="text-sm font-medium leading-none">{activity.title}</p>
                    <p className="text-xs text-foreground/50">{activity.time}</p>
                  </div>
                </div>
                <Badge variant={activity.status === 'Running' ? 'secondary' : 'default'} className={activity.status === 'Completed' ? 'bg-brand-emerald/10 text-brand-emerald-dark hover:bg-brand-emerald/20' : ''}>
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="border-brand-gray-dark/10 shadow-sm col-span-1">
          <CardHeader>
            <CardTitle className="text-lg">Recent Memory Ingestion</CardTitle>
            <CardDescription>Knowledge recently added to workspace</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
             {[
              { title: "PrinsGo API Documentation.pdf", type: "Document" },
              { title: "Authentication Flow Architecture", type: "Decision" },
              { title: "UI Brand Guidelines", type: "Knowledge" }
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 p-3 rounded-lg border border-brand-gray-dark/10">
                <div className="p-2 rounded bg-brand-gray text-foreground/60">
                  <Paperclip className="w-4 h-4" />
                </div>
                <div className="flex-1 space-y-0.5 overflow-hidden">
                  <p className="text-sm font-medium leading-none truncate">{item.title}</p>
                  <p className="text-xs text-foreground/50">{item.type}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </section>
    </div>
  )
}
