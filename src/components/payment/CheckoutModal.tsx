import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, ArrowLeft } from 'lucide-react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { PaymentMethodSelector, type PaymentMethod } from './PaymentMethodSelector';
import { CountryPaymentSelector } from './CountryPaymentSelector';
import { DarajaPaymentModal } from './DarajaPaymentModal';
import {
    createStripeCheckoutSession,
    type InitiateDarajaPaymentRequest,
} from '@/lib/api/payments';

interface CheckoutModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    tierId: string;
    tierName: string;
    tierPrice: number;
    billingPeriod: 'monthly' | 'yearly';
}

export function CheckoutModal({
    isOpen,
    onClose,
    onSuccess,
    tierId,
    tierName,
    tierPrice,
    billingPeriod,
}: CheckoutModalProps) {
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('stripe');
    const [selectedCountry, setSelectedCountry] = useState('KE');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [selectedNetwork, setSelectedNetwork] = useState('mpesa');
    const [showDarajaModal, setShowDarajaModal] = useState(false);
    const [darajaPaymentRequest, setDarajaPaymentRequest] = useState<InitiateDarajaPaymentRequest | null>(null);

    const { toast } = useToast();

    const stripeMutation = useMutation({
        mutationFn: createStripeCheckoutSession,
        onSuccess: (data) => {
            // Redirect to Stripe checkout
            window.location.href = data.url;
        },
        onError: (error: any) => {
            toast({
                title: 'Payment Failed',
                description: error.response?.data?.message || 'Failed to create checkout session',
                variant: 'destructive',
            });
        },
    });

    const handleCheckout = () => {
        if (paymentMethod === 'stripe') {
            stripeMutation.mutate({
                tier_id: tierId,
                billing_period: billingPeriod,
            });
        } else {
            // Daraja payment
            if (!phoneNumber) {
                toast({
                    title: 'Phone Number Required',
                    description: 'Please enter your phone number',
                    variant: 'destructive',
                });
                return;
            }

            const request: InitiateDarajaPaymentRequest = {
                country_code: selectedCountry,
                phone_number: phoneNumber,
                amount: tierPrice,
                currency: getCurrencyForCountry(selectedCountry),
                tier_id: tierId,
                billing_period: billingPeriod,
                mobile_network: selectedNetwork,
            };

            setDarajaPaymentRequest(request);
            setShowDarajaModal(true);
        }
    };

    const getCurrencyForCountry = (countryCode: string): string => {
        const currencies: Record<string, string> = {
            KE: 'KES',
            TZ: 'TZS',
            UG: 'UGX',
            RW: 'RWF',
            BI: 'BIF',
            SS: 'SSP',
            CD: 'CDF',
        };
        return currencies[countryCode] || 'USD';
    };

    const getCountryName = (countryCode: string): string => {
        const countries: Record<string, string> = {
            KE: 'Kenya',
            TZ: 'Tanzania',
            UG: 'Uganda',
            RW: 'Rwanda',
            BI: 'Burundi',
            SS: 'South Sudan',
            CD: 'DRC',
        };
        return countries[countryCode] || countryCode;
    };

    const handleDarajaSuccess = () => {
        setShowDarajaModal(false);
        onSuccess();
        onClose();
    };

    const isEastAfrica = ['KE', 'TZ', 'UG', 'RW', 'BI', 'SS', 'CD'].includes(selectedCountry);

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onClose}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Complete Your Purchase</DialogTitle>
                        <DialogDescription>
                            {tierName} - ${tierPrice}/{billingPeriod === 'monthly' ? 'month' : 'year'}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                        {/* Payment Method Selector */}
                        <PaymentMethodSelector
                            selectedMethod={paymentMethod}
                            onMethodChange={setPaymentMethod}
                            userCountry={selectedCountry}
                        />

                        {/* Daraja Payment Form */}
                        {paymentMethod === 'daraja' && (
                            <CountryPaymentSelector
                                selectedCountry={selectedCountry}
                                onCountryChange={setSelectedCountry}
                                phoneNumber={phoneNumber}
                                onPhoneNumberChange={setPhoneNumber}
                                selectedNetwork={selectedNetwork}
                                onNetworkChange={setSelectedNetwork}
                            />
                        )}

                        {/* Stripe Info */}
                        {paymentMethod === 'stripe' && (
                            <div className="p-4 bg-muted rounded-lg text-sm space-y-2">
                                <p className="font-medium">You'll be redirected to Stripe</p>
                                <p className="text-muted-foreground">
                                    Complete your payment securely with Stripe. You'll be redirected back after payment.
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between gap-3">
                        <Button variant="outline" onClick={onClose}>
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCheckout}
                            disabled={
                                stripeMutation.isPending ||
                                (paymentMethod === 'daraja' && !phoneNumber)
                            }
                        >
                            {stripeMutation.isPending && (
                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            )}
                            {paymentMethod === 'stripe' ? 'Continue to Stripe' : 'Pay Now'}
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Daraja Payment Modal */}
            {darajaPaymentRequest && (
                <DarajaPaymentModal
                    isOpen={showDarajaModal}
                    onClose={() => setShowDarajaModal(false)}
                    onSuccess={handleDarajaSuccess}
                    paymentRequest={darajaPaymentRequest}
                    countryName={getCountryName(selectedCountry)}
                />
            )}
        </>
    );
}
