import { Toaster } from "@/components/ui/toaster"
import { Toaster as Sonner } from "@/components/ui/sonner"
import { TooltipProvider } from "@/components/ui/tooltip"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { AuthProvider } from "@/contexts/AuthContext"
import { ThemeProvider } from "@/contexts/ThemeContext"
import { ErrorBoundary } from "@/components/errors/ErrorBoundary"
import { ScrollToTop } from "@/components/ScrollToTop"
import { KeyboardShortcutsModal } from "@/components/KeyboardShortcutsModal"
import { ProtectedRoute } from "@/components/ProtectedRoute"
import { AdminProtectedRoute } from "@/components/AdminProtectedRoute"
import DownloadApp from "@/pages/DownloadApp";
import Index from "./pages/Index";
import Auth from "./pages/Auth"
import AuthCallback from "./pages/AuthCallback"
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
import AdminPricing from "./pages/admin/Pricing"
import ProjectEditor from "./pages/admin/ProjectEditor"
import AdminRoles from "./pages/admin/Roles"
import AdminAuditLogs from "./pages/admin/AuditLogs"
import ProjectImport from "./pages/admin/ProjectImport"
import PipelineMonitor from "./pages/admin/PipelineMonitor"
import React from 'react'

const queryClient = new QueryClient()

const App = () => (
  <ErrorBoundary>
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <Router>
              <ScrollToTop />
              <KeyboardShortcutsModal />
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/auth" element={<Auth />} />
                <Route path="/auth/callback" element={<AuthCallback />} />
                <Route path="/pricing" element={<Pricing />} />

                {/* Redirect all platform routes to Download App */}
                <Route path="/dashboard" element={<Navigate to="/download-app" replace />} />
                <Route path="/projects" element={<Navigate to="/download-app" replace />} />
                <Route path="/projects/:id" element={<Navigate to="/download-app" replace />} />
                <Route path="/learning-paths" element={<Navigate to="/download-app" replace />} />
                <Route path="/learning-paths/:pathId" element={<Navigate to="/download-app" replace />} />
                <Route path="/stats" element={<Navigate to="/download-app" replace />} />
                <Route path="/profile" element={<Navigate to="/download-app" replace />} />
                <Route path="/settings" element={<Navigate to="/download-app" replace />} />
                <Route path="/categories" element={<Navigate to="/download-app" replace />} />
                <Route path="/welcome" element={<Navigate to="/download-app" replace />} />
                <Route path="/welcome/setup" element={<Navigate to="/download-app" replace />} />
                <Route path="/workspace/:id" element={<Navigate to="/download-app" replace />} />
                <Route path="/validation/:id" element={<Navigate to="/download-app" replace />} />
                <Route path="/algorithms" element={<Navigate to="/download-app" replace />} />
                <Route path="/algorithms/:slug" element={<Navigate to="/download-app" replace />} />
                <Route path="/u/:username" element={<Navigate to="/download-app" replace />} />
                <Route path="/u/:username/project/:slug" element={<Navigate to="/download-app" replace />} />

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
                  <Route path="pricing" element={<AdminPricing />} />
                  <Route path="roles" element={<AdminRoles />} />
                  <Route path="audit" element={<AdminAuditLogs />} />
                </Route>

                {/* Download App page */}
                <Route path="/download-app" element={<DownloadApp />} />

                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </Router>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </ThemeProvider>
  </ErrorBoundary>
)

export default App
