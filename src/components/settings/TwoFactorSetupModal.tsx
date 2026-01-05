"use client"

import { useState, useEffect } from "react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, Copy, Check, AlertTriangle } from "lucide-react"
import { useToast } from "@/hooks/use-toast"

interface TwoFactorSetupModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSuccess: () => void
}

interface SetupData {
    secret: string
    qrCodeSvg: string
    manualEntryKey: string
    backupCodes: string[]
}

export function TwoFactorSetupModal({ open, onOpenChange, onSuccess }: TwoFactorSetupModalProps) {
    const { toast } = useToast()
    const [step, setStep] = useState<'loading' | 'qr' | 'verify' | 'backup'>('loading')
    const [setupData, setSetupData] = useState<SetupData | null>(null)
    const [verificationCode, setVerificationCode] = useState("")
    const [loading, setLoading] = useState(false)
    const [copied, setCopied] = useState(false)

    // Fetch setup data when modal opens
    useEffect(() => {
        if (open && step === 'loading') {
            fetchSetupData()
        }
    }, [open, step])

    const fetchSetupData = async () => {
        try {
            const accessToken = localStorage.getItem('access_token')
            const response = await fetch('/api/v1/settings/2fa/setup', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Failed to setup 2FA')
            }

            const data = await response.json()
            setSetupData(data)
            setStep('qr')
        } catch (error) {
            console.error('Failed to setup 2FA:', error)
            toast({
                title: "Setup failed",
                description: "Failed to initialize 2FA setup",
                variant: "destructive",
            })
            onOpenChange(false)
        }
    }

    const handleVerify = async () => {
        if (verificationCode.length !== 6) {
            toast({
                title: "Invalid code",
                description: "Please enter a 6-digit code",
                variant: "destructive",
            })
            return
        }

        setLoading(true)
        try {
            const accessToken = localStorage.getItem('access_token')
            const response = await fetch('/api/v1/settings/2fa/verify', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${accessToken}`,
                },
                credentials: 'include',
                body: JSON.stringify({ code: verificationCode }),
            })

            if (!response.ok) {
                throw new Error('Invalid verification code')
            }

            setStep('backup')
        } catch (error) {
            console.error('Verification failed:', error)
            toast({
                title: "Verification failed",
                description: "Invalid code. Please try again.",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleCopyBackupCodes = () => {
        if (setupData) {
            navigator.clipboard.writeText(setupData.backupCodes.join('\n'))
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast({
                title: "Copied!",
                description: "Backup codes copied to clipboard",
            })
        }
    }

    const handleComplete = () => {
        toast({
            title: "2FA enabled",
            description: "Two-factor authentication has been enabled successfully",
        })
        onSuccess()
        onOpenChange(false)
        // Reset state
        setStep('loading')
        setSetupData(null)
        setVerificationCode("")
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[500px]">
                {step === 'loading' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Setting up 2FA</DialogTitle>
                            <DialogDescription>
                                Initializing two-factor authentication...
                            </DialogDescription>
                        </DialogHeader>
                        <div className="flex items-center justify-center py-8">
                            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
                        </div>
                    </>
                )}

                {step === 'qr' && setupData && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Scan QR Code</DialogTitle>
                            <DialogDescription>
                                Use an authenticator app like Google Authenticator or Authy to scan this QR code
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            {/* QR Code */}
                            <div className="flex justify-center p-4 bg-white rounded-lg">
                                <div dangerouslySetInnerHTML={{ __html: setupData.qrCodeSvg }} />
                            </div>

                            {/* Manual Entry */}
                            <div className="space-y-2">
                                <Label className="text-sm text-muted-foreground">
                                    Can't scan? Enter this code manually:
                                </Label>
                                <div className="flex items-center gap-2">
                                    <code className="flex-1 px-3 py-2 bg-muted rounded text-sm font-mono">
                                        {setupData.manualEntryKey}
                                    </code>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => {
                                            navigator.clipboard.writeText(setupData.manualEntryKey)
                                            toast({ title: "Copied!" })
                                        }}
                                    >
                                        <Copy className="h-4 w-4" />
                                    </Button>
                                </div>
                            </div>
                        </div>
                        <DialogFooter>
                            <Button onClick={() => setStep('verify')}>
                                Next: Verify Code
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === 'verify' && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Verify Setup</DialogTitle>
                            <DialogDescription>
                                Enter the 6-digit code from your authenticator app
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="verification-code">Verification Code</Label>
                                <Input
                                    id="verification-code"
                                    placeholder="000000"
                                    value={verificationCode}
                                    onChange={(e) => setVerificationCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                    maxLength={6}
                                    className="text-center text-2xl tracking-widest"
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button variant="outline" onClick={() => setStep('qr')}>
                                Back
                            </Button>
                            <Button onClick={handleVerify} disabled={loading || verificationCode.length !== 6}>
                                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Verify & Enable
                            </Button>
                        </DialogFooter>
                    </>
                )}

                {step === 'backup' && setupData && (
                    <>
                        <DialogHeader>
                            <DialogTitle>Save Backup Codes</DialogTitle>
                            <DialogDescription>
                                Store these codes in a safe place. You can use them to access your account if you lose your device.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                            <Alert>
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription>
                                    Each code can only be used once. Keep them secure!
                                </AlertDescription>
                            </Alert>

                            <div className="p-4 bg-muted rounded-lg space-y-2">
                                {setupData.backupCodes.map((code, index) => (
                                    <div key={index} className="font-mono text-sm">
                                        {index + 1}. {code}
                                    </div>
                                ))}
                            </div>

                            <Button
                                variant="outline"
                                className="w-full"
                                onClick={handleCopyBackupCodes}
                            >
                                {copied ? (
                                    <>
                                        <Check className="mr-2 h-4 w-4" />
                                        Copied!
                                    </>
                                ) : (
                                    <>
                                        <Copy className="mr-2 h-4 w-4" />
                                        Copy All Codes
                                    </>
                                )}
                            </Button>
                        </div>
                        <DialogFooter>
                            <Button onClick={handleComplete} className="w-full">
                                I've Saved My Backup Codes
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
