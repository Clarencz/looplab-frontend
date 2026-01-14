import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { motion } from 'framer-motion';
import { Building2, Users, Mail, Phone, MessageSquare, CheckCircle, ArrowRight, Sparkles, Shield, BarChart3 } from 'lucide-react';
import { validateCorporateEmail } from '../../lib/utils/emailValidator';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

// Company size options
const COMPANY_SIZES = [
    { value: '1-10', label: '1-10 employees' },
    { value: '11-50', label: '11-50 employees' },
    { value: '51-200', label: '51-200 employees' },
    { value: '201-500', label: '201-500 employees' },
    { value: '501-1000', label: '501-1000 employees' },
    { value: '1000+', label: '1000+ employees' },
];

// Industry options
const INDUSTRIES = [
    { value: 'technology', label: 'Technology' },
    { value: 'finance', label: 'Finance & Banking' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'retail', label: 'Retail & E-commerce' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'consulting', label: 'Consulting' },
    { value: 'education', label: 'Education' },
    { value: 'government', label: 'Government' },
    { value: 'nonprofit', label: 'Non-profit' },
    { value: 'other', label: 'Other' },
];

interface FormData {
    companyName: string;
    companySize: string;
    industry: string;
    contactName: string;
    contactEmail: string;
    contactPhone: string;
    useCase: string;
}

const initialFormData: FormData = {
    companyName: '',
    companySize: '',
    industry: '',
    contactName: '',
    contactEmail: '',
    contactPhone: '',
    useCase: '',
};

