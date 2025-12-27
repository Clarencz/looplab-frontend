import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Check, Crown, Sparkles, Loader2 } from 'lucide-react'
import { listSubscriptionTiers, type SubscriptionTier } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckoutModal } from '@/components/payment/CheckoutModal'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

export default function Pricing() {
    const [tiers, setTiers] = useState<SubscriptionTier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [billingPeriod, setBillingPeriod] = useState<'monthly' | 'yearly'>('monthly')
    const [checkoutModal, setCheckoutModal] = useState<{
        isOpen: boolean;
        tier: SubscriptionTier | null;
    }>({ isOpen: false, tier: null })

    useEffect(() => {
        loadTiers()
    }, [])

    const loadTiers = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await listSubscriptionTiers()
            setTiers(data)
        } catch (error) {
            console.error('Failed to load subscription tiers:', error)
            setError('Unable to load pricing information. Please try again later.')
        } finally {
            setLoading(false)
        }
    }

    const handleUpgrade = (tier: SubscriptionTier) => {
        setCheckoutModal({ isOpen: true, tier })
    }

    const handleCheckoutSuccess = () => {
        // Reload tiers or redirect to success page
        loadTiers()
    }

    const getTierIcon = (tierName: string) => {
        switch (tierName) {
            case 'pro':
                return Sparkles
            case 'premium':
                return Crown
            default:
                return null
        }
    }

    const getTierColor = (tierName: string) => {
        switch (tierName) {
            case 'free':
                return 'from-green-500 to-emerald-600'
            case 'pro':
                return 'from-blue-500 to-cyan-600'
            case 'premium':
                return 'from-purple-500 to-pink-600'
            default:
                return 'from-gray-500 to-gray-600'
        }
    }

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1 container mx-auto px-4 py-16 max-w-7xl">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-12"
                >
                    <h1 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                        Choose Your Plan
                    </h1>
                    <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
                        Start for free, upgrade as you grow. All plans include access to our project-based learning platform.
                    </p>

                    {/* Billing Toggle */}
                    <div className="inline-flex items-center gap-3 p-1 bg-muted rounded-lg">
                        <Button
                            variant={billingPeriod === 'monthly' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setBillingPeriod('monthly')}
                        >
                            Monthly
                        </Button>
                        <Button
                            variant={billingPeriod === 'yearly' ? 'default' : 'ghost'}
                            size="sm"
                            onClick={() => setBillingPeriod('yearly')}
                        >
                            Yearly
                            <Badge variant="secondary" className="ml-2">Save 17%</Badge>
                        </Button>
                    </div>
                </motion.div>

                {/* Loading State */}
                {loading && (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    </div>
                )}

                {/* Error State */}
                {error && !loading && (
                    <Alert variant="destructive" className="max-w-2xl mx-auto">
                        <AlertDescription>{error}</AlertDescription>
                    </Alert>
                )}

                {/* Pricing Cards */}
                {!loading && !error && tiers.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16"
                    >
                        {tiers.map((tier, index) => {
                            const Icon = getTierIcon(tier.name)
                            const price = billingPeriod === 'monthly' ? tier.priceMonthly : tier.priceYearly
                            const isPremium = tier.name === 'premium'
                            const features = tier.features as Record<string, any>

                            return (
                                <motion.div
                                    key={tier.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    className={isPremium ? 'md:scale-105' : ''}
                                >
                                    <Card className={`h-full relative ${isPremium ? 'border-primary shadow-lg' : ''}`}>
                                        {isPremium && (
                                            <div className="absolute -top-4 left-1/2 -translate-x-1/2">
                                                <Badge className="bg-gradient-to-r from-purple-500 to-pink-600">
                                                    Most Popular
                                                </Badge>
                                            </div>
                                        )}

                                        <CardHeader>
                                            <div className="flex items-center gap-2 mb-2">
                                                {Icon && (
                                                    <div className={`p-2 rounded-lg bg-gradient-to-r ${getTierColor(tier.name)}`}>
                                                        <Icon className="h-5 w-5 text-white" />
                                                    </div>
                                                )}
                                                <CardTitle className="text-2xl">{tier.displayName}</CardTitle>
                                            </div>
                                            <CardDescription className="text-base">
                                                {tier.name === 'free' && 'Perfect for getting started'}
                                                {tier.name === 'pro' && 'For serious learners'}
                                                {tier.name === 'premium' && 'For career advancement'}
                                            </CardDescription>
                                        </CardHeader>

                                        <CardContent>
                                            <div className="mb-6">
                                                <div className="flex items-baseline gap-2">
                                                    <span className="text-4xl font-bold">${price}</span>
                                                    <span className="text-muted-foreground">
                                                        /{billingPeriod === 'monthly' ? 'mo' : 'yr'}
                                                    </span>
                                                </div>
                                                {billingPeriod === 'yearly' && tier.name !== 'free' && (
                                                    <p className="text-sm text-muted-foreground mt-1">
                                                        ${(parseFloat(price) / 12).toFixed(2)}/month billed annually
                                                    </p>
                                                )}
                                            </div>

                                            <ul className="space-y-3">
                                                {features.list?.map((feature: string, i: number) => (
                                                    <li key={i} className="flex items-start gap-2">
                                                        <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                                                        <span className="text-sm">{feature}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </CardContent>

                                        <CardFooter>
                                            <Button
                                                className="w-full"
                                                variant={isPremium ? 'default' : 'outline'}
                                                disabled={tier.name === 'free'}
                                                onClick={() => handleUpgrade(tier)}
                                            >
                                                {tier.name === 'free' ? 'Current Plan' : 'Upgrade Now'}
                                            </Button>
                                        </CardFooter>
                                    </Card>
                                </motion.div>
                            )
                        })}
                    </motion.div>
                )}

                {/* FAQ Section */}
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="max-w-3xl mx-auto"
                >
                    <h2 className="text-3xl font-bold text-center mb-8">Frequently Asked Questions</h2>
                    <div className="space-y-6">
                        <div>
                            <h3 className="font-semibold mb-2">Can I change plans later?</h3>
                            <p className="text-muted-foreground">
                                Yes! You can upgrade or downgrade your plan at any time. Changes take effect immediately.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">What payment methods do you accept?</h3>
                            <p className="text-muted-foreground">
                                We accept credit cards globally via Stripe, and mobile money (M-Pesa, MTN, Airtel) in East Africa via Daraja.
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Is there a free trial?</h3>
                            <p className="text-muted-foreground">
                                The Free tier is available forever with no credit card required. Upgrade when you're ready!
                            </p>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Which countries support mobile money?</h3>
                            <p className="text-muted-foreground">
                                Mobile money is available in Kenya, Tanzania, Uganda, Rwanda, Burundi, South Sudan, and DRC.
                            </p>
                        </div>
                    </div>
                </motion.div>
            </main>

            <Footer />

            {/* Checkout Modal */}
            {checkoutModal.tier && (
                <CheckoutModal
                    isOpen={checkoutModal.isOpen}
                    onClose={() => setCheckoutModal({ isOpen: false, tier: null })}
                    onSuccess={handleCheckoutSuccess}
                    tierId={checkoutModal.tier.id}
                    tierName={checkoutModal.tier.displayName}
                    tierPrice={parseFloat(
                        billingPeriod === 'monthly'
                            ? checkoutModal.tier.priceMonthly
                            : checkoutModal.tier.priceYearly
                    )}
                    billingPeriod={billingPeriod}
                />
            )}
        </div>
    )
}
