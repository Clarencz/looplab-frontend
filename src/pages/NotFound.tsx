import { useLocation } from "react-router-dom";
import { useNavigate } from "react-router-dom"
import { Home, Search, ArrowLeft, FolderOpen, BarChart3 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useState } from "react"

const popularLinks = [
  { icon: Home, label: "Dashboard", href: "/dashboard" },
  { icon: FolderOpen, label: "Projects", href: "/projects" },
  { icon: BarChart3, label: "Stats", href: "/stats" },
]

const NotFound = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/projects?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="max-w-2xl w-full text-center">
        {/* 404 Illustration */}
        <div className="mb-8 relative">
          <div className="text-9xl font-bold text-primary/20 select-none">404</div>
          <div className="w-24 h-24 bg-primary/20 rounded-2xl flex items-center justify-center p-4 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
            <img src="/logo.png" alt="Logo" className="w-full h-full object-cover opacity-50" />
          </div>
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold text-foreground mb-3">Page Not Found</h1>
        <p className="text-muted-foreground text-lg mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>

        {/* Search */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-2 max-w-md mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search for projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Button type="submit">Search</Button>
          </div>
        </form>

        {/* Popular Links */}
        <div className="mb-8">
          <p className="text-sm text-muted-foreground mb-4">Or try these popular pages:</p>
          <div className="flex flex-wrap gap-3 justify-center">
            {popularLinks.map((link) => (
              <Button
                key={link.href}
                variant="outline"
                onClick={() => navigate(link.href)}
                className="gap-2"
              >
                <link.icon className="w-4 h-4" />
                {link.label}
              </Button>
            ))}
          </div>
        </div>

        {/* Back Button */}
        <Button onClick={() => navigate(-1)} variant="ghost" className="gap-2">
          <ArrowLeft className="w-4 h-4" />
          Go Back
        </Button>
      </div>
    </div>
  )
}

export default NotFound;