export default function RequestDemo() {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [emailError, setEmailError] = useState<string>('');
    const [isSuccess, setIsSuccess] = useState(false);

    // Submit mutation
    const submitMutation = useMutation({
        mutationFn: async (data: FormData) => {
            const response = await fetch('/api/v1/enterprise/demo-requests', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    companyName: data.companyName,
                    companySize: data.companySize,
                    industry: data.industry || null,
                    contactName: data.contactName,
                    contactEmail: data.contactEmail,
                    contactPhone: data.contactPhone || null,
                    useCase: data.useCase,
                }),
            });
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'Failed to submit request');
            }
            return response.json();
        },
        onSuccess: () => {
            setIsSuccess(true);
        },
    });

    const handleEmailChange = (email: string) => {
        setFormData({ ...formData, contactEmail: email });

        if (email) {
            const validation = validateCorporateEmail(email);
            setEmailError(validation.isValid ? '' : (validation.error || ''));
        } else {
            setEmailError('');
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validate email
        const emailValidation = validateCorporateEmail(formData.contactEmail);
        if (!emailValidation.isValid) {
            setEmailError(emailValidation.error || 'Invalid email');
            return;
        }

        // Validate required fields
        if (!formData.companyName || !formData.companySize || !formData.contactName || !formData.useCase) {
            return;
        }

        submitMutation.mutate(formData);
    };

    // Success screen
    if (isSuccess) {
        return (
            <div className="min-h-screen bg-background">
                <Navbar />
                <main className="pt-24 pb-16">
                    <div className="container mx-auto px-6">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="max-w-2xl mx-auto text-center"
                        >
                            <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                                <CheckCircle className="h-10 w-10 text-primary" />
                            </div>
                            <h1 className="text-3xl font-bold mb-4">Thank You for Your Interest!</h1>
                            <p className="text-lg text-muted-foreground mb-8">
                                We've received your demo request. Our sales team will contact you within 24 hours
                                to discuss how LoopLab Enterprise can transform your technical hiring process.
                            </p>
                            <div className="bg-muted/50 rounded-lg p-6 text-left">
                                <h3 className="font-semibold mb-3">What happens next?</h3>
                                <ul className="space-y-2 text-sm text-muted-foreground">
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-mono">1.</span>
                                        Our team reviews your requirements
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-mono">2.</span>
                                        We schedule a personalized demo call
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <span className="text-primary font-mono">3.</span>
                                        Get access to a free trial tailored to your needs
                                    </li>
                                </ul>
                            </div>
                            <Button className="mt-8" onClick={() => window.location.href = '/'}>
                                Back to Home
                            </Button>
                        </motion.div>
                    </div>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background">
            <Navbar />

            <main className="pt-24 pb-16">
                <div className="container mx-auto px-6">
                    {/* Hero Section */}
                    <div className="text-center mb-12">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.5 }}
                        >
                            <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 rounded-full text-primary text-sm font-medium mb-6">
                                <Building2 className="h-4 w-4" />
                                Enterprise Solutions
                            </div>
                            <h1 className="text-4xl md:text-5xl font-bold mb-4">
                                Transform Your{' '}
                                <span className="bg-gradient-to-r from-primary to-purple-500 bg-clip-text text-transparent">
                                    Technical Hiring
                                </span>
                            </h1>
                            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                                Evaluate candidates with real-world coding challenges. AI-powered assessments,
                                anti-cheating measures, and comprehensive reporting built for enterprise teams.
                            </p>
                        </motion.div>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
                        {/* Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.2 }}
                        >
                            <div className="bg-card border border-border rounded-xl p-8 shadow-lg">
                                <h2 className="text-2xl font-bold mb-2">Request a Demo</h2>
                                <p className="text-muted-foreground mb-6">
                                    Fill out the form and our team will reach out within 24 hours.
                                </p>

                                <form onSubmit={handleSubmit} className="space-y-5">
                                    {/* Company Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="companyName">Company Name *</Label>
                                        <div className="relative">
                                            <Building2 className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="companyName"
                                                value={formData.companyName}
                                                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })}
                                                className="pl-10"
                                                placeholder="Acme Inc."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Company Size & Industry */}
                                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-2">
                                            <Label htmlFor="companySize">Company Size *</Label>
                                            <Select
                                                value={formData.companySize}
                                                onValueChange={(value) => setFormData({ ...formData, companySize: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select size" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {COMPANY_SIZES.map((size) => (
                                                        <SelectItem key={size.value} value={size.value}>
                                                            {size.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="industry">Industry</Label>
                                            <Select
                                                value={formData.industry}
                                                onValueChange={(value) => setFormData({ ...formData, industry: value })}
                                            >
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select industry" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    {INDUSTRIES.map((industry) => (
                                                        <SelectItem key={industry.value} value={industry.value}>
                                                            {industry.label}
                                                        </SelectItem>
                                                    ))}
                                                </SelectContent>
                                            </Select>
                                        </div>
                                    </div>

                                    {/* Contact Name */}
                                    <div className="space-y-2">
                                        <Label htmlFor="contactName">Your Name *</Label>
                                        <div className="relative">
                                            <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="contactName"
                                                value={formData.contactName}
                                                onChange={(e) => setFormData({ ...formData, contactName: e.target.value })}
                                                className="pl-10"
                                                placeholder="John Doe"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Work Email */}
                                    <div className="space-y-2">
                                        <Label htmlFor="contactEmail">Work Email *</Label>
                                        <div className="relative">
                                            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="contactEmail"
                                                type="email"
                                                value={formData.contactEmail}
                                                onChange={(e) => handleEmailChange(e.target.value)}
                                                className={`pl-10 ${emailError ? 'border-destructive focus-visible:ring-destructive' : ''}`}
                                                placeholder="you@yourcompany.com"
                                                required
                                            />
                                        </div>
                                        {emailError && (
                                            <p className="text-sm text-destructive">{emailError}</p>
                                        )}
                                        <p className="text-xs text-muted-foreground">
                                            Please use your corporate email address
                                        </p>
                                    </div>

                                    {/* Phone (Optional) */}
                                    <div className="space-y-2">
                                        <Label htmlFor="contactPhone">Phone Number (Optional)</Label>
                                        <div className="relative">
                                            <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                            <Input
                                                id="contactPhone"
                                                type="tel"
                                                value={formData.contactPhone}
                                                onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                                                className="pl-10"
                                                placeholder="+1 (555) 000-0000"
                                            />
                                        </div>
                                    </div>

                                    {/* Use Case */}
                                    <div className="space-y-2">
                                        <Label htmlFor="useCase">How do you plan to use LoopLab? *</Label>
                                        <div className="relative">
                                            <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                                            <Textarea
                                                id="useCase"
                                                value={formData.useCase}
                                                onChange={(e) => setFormData({ ...formData, useCase: e.target.value })}
                                                className="pl-10 min-h-[100px]"
                                                placeholder="Tell us about your technical hiring challenges and what you're looking for..."
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Submit Error */}
                                    {submitMutation.isError && (
                                        <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-sm text-destructive">
                                            {submitMutation.error?.message || 'Something went wrong. Please try again.'}
                                        </div>
                                    )}

                                    {/* Submit Button */}
                                    <Button
                                        type="submit"
                                        size="lg"
                                        className="w-full"
                                        disabled={submitMutation.isPending || !!emailError}
                                    >
                                        {submitMutation.isPending ? (
                                            'Submitting...'
                                        ) : (
                                            <>
                                                Request Demo
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </>
                                        )}
                                    </Button>

                                    <p className="text-xs text-center text-muted-foreground">
                                        By submitting, you agree to our{' '}
                                        <a href="#" className="text-primary hover:underline">Terms of Service</a>
                                        {' '}and{' '}
                                        <a href="#" className="text-primary hover:underline">Privacy Policy</a>
                                    </p>
                                </form>
                            </div>
                        </motion.div>

                        {/* Features */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5, delay: 0.3 }}
                            className="space-y-6"
                        >
                            <h3 className="text-xl font-semibold">Why Enterprise Teams Choose LoopLab</h3>

                            <div className="space-y-4">
                                <FeatureCard
                                    icon={<Sparkles className="h-6 w-6" />}
                                    title="AI-Powered Assessments"
                                    description="Create realistic coding challenges in minutes using AI, or upload your own. Automatic evaluation with detailed feedback."
                                />
                                <FeatureCard
                                    icon={<Shield className="h-6 w-6" />}
                                    title="Advanced Anti-Cheating"
                                    description="Camera monitoring, tab switch detection, copy-paste tracking, and screenshot prevention ensure fair assessments."
                                />
                                <FeatureCard
                                    icon={<BarChart3 className="h-6 w-6" />}
                                    title="Comprehensive Analytics"
                                    description="Detailed insights into candidate performance, time management, and code quality with exportable reports."
                                />
                                <FeatureCard
                                    icon={<Users className="h-6 w-6" />}
                                    title="Team Collaboration"
                                    description="Invite multiple reviewers, add manual scores, and make data-driven hiring decisions together."
                                />
                            </div>

                            {/* Testimonial */}
                            <div className="mt-8 p-6 bg-muted/50 rounded-xl border border-border">
                                <p className="text-muted-foreground italic mb-4">
                                    "LoopLab transformed how we evaluate engineering candidates. The real-world
                                    coding challenges give us much better signal than traditional coding interviews."
                                </p>
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-primary/20 rounded-full flex items-center justify-center">
                                        <span className="text-primary font-semibold">JD</span>
                                    </div>
                                    <div>
                                        <p className="font-medium text-sm">Jane Doe</p>
                                        <p className="text-xs text-muted-foreground">VP of Engineering, TechCorp</p>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}

// Feature card component
function FeatureCard({ icon, title, description }: { icon: React.ReactNode; title: string; description: string }) {
    return (
        <div className="flex gap-4 p-4 rounded-lg border border-border bg-card/50 hover:bg-card transition-colors">
            <div className="flex-shrink-0 w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center text-primary">
                {icon}
            </div>
            <div>
                <h4 className="font-medium mb-1">{title}</h4>
                <p className="text-sm text-muted-foreground">{description}</p>
            </div>
        </div>
    );
}
