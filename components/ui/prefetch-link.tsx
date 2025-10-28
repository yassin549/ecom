"use client"

import { useEffect, useRef } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"

type PrefetchLinkProps = React.ComponentProps<typeof Link> & {
  prefetchOnHover?: boolean
  prefetchDelay?: number
}

export function PrefetchLink({
  href,
  prefetchOnHover = true,
  prefetchDelay = 200,
  children,
  ...props
}: PrefetchLinkProps) {
  const router = useRouter()
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (prefetchOnHover) {
      timeoutRef.current = setTimeout(() => {
        router.prefetch(href.toString())
      }, prefetchDelay)
    }
  }

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

  return (
    <Link
      href={href}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      {children}
    </Link>
  )
}
