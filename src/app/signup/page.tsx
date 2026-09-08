"use client"

import React, { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/Card'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Bot, Mail, Lock, User, Building } from 'lucide-react'

export default function SignupPage() {
  const [loading, setLoading] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // Simulate signup
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <div className="flex min-h-full items-center justify-center p-4 py-12">
      <Card className="w-full max-w-md border-brand-gray-dark/20 shadow-lg">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="flex justify-center mb-2">
            <div className="w-12 h-12 rounded-lg bg-brand-emerald flex items-center justify-center">
              <Bot className="w-6 h-6 text-brand-white" />
            </div>
          </div>
          <CardTitle className="text-2xl font-bold tracking-tight">Create an account</CardTitle>
          <CardDescription>
            Get started with your intelligent digital workforce
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="firstName">
                  First name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                  <Input id="firstName" placeholder="John" className="pl-9" required />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium leading-none" htmlFor="lastName">
                  Last name
                </label>
                <Input id="lastName" placeholder="Doe" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="workspace">
                Workspace / Organization
              </label>
              <div className="relative">
                <Building className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                <Input id="workspace" placeholder="Company Name" className="pl-9" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="email">
                Email
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                <Input id="email" type="email" placeholder="name@example.com" className="pl-9" required />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium leading-none" htmlFor="password">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-foreground/50" />
                <Input id="password" type="password" className="pl-9" required />
              </div>
            </div>

            <Button className="w-full" variant="emerald" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create account"}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col gap-4 border-t border-brand-gray/50 p-6">
          <div className="text-sm text-foreground/70 text-center">
            By clicking create account, you agree to our{" "}
            <Link href="#" className="underline hover:text-foreground">Terms of Service</Link>{" "}
            and{" "}
            <Link href="#" className="underline hover:text-foreground">Privacy Policy</Link>.
          </div>
          <div className="text-sm text-foreground/70 text-center">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-brand-emerald hover:text-brand-emerald-dark">
              Sign in
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
