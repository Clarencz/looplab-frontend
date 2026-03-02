"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, LogOut, Code2 } from "lucide-react"
import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { WaitlistModal } from "./WaitlistModal"

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass-premium">
      <div className="w-full px-4 sm:px-6 lg:px-8 xl:px-12">
        <div className="flex h-16 items-center justify-between">
          {/* LEFT: Logo + Nav Links grouped together */}
          <div className="flex items-center gap-6">
            {/* Logo */}
            <a href="/" className="flex items-center gap-2.5 group">
              <div className="flex h-10 w-10 items-center justify-center transition-transform group-hover:scale-110 overflow-hidden">
                <img src="/logo.png" alt="MathemaLab Logo" className="h-full w-full object-contain" />
              </div>
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70">
                MathemaLab
              </span>
            </a>

            {/* Desktop Nav Links */}
            <div className="hidden items-center gap-1 md:flex">
              {user ? (
                <>
                  <a href="/download-app" className="px-4 py-2 text-sm font-medium text-primary transition-colors hover:text-primary/80 rounded-lg hover:bg-primary/5">
                    Open Editor
                  </a>
                  {/* <a href="/pricing" className="px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50">
                    Pricing
                  </a> */}
                </>
              ) : (
                <>
                  {/* <a href="/pricing" className="px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50">
                    Pricing
                  </a> */}
                  <a href="/#how-it-works" className="px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50">
                    How it Works
                  </a>
                  <a href="/#features" className="px-4 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground rounded-lg hover:bg-secondary/50">
                    Features
                  </a>
                </>
              )}
            </div>
          </div>

          {/* RIGHT: CTAs */}
          <div className="hidden items-center gap-3 md:flex">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full p-0">
                    <Avatar className="h-9 w-9 border-2 border-border">
                      <AvatarImage src={user.profile.avatarUrl} alt={user.username} />
                      <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">{user.username.charAt(0).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">{user.profile.full_name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <a href="/download-app" className="cursor-pointer">
                      Download Desktop App
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive focus:text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <div className="flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 backdrop-blur-sm">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-primary">This Easter</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
                    className="text-sm"
                  >
                    🥚→
                  </motion.span>
                </div>
                <WaitlistModal>
                  <Button size="sm">Join Waitlist</Button>
                </WaitlistModal>
                {/* <Button variant="ghost" size="sm" asChild>
                  <a href="/auth">Sign In</a>
                </Button> */}
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground p-2 rounded-lg hover:bg-secondary/50 transition-colors" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="border-t border-border bg-background/95 backdrop-blur-xl md:hidden"
          >
            <div className="container mx-auto px-4 sm:px-6 py-4 space-y-1 max-w-6xl">
              {user ? (
                // Authenticated mobile menu
                <>
                  <a href="/download-app" className="block px-4 py-3 text-sm font-medium text-primary rounded-lg hover:bg-primary/5">
                    Open Editor
                  </a>
                  {/* <a href="/pricing" className="block px-4 py-3 text-sm text-muted-foreground rounded-lg hover:bg-secondary/50">
                    Pricing
                  </a> */}
                  <div className="pt-4 mt-2 border-t border-border space-y-2">
                    <Button variant="outline" size="sm" className="w-full justify-start" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                // Non-authenticated mobile menu
                <>
                  {/* <a href="/pricing" className="block px-4 py-3 text-sm text-muted-foreground rounded-lg hover:bg-secondary/50">
                    Pricing
                  </a> */}
                  <a href="/#how-it-works" className="block px-4 py-3 text-sm text-muted-foreground rounded-lg hover:bg-secondary/50">
                    How it Works
                  </a>
                  <a href="/#features" className="block px-4 py-3 text-sm text-muted-foreground rounded-lg hover:bg-secondary/50">
                    Features
                  </a>
                  <div className="pt-4 mt-2 border-t border-border space-y-2">
                    <div className="flex flex-col items-center">
                      <span className="mb-1 text-[10px] font-bold uppercase tracking-widest text-primary animate-pulse">This Easter 🐣</span>
                      <WaitlistModal>
                        <Button size="sm" className="w-full">Join Waitlist</Button>
                      </WaitlistModal>
                    </div>
                    {/* <Button variant="ghost" size="sm" className="w-full" asChild>
                      <a href="/auth">Sign In</a>
                    </Button> */}
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}

export default Navbar