import React from 'react'
import { Bell, Search, Menu } from 'lucide-react'
import { Input } from './ui/Input'
import { Button } from './ui/Button'
import { Avatar } from './ui/Avatar'

export function Header({ onMenuClick }: { onMenuClick?: () => void }) {
  return (
    <header className="flex items-center justify-between h-16 px-6 border-b border-brand-gray-dark/20 bg-brand-white">
      <div className="flex items-center gap-4 flex-1">
        <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
          <Menu className="w-5 h-5" />
        </Button>
        <div className="relative max-w-md w-full hidden sm:block">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-foreground/50" />
          <Input
            type="search"
            placeholder="Search commands, projects, or tasks..."
            className="w-full bg-brand-gray/50 pl-9 border-transparent focus-visible:ring-brand-emerald"
          />
        </div>
      </div>

      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" className="relative">
          <Bell className="w-5 h-5 text-foreground/70" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-brand-emerald border-2 border-brand-white"></span>
        </Button>
        <div className="h-8 w-px bg-brand-gray-dark/20 hidden sm:block"></div>
        <div className="flex items-center gap-2 cursor-pointer">
          <Avatar fallback="JD" />
          <div className="hidden sm:block text-sm">
            <p className="font-medium leading-none">John Doe</p>
            <p className="text-foreground/50 text-xs">Admin</p>
          </div>
        </div>
      </div>
    </header>
  )
}
