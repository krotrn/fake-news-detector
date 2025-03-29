"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { Menu } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur-sm supports-backdrop-filter:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center">
            <span className="text-xl font-bold">
              Fact<span className="text-primary">Check</span>
            </span>
          </Link>
        </div>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/verify" className="text-sm font-medium transition-colors hover:text-primary">
            Verify News
          </Link>
          <Link href="/trending" className="text-sm font-medium transition-colors hover:text-primary">
            Trending Misinformation
          </Link>
          <Link href="/archive" className="text-sm font-medium transition-colors hover:text-primary">
            Fact-Checked Archive
          </Link>
          <ModeToggle />
        </nav>
        <div className="flex md:hidden items-center gap-2">
          <ModeToggle />
          <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <Menu className="h-5 w-5" />
          </Button>
        </div>
      </div>
      <div className={cn("container md:hidden", isMenuOpen ? "block" : "hidden")}>
        <nav className="flex flex-col gap-2 pb-4">
          <Link
            href="/verify"
            className="text-sm font-medium transition-colors hover:text-primary p-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Verify News
          </Link>
          <Link
            href="/trending"
            className="text-sm font-medium transition-colors hover:text-primary p-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Trending Misinformation
          </Link>
          <Link
            href="/archive"
            className="text-sm font-medium transition-colors hover:text-primary p-2"
            onClick={() => setIsMenuOpen(false)}
          >
            Fact-Checked Archive
          </Link>
        </nav>
      </div>
    </header>
  )
}

