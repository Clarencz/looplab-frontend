import { motion, AnimatePresence } from 'framer-motion'
import { X, Crown, Sparkles, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { TierBadge } from './TierBadge'
import type { TierLevel } from '@/lib/api/types'

interface PaywallModalProps {
    isOpen: boolean
    onClose: () => void
    requiredTier: TierLevel
    pathName?: string
}

const TIER_INFO = {
    pro: {
        icon: Sparkles,
        color: 'from-blue-500 to-cyan-600',
        features: [
            'Access to Pro learning paths',
            'Advanced projects',
            'Priority support',
            'Certificate of completion',
        ],
        price: '$12/month',
    },
    premium: {
        icon: Crown,
        color: 'from-purple-500 to-pink-600',
        features: [
            'Access to all learning paths',
            'Expert-level projects',
            'Premium support',
            'Career guidance',
            'Portfolio builder',
            'CV generator',
        ],
        price: '$25/month',
    },
}

export function PaywallModal({ isOpen, onClose, requiredTier, pathName }: PaywallModalProps) {
    if (requiredTier === 'free') return null

    const tierInfo = TIER_INFO[requiredTier]
    const Icon = tierInfo.icon

    return (
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50"
                    />

                    {/* Modal */}
                    <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95, y: 20 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.95, y: 20 }}
                            transition={{ type: 'spring', duration: 0.3 }}
                            className="w-full max-w-lg"
                        >
                            <Card className="relative">
                                {/* Close Button */}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="absolute right-4 top-4 z-10"
                                    onClick={onClose}
                                >
                                    <X className="h-4 w-4" />
                                </Button>

                                <CardHeader className="text-center pb-4">
                                    <div className={`inline-flex items-center justify-center p-4 rounded-full bg-gradient-to-r ${tierInfo.color} mx-auto mb-4`}>
                                        <Icon className="h-8 w-8 text-white" />
                                    </div>
                                    <CardTitle className="text-2xl">
                                        Upgrade to {requiredTier === 'pro' ? 'Pro' : 'Premium'}
                                    </CardTitle>
                                    <CardDescription className="text-base">
                                        {pathName ? (
                                            <>
                                                <span className="font-medium">{pathName}</span> requires a{' '}
                                                <TierBadge tier={requiredTier} size="sm" className="inline-flex" /> subscription
                                            </>
                                        ) : (
                                            'Unlock premium content and accelerate your learning'
                                        )}
                                    </CardDescription>
                                </CardHeader>

                                <CardContent className="space-y-6">
                                    {/* Price */}
                                    <div className="text-center">
                                        <div className="text-3xl font-bold mb-1">{tierInfo.price}</div>
                                        <p className="text-sm text-muted-foreground">
                                            or save 17% with annual billing
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div>
                                        <h4 className="font-semibold mb-3">What's included:</h4>
                                        <ul className="space-y-2">
                                            {tierInfo.features.map((feature, index) => (
                                                <li key={index} className="flex items-start gap-2">
                                                    <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                    <span className="text-sm">{feature}</span>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </CardContent>

                                <CardFooter className="flex flex-col gap-3">
                                    <Button className="w-full" size="lg" onClick={() => window.location.href = '/pricing'}>
                                        View All Plans
                                    </Button>
                                    <Button variant="ghost" className="w-full" onClick={onClose}>
                                        Maybe Later
                                    </Button>
                                </CardFooter>
                            </Card>
                        </motion.div>
                    </div>
                </>
            )}
        </AnimatePresence>
    )
}
