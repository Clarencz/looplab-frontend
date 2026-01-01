import { useState } from "react"
import { tutorApi } from "@/lib/api/tutor"
import { TutorSession, StartTutorRequest } from "@/lib/api/types"
import { toast } from "sonner"

export function useTutorSession(categorySlug: string) {
    const [session, setSession] = useState<TutorSession | null>(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const startSession = async (request: StartTutorRequest) => {
        setIsLoading(true)
        setError(null)
        try {
            const newSession = await tutorApi.startSession(categorySlug, request)
            setSession(newSession)
            toast.success("AI Tutor session started!")
            return newSession
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to start tutor session"
            setError(message)
            toast.error(message)
            throw err
        } finally {
            setIsLoading(false)
        }
    }

    const nextStep = async () => {
        if (!session) return
        setIsLoading(true)
        try {
            const updatedSession = await tutorApi.nextStep(categorySlug, session.sessionId)
            setSession(updatedSession)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to navigate"
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const previousStep = async () => {
        if (!session) return
        setIsLoading(true)
        try {
            const updatedSession = await tutorApi.previousStep(categorySlug, session.sessionId)
            setSession(updatedSession)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to navigate"
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const completeSession = async () => {
        if (!session) return
        setIsLoading(true)
        try {
            await tutorApi.completeSession(categorySlug, session.sessionId)
            toast.success("Tutorial completed! Great job! 🎉")
            setSession(null)
        } catch (err) {
            const message = err instanceof Error ? err.message : "Failed to complete session"
            setError(message)
            toast.error(message)
        } finally {
            setIsLoading(false)
        }
    }

    const closeSession = () => {
        setSession(null)
        setError(null)
    }

    return {
        session,
        isLoading,
        error,
        startSession,
        nextStep,
        previousStep,
        completeSession,
        closeSession,
    }
}
