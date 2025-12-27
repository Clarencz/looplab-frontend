import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { Loader2, CheckCircle2, XCircle, Smartphone } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { initiateDarajaPayment, queryDarajaPaymentStatus, type InitiateDarajaPaymentRequest } from '@/lib/api/payments';
import { useToast } from '@/hooks/use-toast';

interface DarajaPaymentModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSuccess: () => void;
    paymentRequest: InitiateDarajaPaymentRequest;
    countryName: string;
}

type PaymentStep = 'initiating' | 'pending' | 'success' | 'failed';

export function DarajaPaymentModal({
    isOpen,
    onClose,
    onSuccess,
    paymentRequest,
    countryName,
}: DarajaPaymentModalProps) {
    const [step, setStep] = useState<PaymentStep>('initiating');
    const [checkoutRequestId, setCheckoutRequestId] = useState<string | null>(null);
    const [message, setMessage] = useState('');
    const { toast } = useToast();

    const initiateMutation = useMutation({
        mutationFn: initiateDarajaPayment,
        onSuccess: (data) => {
            setCheckoutRequestId(data.checkout_request_id);
            setMessage(data.message);
            setStep('pending');

            // Start polling for status
            if (data.checkout_request_id) {
                startStatusPolling(data.checkout_request_id);
            }
        },
        onError: (error: any) => {
            setStep('failed');
            setMessage(error.response?.data?.message || 'Failed to initiate payment');
            toast({
                title: 'Payment Failed',
                description: error.response?.data?.message || 'Failed to initiate payment',
                variant: 'destructive',
            });
        },
    });

    const statusMutation = useMutation({
        mutationFn: queryDarajaPaymentStatus,
    });

    const startStatusPolling = (requestId: string) => {
        let attempts = 0;
        const maxAttempts = 60; // Poll for 2 minutes (60 * 2 seconds)

        const pollInterval = setInterval(async () => {
            attempts++;

            if (attempts > maxAttempts) {
                clearInterval(pollInterval);
                setStep('failed');
                setMessage('Payment timeout. Please check your phone and try again.');
                return;
            }

            try {
                const status = await statusMutation.mutateAsync(requestId);

                if (status.ResultCode === '0') {
                    clearInterval(pollInterval);
                    setStep('success');
                    setMessage('Payment successful!');

                    toast({
                        title: 'Payment Successful',
                        description: 'Your subscription has been activated.',
                    });

                    setTimeout(() => {
                        onSuccess();
                        onClose();
                    }, 2000);
                } else if (status.ResultCode !== '1032') {
                    // 1032 = Request cancelled by user, keep polling
                    // Any other code = failed
                    clearInterval(pollInterval);
                    setStep('failed');
                    setMessage(status.ResultDesc || 'Payment failed');
                }
            } catch (error) {
                // Continue polling on error
            }
        }, 2000); // Poll every 2 seconds
    };

    useEffect(() => {
        if (isOpen && step === 'initiating') {
            initiateMutation.mutate(paymentRequest);
        }
    }, [isOpen]);

    const handleClose = () => {
        if (step !== 'pending') {
            onClose();
            // Reset state
            setTimeout(() => {
                setStep('initiating');
                setCheckoutRequestId(null);
                setMessage('');
            }, 300);
        }
    };

    return (
        <Dialog open={isOpen} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        {step === 'initiating' && 'Initiating Payment...'}
                        {step === 'pending' && 'Check Your Phone'}
                        {step === 'success' && 'Payment Successful!'}
                        {step === 'failed' && 'Payment Failed'}
                    </DialogTitle>
                    <DialogDescription>
                        {countryName} - {paymentRequest.currency} {paymentRequest.amount.toLocaleString()}
                    </DialogDescription>
                </DialogHeader>

                <div className="flex flex-col items-center justify-center py-8 space-y-4">
                    {/* Status Icon */}
                    {step === 'initiating' && (
                        <Loader2 className="h-16 w-16 animate-spin text-primary" />
                    )}
                    {step === 'pending' && (
                        <div className="relative">
                            <Smartphone className="h-16 w-16 text-primary" />
                            <div className="absolute -top-1 -right-1 h-4 w-4 bg-green-500 rounded-full animate-pulse" />
                        </div>
                    )}
                    {step === 'success' && (
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                    )}
                    {step === 'failed' && (
                        <XCircle className="h-16 w-16 text-destructive" />
                    )}

                    {/* Message */}
                    <div className="text-center space-y-2">
                        <p className="text-lg font-medium">
                            {step === 'initiating' && 'Setting up payment...'}
                            {step === 'pending' && 'Enter your PIN to complete'}
                            {step === 'success' && 'Payment completed successfully'}
                            {step === 'failed' && 'Payment could not be processed'}
                        </p>
                        {message && (
                            <p className="text-sm text-muted-foreground">{message}</p>
                        )}
                    </div>

                    {/* Instructions */}
                    {step === 'pending' && (
                        <div className="w-full p-4 bg-muted rounded-lg space-y-2 text-sm">
                            <p className="font-medium">Next steps:</p>
                            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
                                <li>Check your phone for a payment prompt</li>
                                <li>Enter your mobile money PIN</li>
                                <li>Confirm the payment</li>
                                <li>Wait for confirmation</li>
                            </ol>
                        </div>
                    )}

                    {/* Checkout Request ID */}
                    {checkoutRequestId && step === 'pending' && (
                        <div className="text-xs text-muted-foreground">
                            Request ID: {checkoutRequestId.slice(-8)}
                        </div>
                    )}
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-2">
                    {step === 'failed' && (
                        <Button onClick={handleClose} variant="outline">
                            Close
                        </Button>
                    )}
                    {step === 'pending' && (
                        <Button onClick={handleClose} variant="ghost" disabled>
                            Waiting for payment...
                        </Button>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
