import { ErrorInfo } from "react"
import { AlertTriangle, RefreshCw, Home } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useNavigate } from "react-router-dom"

interface ErrorFallbackProps {
    error: Error | null
    errorInfo: ErrorInfo | null
    onReset: () => void
}

export const ErrorFallback = ({ error, errorInfo, onReset }: ErrorFallbackProps) => {
    const navigate = useNavigate()

    const handleGoHome = () => {
        onReset()
        navigate("/")
    }

    const handleReload = () => {
        window.location.reload()
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <div className="max-w-2xl w-full">
                <div className="bg-card border border-border rounded-xl p-8 text-center">
                    {/* Icon */}
                    <div className="w-20 h-20 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-6">
                        <AlertTriangle className="w-10 h-10 text-red-500" />
                    </div>

                    {/* Heading */}
                    <h1 className="text-2xl font-bold text-foreground mb-2">Oops! Something went wrong</h1>
                    <p className="text-muted-foreground mb-8">
                        We encountered an unexpected error. Don't worry, your data is safe.
                    </p>

                    {/* Error Details (collapsible in production) */}
                    {process.env.NODE_ENV === "development" && error && (
                        <details className="mb-8 text-left">
                            <summary className="cursor-pointer text-sm font-medium text-muted-foreground hover:text-foreground mb-2">
                                Error Details (Development Only)
                            </summary>
                            <div className="bg-muted/50 rounded-lg p-4 overflow-auto">
                                <p className="font-mono text-xs text-red-500 mb-2">{error.toString()}</p>
                                {errorInfo && (
                                    <pre className="font-mono text-xs text-muted-foreground overflow-x-auto">
                                        {errorInfo.componentStack}
                                    </pre>
                                )}
                            </div>
                        </details>
                    )}

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                        <Button onClick={onReset} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Try Again
                        </Button>
                        <Button onClick={handleReload} variant="outline" className="gap-2">
                            <RefreshCw className="w-4 h-4" />
                            Reload Page
                        </Button>
                        <Button onClick={handleGoHome} className="gap-2">
                            <Home className="w-4 h-4" />
                            Go Home
                        </Button>
                    </div>

                    {/* Help Text */}
                    <p className="text-xs text-muted-foreground mt-6">
                        If this problem persists, please contact support or try clearing your browser cache.
                    </p>
                </div>
            </div>
        </div>
    )
}
