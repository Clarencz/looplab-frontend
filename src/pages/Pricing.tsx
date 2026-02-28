import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, X, Crown, Sparkles, Building2, Loader2, ChevronDown, Zap, Shield, Users, MessageSquare } from 'lucide-react'
import { listSubscriptionTiers, type SubscriptionTier } from '@/lib/api'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { CheckoutModal } from '@/components/payment/CheckoutModal'
import { Switch } from '@/components/ui/switch'
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible'
import Navbar from '@/components/Navbar'
import Footer from '@/components/Footer'

// Enterprise tier (static - not from API)
const ENTERPRISE_TIER = {
    id: 'enterprise',
    name: 'enterprise',
    displayName: 'Enterprise',
    description: 'For schools and bootcamps',
    priceMonthly: null,
    priceYearly: null,
    features: {
        list: [
            'Everything in Premium',
            'Unlimited team members',
            'Custom integrations',
            'Dedicated account manager',
            'Priority support (24/7)',
            'Custom SLA',
            'On-premise deployment option',
            'Advanced analytics & reporting'
        ]
    }
}

// Feature comparison data
const COMPARISON_FEATURES = [
    { name: 'Categories Accessible', free: '2', pro: '4', premium: 'All 6', enterprise: 'All 6' },
    { name: 'AI Hint Credits/month', free: '20', pro: '200', premium: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Learning Paths', free: '1', pro: '3', premium: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Project History', free: '10', pro: '100', premium: 'Unlimited', enterprise: 'Unlimited' },
    { name: 'Mistake Explanations', free: true, pro: true, premium: true, enterprise: true },
    { name: 'Progress Tracking', free: false, pro: true, premium: true, enterprise: true },
    { name: 'Priority Support', free: false, pro: false, premium: true, enterprise: true },
    { name: 'Instructor Dashboard', free: false, pro: false, premium: false, enterprise: true },
]

// FAQ data
const FAQS = [
    {
        question: 'Can I change plans later?',
        answer: 'Yes! You can upgrade or downgrade your plan at any time. When upgrading, you\'ll be charged the prorated difference. When downgrading, your new rate takes effect at the next billing cycle.'
    },
    {
        question: 'What payment methods do you accept?',
        answer: 'We accept all major credit cards (Visa, Mastercard, Amex) via Stripe globally. In East Africa, we also support mobile money payments including M-Pesa, MTN Mobile Money, and Airtel Money.'
    },
    {
        question: 'Is there a free trial for paid plans?',
        answer: 'The Free tier is available forever with no credit card required. For Pro and Premium plans, we offer a 14-day free trial so you can explore all features before committing.'
    },
    {
        question: 'What happens when I reach my project limit?',
        answer: 'You\'ll receive a notification when approaching your limit. You can either archive old projects or upgrade to a higher tier for more capacity.'
    },
    {
        question: 'Do you offer discounts for students or educators?',
        answer: 'Yes! We offer 50% off on Pro and Premium plans for verified students and educators. Contact us with your academic credentials to get your discount.'
    },
    {
        question: 'How does Enterprise pricing work?',
        answer: 'Enterprise pricing is customized for schools, bootcamps, and educational organizations. We offer volume discounts and instructor dashboards. Contact us for a personalized quote.'
    }
]

