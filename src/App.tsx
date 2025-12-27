import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { OnboardingProvider } from "@/contexts/OnboardingContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ErrorBoundary } from "@/components/errors/ErrorBoundary"
import { ScrollToTop } from "@/components/ScrollToTop"
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute"
import Index from "./pages/Index"
import Auth from "./pages/Auth"
import AuthCallback from "./pages/AuthCallback"
import Projects from "./pages/Projects"
import ProjectDetail from "./pages/ProjectDetail"
import Stats from "./pages/Stats"
import Workspace from "./pages/Workspace"
import Validation from "./pages/Validation"
import Dashboard from "./pages/Dashboard"
import Profile from "./pages/Profile"
import Settings from "./pages/Settings"
import PublicProfile from "./pages/PublicProfile"
import PublicProjectDetail from "./pages/PublicProjectDetail"
import Welcome from "./pages/Welcome"
import WelcomeSetup from "./pages/WelcomeSetup"
import LearningPaths from "./pages/LearningPaths"
import PathDetail from "./pages/PathDetail"
import Categories from "./pages/Categories"
import Pricing from "./pages/Pricing"
import NotFound from "./pages/NotFound"
import AdminLayout from "./components/admin/AdminLayout"
import AdminLogin from "./pages/admin/Login"
import AdminOverview from "./pages/admin/Overview"
import AdminUsers from "./pages/admin/Users"
import AdminCategories from "./pages/admin/Categories"
import AdminAnalytics from "./pages/admin/Analytics"
import AdminLearningPaths from "./pages/admin/LearningPaths"
import AdminProjects from "./pages/admin/Projects"
import ProjectEditor from "./pages/admin/ProjectEditor"
import AdminRoles from "./pages/admin/Roles"
import AdminAuditLogs from "./pages/admin/AuditLogs"
import ProjectImport from "./pages/admin/ProjectImport"
import PipelineMonitor from "./pages/admin/PipelineMonitor"

const queryClient = new QueryClient()

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <OnboardingProvider>
            <TooltipProvider>
              <Router>
                <ScrollToTop />
                <KeyboardShortcutsModal />
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/auth/callback" element={<AuthCallback />} />
                  <Route path="/welcome" element={<Welcome />} />
                  <Route path="/welcome/setup" element={<WelcomeSetup />} />
                  <Route path="/categories" element={<Categories />} />
                  <Route path="/pricing" element={<Pricing />} />
                  <Route path="/dashboard" element={<ProtectedRoute><ErrorBoundary><Dashboard /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/projects" element={<ProtectedRoute><ErrorBoundary><Projects /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/projects/:id" element={<ProtectedRoute><ErrorBoundary><ProjectDetail /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/learning-paths" element={<ProtectedRoute><ErrorBoundary><LearningPaths /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/learning-paths/:pathId" element={<ProtectedRoute><ErrorBoundary><PathDetail /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/workspace/:id" element={<ProtectedRoute><ErrorBoundary><Workspace /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/validation/:id" element={<ProtectedRoute><ErrorBoundary><Validation /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/stats" element={<ProtectedRoute><ErrorBoundary><Stats /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/profile" element={<ProtectedRoute><ErrorBoundary><Profile /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/settings" element={<ProtectedRoute><ErrorBoundary><Settings /></ErrorBoundary></ProtectedRoute>} />
                  <Route path="/u/:username" element={<ErrorBoundary><PublicProfile /></ErrorBoundary>} />
                  <Route path="/u/:username/project/:slug" element={<ErrorBoundary><PublicProjectDetail /></ErrorBoundary>} />
                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />
                  <Route path="/admin" element={<AdminProtectedRoute><AdminLayout /></AdminProtectedRoute>}>
                    <Route index element={<AdminOverview />} />
                    <Route path="users" element={<AdminUsers />} />
                    <Route path="categories" element={<AdminCategories />} />
                    <Route path="paths" element={<AdminLearningPaths />} />
                    <Route path="projects" element={<AdminProjects />} />
                    <Route path="projects/:id/edit" element={<ProjectEditor />} />
                    <Route path="projects/import" element={<ProjectImport />} />
                    <Route path="projects/:projectId/pipeline" element={<PipelineMonitor />} />
                    <Route path="analytics" element={<AdminAnalytics />} />
                    <Route path="roles" element={<AdminRoles />} />
                    <Route path="audit" element={<AdminAuditLogs />} />
                  </Route>
                  <Route path="*" element={<NotFound />} />
                </Routes>
                <Toaster />
                <Sonner />
              </Router>
            </TooltipProvider>
          </OnboardingProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
)

export default App
