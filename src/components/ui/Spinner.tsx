import * as React from "react"
import { cn } from "@/lib/utils"

export type SpinnerProps = React.HTMLAttributes<HTMLDivElement>

function Spinner({ className, ...props }: SpinnerProps) {
  return (
    <div
      className={cn("animate-spin rounded-full border-t-2 border-brand-emerald border-solid border-r-transparent", className)}
      style={{
        width: '1em',
        height: '1em',
        borderWidth: '0.15em'
      }}
      role="status"
      {...props}
    >
      <span className="sr-only">Loading...</span>
    </div>
  )
}

export { Spinner }