export default function Pricing() {
    const [tiers, setTiers] = useState<SubscriptionTier[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [isYearly, setIsYearly] = useState(false)
    const [showComparison, setShowComparison] = useState(false)
    const [openFaq, setOpenFaq] = useState<number | null>(null)
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

    const handleContactSales = () => {
        window.location.href = 'mailto:sales@mathemalab.io?subject=Enterprise%20Inquiry'
    }

    const getTierIcon = (tierName: string) => {
        switch (tierName) {
            case 'free':
                return Zap
            case 'pro':
                return Sparkles
            case 'premium':
                return Crown
            case 'enterprise':
                return Building2
            default:
                return Zap
        }
    }

    const allTiers = [...tiers, ENTERPRISE_TIER as any]

    return (
        <div className="min-h-screen flex flex-col bg-background">
            <Navbar />

            <main className="flex-1">
                {/* Hero Section */}
                <section className="relative overflow-hidden pt-24 pb-16">
                    {/* Background */}
                    <div className="absolute inset-0 bg-mesh-gradient opacity-40" />
                    <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />

                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl relative z-10">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-center mb-12"
                        >
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/50 px-4 py-1.5 mb-6">
                                <Sparkles className="w-3 h-3 text-primary" />
                                <span className="text-xs font-medium text-muted-foreground">Simple, transparent pricing</span>
                            </div>

                            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-balance">
                                Pricing that <span className="text-gradient">makes sense</span>
                            </h1>

                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-10">
                                Start for free, upgrade as you grow. No hidden fees, no surprises.
                                Choose the plan that fits your learning journey.
                            </p>

                            {/* Billing Toggle */}
                            <div className="inline-flex items-center gap-4 p-1.5 bg-secondary/50 backdrop-blur rounded-full border border-border">
                                <span className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${!isYearly ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                                    Monthly
                                </span>
                                <Switch
                                    checked={isYearly}
                                    onCheckedChange={setIsYearly}
                                />
                                <span className={`text-sm font-medium px-4 py-1.5 rounded-full transition-colors ${isYearly ? 'bg-background text-foreground shadow-sm' : 'text-muted-foreground'}`}>
                                    Yearly
                                </span>
                                <Badge variant="outline" className="mr-2 border-primary/20 text-primary">
                                    Save 17%
                                </Badge>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* Pricing Cards */}
                <section className="pb-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        {loading && (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                            </div>
                        )}

                        {error && !loading && (
                            <Alert variant="destructive" className="max-w-2xl mx-auto">
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {!loading && !error && (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ delay: 0.2 }}
                                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
                            >
                                {allTiers.map((tier, index) => {
                                    const Icon = getTierIcon(tier.name)
                                    const price = isYearly ? tier.priceYearly : tier.priceMonthly
                                    const isPremium = tier.name === 'premium'
                                    const isEnterprise = tier.name === 'enterprise'
                                    const features = tier.features as Record<string, any>

                                    return (
                                        <motion.div
                                            key={tier.id || tier.name}
                                            initial={{ opacity: 0, y: 20 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                            className={isPremium ? 'lg:-mt-4 lg:mb-4' : ''}
                                        >
                                            <Card className={`h-full relative overflow-hidden transition-all duration-300 hover:shadow-lg ${isPremium
                                                ? 'border-primary/50 shadow-lg shadow-primary/10'
                                                : 'border-border hover:border-primary/20'
                                                }`}>
                                                {isPremium && (
                                                    <div className="absolute top-0 right-0">
                                                        <div className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-bl-lg">
                                                            Most Popular
                                                        </div>
                                                    </div>
                                                )}

                                                <CardHeader className="relative">
                                                    <div className="inline-flex items-center justify-center w-10 h-10 rounded-xl bg-primary/10 mb-4">
                                                        <Icon className="h-5 w-5 text-primary" />
                                                    </div>
                                                    <CardTitle>{tier.displayName}</CardTitle>
                                                    <CardDescription>
                                                        {tier.name === 'free' && 'Perfect for getting started'}
                                                        {tier.name === 'pro' && 'For serious learners'}
                                                        {tier.name === 'premium' && 'For career advancement'}
                                                        {tier.name === 'enterprise' && 'For schools and bootcamps'}
                                                    </CardDescription>
                                                </CardHeader>

                                                <CardContent className="relative">
                                                    <div className="mb-6">
                                                        {isEnterprise ? (
                                                            <div className="text-2xl font-bold">Custom</div>
                                                        ) : (
                                                            <>
                                                                <div className="flex items-baseline gap-1">
                                                                    <span className="text-3xl font-bold">${price}</span>
                                                                    <span className="text-muted-foreground text-sm">
                                                                        /{isYearly ? 'year' : 'month'}
                                                                    </span>
                                                                </div>
                                                                {isYearly && tier.name !== 'free' && price && (
                                                                    <p className="text-sm text-muted-foreground mt-1">
                                                                        ${(parseFloat(price) / 12).toFixed(0)}/month billed annually
                                                                    </p>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>

                                                    <ul className="space-y-3">
                                                        {features.list?.slice(0, 6).map((feature: string, i: number) => (
                                                            <li key={i} className="flex items-start gap-3">
                                                                <div className="mt-0.5 flex-shrink-0 w-4 h-4 rounded-full bg-primary/10 flex items-center justify-center">
                                                                    <Check className="h-2.5 w-2.5 text-primary" />
                                                                </div>
                                                                <span className="text-sm text-muted-foreground">{feature}</span>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </CardContent>

                                                <CardFooter className="relative pt-4">
                                                    {isEnterprise ? (
                                                        <Button
                                                            className="w-full"
                                                            variant="outline"
                                                            onClick={handleContactSales}
                                                        >
                                                            <MessageSquare className="w-4 h-4 mr-2" />
                                                            Contact Sales
                                                        </Button>
                                                    ) : (
                                                        <Button
                                                            className="w-full"
                                                            variant={isPremium ? 'default' : tier.name === 'free' ? 'secondary' : 'outline'}
                                                            onClick={() => tier.name === 'free' ? window.location.href = '/auth' : handleUpgrade(tier)}
                                                        >
                                                            {tier.name === 'free' ? 'Get Started Free' : 'Upgrade Now'}
                                                        </Button>
                                                    )}
                                                </CardFooter>
                                            </Card>
                                        </motion.div>
                                    )
                                })}
                            </motion.div>
                        )}
                    </div>
                </section>

                {/* Feature Comparison */}
                <section className="py-20 bg-secondary/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl">
                        <Collapsible open={showComparison} onOpenChange={setShowComparison}>
                            <div className="text-center mb-8">
                                <h2 className="text-3xl font-bold mb-4">Compare Plans</h2>
                                <p className="text-muted-foreground mb-6">
                                    See what's included in each plan
                                </p>
                                <CollapsibleTrigger asChild>
                                    <Button variant="outline">
                                        {showComparison ? 'Hide' : 'Show'} Comparison
                                        <ChevronDown className={`ml-2 h-4 w-4 transition-transform ${showComparison ? 'rotate-180' : ''}`} />
                                    </Button>
                                </CollapsibleTrigger>
                            </div>

                            <CollapsibleContent>
                                <motion.div
                                    initial={{ opacity: 0, y: -20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="overflow-x-auto"
                                >
                                    <table className="w-full border-collapse bg-card rounded-xl overflow-hidden border border-border">
                                        <thead>
                                            <tr className="border-b border-border">
                                                <th className="text-left p-4 font-semibold">Features</th>
                                                <th className="text-center p-4 font-semibold text-sm">Free</th>
                                                <th className="text-center p-4 font-semibold text-sm">Pro</th>
                                                <th className="text-center p-4 font-semibold text-sm bg-primary/5">Premium</th>
                                                <th className="text-center p-4 font-semibold text-sm">Enterprise</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {COMPARISON_FEATURES.map((feature, i) => (
                                                <tr key={i} className="border-b border-border last:border-0 hover:bg-secondary/30 transition-colors">
                                                    <td className="p-4 font-medium text-sm">{feature.name}</td>
                                                    <td className="text-center p-4">
                                                        {typeof feature.free === 'boolean' ? (
                                                            feature.free ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                                                        ) : <span className="text-sm">{feature.free}</span>}
                                                    </td>
                                                    <td className="text-center p-4">
                                                        {typeof feature.pro === 'boolean' ? (
                                                            feature.pro ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                                                        ) : <span className="text-sm">{feature.pro}</span>}
                                                    </td>
                                                    <td className="text-center p-4 bg-primary/5">
                                                        {typeof feature.premium === 'boolean' ? (
                                                            feature.premium ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                                                        ) : <span className="text-sm font-medium text-primary">{feature.premium}</span>}
                                                    </td>
                                                    <td className="text-center p-4">
                                                        {typeof feature.enterprise === 'boolean' ? (
                                                            feature.enterprise ? <Check className="h-4 w-4 text-primary mx-auto" /> : <X className="h-4 w-4 text-muted-foreground/30 mx-auto" />
                                                        ) : <span className="text-sm">{feature.enterprise}</span>}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </motion.div>
                            </CollapsibleContent>
                        </Collapsible>
                    </div>
                </section>

                {/* FAQ Section */}
                <section className="py-20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
                        <div className="text-center mb-12">
                            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                            <p className="text-muted-foreground">
                                Have more questions? <a href="mailto:support@mathemalab.io" className="text-primary hover:underline">Contact us</a>
                            </p>
                        </div>

                        <div className="space-y-3">
                            {FAQS.map((faq, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.05 }}
                                >
                                    <Collapsible
                                        open={openFaq === index}
                                        onOpenChange={() => setOpenFaq(openFaq === index ? null : index)}
                                    >
                                        <CollapsibleTrigger asChild>
                                            <button className="w-full flex items-center justify-between p-4 bg-secondary/30 hover:bg-secondary/50 rounded-xl border border-border transition-colors text-left">
                                                <span className="font-medium text-sm">{faq.question}</span>
                                                <ChevronDown className={`h-4 w-4 text-muted-foreground transition-transform ${openFaq === index ? 'rotate-180' : ''}`} />
                                            </button>
                                        </CollapsibleTrigger>
                                        <CollapsibleContent>
                                            <div className="px-4 pb-4 pt-2 text-sm text-muted-foreground">
                                                {faq.answer}
                                            </div>
                                        </CollapsibleContent>
                                    </Collapsible>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Trust Section */}
                <section className="py-20 bg-secondary/20">
                    <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-5xl text-center">
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
                            <div className="flex flex-col items-center">
                                <Users className="h-6 w-6 text-primary mb-2" />
                                <div className="text-2xl font-bold">10K+</div>
                                <div className="text-xs text-muted-foreground">Active Learners</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Zap className="h-6 w-6 text-primary mb-2" />
                                <div className="text-2xl font-bold">500K+</div>
                                <div className="text-xs text-muted-foreground">Code Executions</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Shield className="h-6 w-6 text-primary mb-2" />
                                <div className="text-2xl font-bold">99.9%</div>
                                <div className="text-xs text-muted-foreground">Uptime</div>
                            </div>
                            <div className="flex flex-col items-center">
                                <Crown className="h-6 w-6 text-primary mb-2" />
                                <div className="text-2xl font-bold">4.9/5</div>
                                <div className="text-xs text-muted-foreground">User Rating</div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            {/* Checkout Modal */}
            {checkoutModal.tier && (
                <CheckoutModal
                    isOpen={checkoutModal.isOpen}
                    onClose={() => setCheckoutModal({ isOpen: false, tier: null })}
                    onSuccess={() => loadTiers()}
                    tierId={checkoutModal.tier.id}
                    tierName={checkoutModal.tier.displayName}
                    tierPrice={parseFloat(
                        isYearly
                            ? checkoutModal.tier.priceYearly
                            : checkoutModal.tier.priceMonthly
                    )}
                    billingPeriod={isYearly ? 'yearly' : 'monthly'}
                />
            )}
        </div>
    )
}