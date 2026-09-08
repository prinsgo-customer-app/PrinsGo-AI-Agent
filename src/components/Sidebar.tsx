import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  Home,
  Bot,
  CheckSquare,
  FolderOpen,
  Zap,
  BarChart,
  Megaphone,
  Blocks,
  Brain,
  CheckCircle,
  UserCircle
} from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'HOME', href: '/', icon: Home },
  { name: 'AI', href: '/ai', icon: Bot },
  { name: 'TASKS', href: '/tasks', icon: CheckSquare },
  { name: 'PROJECTS', href: '/projects', icon: FolderOpen },
  { name: 'AUTOMATION', href: '/automation', icon: Zap },
  { name: 'BUSINESS', href: '/business', icon: BarChart },
  { name: 'MARKETING', href: '/marketing', icon: Megaphone },
  { name: 'INTEGRATIONS', href: '/integrations', icon: Blocks },
  { name: 'MEMORY', href: '/memory', icon: Brain },
  { name: 'APPROVALS', href: '/approvals', icon: CheckCircle },
  { name: 'PROFILE', href: '/profile', icon: UserCircle },
]

export function Sidebar({ className }: { className?: string }) {
  const pathname = usePathname()

  return (
    <aside className={cn("flex h-full flex-col bg-brand-white border-r border-brand-gray-dark/20 w-64", className)}>
      <div className="p-6 flex items-center gap-2">
        <div className="w-8 h-8 rounded bg-brand-emerald flex items-center justify-center text-brand-white font-bold">
          P
        </div>
        <span className="text-xl font-semibold tracking-tight">PrinsGo AI Agent</span>
      </div>

      <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (pathname?.startsWith(item.href) && item.href !== '/')
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors",
                isActive
                  ? "bg-brand-emerald/10 text-brand-emerald-dark"
                  : "text-foreground/70 hover:text-foreground hover:bg-brand-gray"
              )}
            >
              <item.icon className={cn("w-5 h-5", isActive ? "text-brand-emerald" : "text-foreground/50")} />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
