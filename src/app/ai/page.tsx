"use client"

import React, { useState } from 'react'
import { Card } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Paperclip, Send, Bot, User, Command } from 'lucide-react'

type Message = {
  role: string;
  content: string;
  tools?: string[];
  status?: string;
}

export default function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([
    { role: 'ai', content: 'Hello! I am your PrinsGo AI Agent. How can I assist you with your projects today?' },
    { role: 'user', content: 'Check the PrinsGo Partner login bug.' },
    {
      role: 'ai',
      content: 'I have started analyzing the PrinsGo Partner repository for the login bug. I will inspect the authentication controllers and frontend API calls.',
      tools: ['GitHub', 'Terminal', 'Web'],
      status: 'PLANNING'
    }
  ])

  const [input, setInput] = useState('')

  const handleSend = () => {
    if(!input.trim()) return
    setMessages([...messages, { role: 'user', content: input }])
    setInput('')
    // Simulate AI response
    setTimeout(() => {
      setMessages(prev => [...prev, {
        role: 'ai',
        content: 'I am looking into that right now.',
        status: 'RUNNING'
      }])
    }, 1000)
  }

  return (
    <div className="flex flex-col h-[calc(100vh-10rem)] max-w-4xl mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-brand-emerald/10 text-brand-emerald-dark rounded-lg">
          <Command className="w-5 h-5" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">AI Command Center</h1>
          <p className="text-sm text-foreground/60">Natural language control for your digital workforce</p>
        </div>
      </div>

      {/* Chat Area */}
      <Card className="flex-1 flex flex-col border-brand-gray-dark/20 shadow-sm overflow-hidden mb-6">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.map((msg, i) => (
            <div key={i} className={`flex gap-4 ${msg.role === 'user' ? 'justify-end' : ''}`}>
              {msg.role === 'ai' && (
                <div className="w-8 h-8 rounded-full bg-brand-emerald flex items-center justify-center shrink-0 mt-1">
                  <Bot className="w-4 h-4 text-brand-white" />
                </div>
              )}

              <div className={`max-w-[80%] ${msg.role === 'user' ? 'order-1' : ''}`}>
                <div className={`p-4 rounded-2xl text-sm ${
                  msg.role === 'user'
                    ? 'bg-foreground text-brand-white rounded-tr-sm'
                    : 'bg-brand-gray/50 border border-brand-gray-dark/10 rounded-tl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.content}</p>
                </div>

                {msg.tools && (
                  <div className="flex gap-2 mt-2 ml-1">
                    {msg.tools.map(tool => (
                      <span key={tool} className="text-[10px] font-medium px-2 py-0.5 rounded-full border border-brand-gray-dark/20 text-foreground/60 bg-brand-white">
                        {tool}
                      </span>
                    ))}
                  </div>
                )}
                {msg.status && (
                  <div className="flex items-center gap-1.5 mt-2 ml-1 text-xs font-medium text-amber-600">
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-amber-400 opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-amber-500"></span>
                    </span>
                    Task: {msg.status}
                  </div>
                )}
              </div>

              {msg.role === 'user' && (
                <Avatar fallback="U" className="w-8 h-8 shrink-0 mt-1 order-2" />
              )}
            </div>
          ))}
        </div>

        {/* Input Area */}
        <div className="p-4 border-t border-brand-gray-dark/10 bg-brand-white">
          <div className="relative flex items-center bg-brand-gray/30 rounded-xl border border-brand-gray-dark/20 p-1.5 focus-within:ring-2 focus-within:ring-brand-emerald focus-within:border-transparent transition-all">
            <Input
              type="text"
              placeholder="Give a command..."
              className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 bg-transparent flex-1 shadow-none"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            />
            <div className="flex items-center gap-1 pr-1">
              <Button variant="ghost" size="icon" className="text-foreground/50 hover:text-foreground h-9 w-9">
                <Paperclip className="w-4 h-4" />
              </Button>
              <Button
                variant="emerald"
                size="icon"
                className="rounded-lg h-9 w-9 ml-1"
                onClick={handleSend}
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}
