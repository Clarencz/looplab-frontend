"use client"

import { Button } from "@/components/ui/button"
import { Github, Menu, X, LogOut, User } from "lucide-react"
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

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  const handleSignOut = async () => {
    await signOut()
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
      <div className="container mx-auto px-6">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <a href="/" className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary">
              <span className="font-mono text-sm font-bold text-primary-foreground">L</span>
            </div>
            <span className="font-mono text-lg font-bold text-foreground">LoopLab</span>
          </a>

          {/* Desktop Nav */}
          <div className="hidden items-center gap-8 md:flex">
            {user ? (
              // Authenticated navigation
              <>
                <a href="/dashboard" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Dashboard
                </a>
                <a href="/projects" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Projects
                </a>
                <a href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Categories
                </a>
                <a href="/learning-paths" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Learning Paths
                </a>
                <a href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </a>
                <a href="/stats" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Stats
                </a>
              </>
            ) : (
              // Non-authenticated navigation
              <>
                <a href="/categories" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Categories
                </a>
                <a href="/pricing" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Pricing
                </a>
                <a href="/#how-it-works" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  How it Works
                </a>
                <a href="/#features" className="text-sm text-muted-foreground transition-colors hover:text-foreground">
                  Features
                </a>
              </>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-4 md:flex">
            {user ? (
              // Authenticated actions
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={user.profile.avatar_url} alt={user.username} />
                      <AvatarFallback>{user.username.charAt(0).toUpperCase()}</AvatarFallback>
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
                    <a href="/profile" className="cursor-pointer">
                      <User className="mr-2 h-4 w-4" />
                      Profile
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <a href="/settings" className="cursor-pointer">
                      Settings
                    </a>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="cursor-pointer text-destructive">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              // Non-authenticated actions
              <>
                <Button variant="ghost" size="sm" asChild>
                  <a href="https://github.com/yourusername/looplab" target="_blank" rel="noopener noreferrer">
                    <Github className="mr-2 h-4 w-4" />
                    GitHub
                  </a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href="/auth">Sign In</a>
                </Button>
                <Button size="sm" asChild>
                  <a href="/auth">Get Started</a>
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button className="md:hidden text-foreground" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
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
            className="border-t border-border bg-background md:hidden"
          >
            <div className="container mx-auto px-6 py-4 space-y-4">
              {user ? (
                // Authenticated mobile menu
                <>
                  <a href="/dashboard" className="block text-sm text-muted-foreground">
                    Dashboard
                  </a>
                  <a href="/projects" className="block text-sm text-muted-foreground">
                    Projects
                  </a>
                  <a href="/categories" className="block text-sm text-muted-foreground">
                    Categories
                  </a>
                  <a href="/learning-paths" className="block text-sm text-muted-foreground">
                    Learning Paths
                  </a>
                  <a href="/pricing" className="block text-sm text-muted-foreground">
                    Pricing
                  </a>
                  <a href="/stats" className="block text-sm text-muted-foreground">
                    Stats
                  </a>
                  <a href="/profile" className="block text-sm text-muted-foreground">
                    Profile
                  </a>
                  <a href="/settings" className="block text-sm text-muted-foreground">
                    Settings
                  </a>
                  <div className="pt-4 border-t border-border">
                    <Button variant="outline" size="sm" className="w-full" onClick={handleSignOut}>
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </Button>
                  </div>
                </>
              ) : (
                // Non-authenticated mobile menu
                <>
                  <a href="/categories" className="block text-sm text-muted-foreground">
                    Categories
                  </a>
                  <a href="/pricing" className="block text-sm text-muted-foreground">
                    Pricing
                  </a>
                  <a href="/#how-it-works" className="block text-sm text-muted-foreground">
                    How it Works
                  </a>
                  <a href="/#features" className="block text-sm text-muted-foreground">
                    Features
                  </a>
                  <div className="pt-4 border-t border-border space-y-2">
                    <Button variant="outline" size="sm" className="w-full bg-transparent" asChild>
                      <a href="/auth">Sign In</a>
                    </Button>
                    <Button size="sm" className="w-full" asChild>
                      <a href="/auth">Get Started</a>
                    </Button>
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
