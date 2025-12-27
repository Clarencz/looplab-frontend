import { useState } from 'react';
import { CreditCard, Smartphone, Globe } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

export type PaymentMethod = 'stripe' | 'daraja';

interface PaymentMethodSelectorProps {
    selectedMethod: PaymentMethod;
    onMethodChange: (method: PaymentMethod) => void;
    userCountry?: string;
}

export function PaymentMethodSelector({
    selectedMethod,
    onMethodChange,
    userCountry,
}: PaymentMethodSelectorProps) {
    const isEastAfrica = ['KE', 'TZ', 'UG', 'RW', 'BI', 'SS', 'CD'].includes(userCountry || '');

    return (
        <div className="space-y-3">
            <Label className="text-base font-semibold">Payment Method</Label>
            <RadioGroup value={selectedMethod} onValueChange={(value) => onMethodChange(value as PaymentMethod)}>
                <div className="grid gap-3">
                    {/* Stripe - Global Card Payments */}
                    <Card
                        className={cn(
                            'cursor-pointer transition-all hover:border-primary',
                            selectedMethod === 'stripe' && 'border-primary ring-2 ring-primary/20'
                        )}
                        onClick={() => onMethodChange('stripe')}
                    >
                        <CardContent className="flex items-start gap-4 p-4">
                            <RadioGroupItem value="stripe" id="stripe" className="mt-1" />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <CreditCard className="h-5 w-5 text-primary" />
                                    <Label htmlFor="stripe" className="text-base font-medium cursor-pointer">
                                        Credit/Debit Card
                                    </Label>
                                    <Globe className="h-4 w-4 text-muted-foreground" />
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    Pay with Visa, Mastercard, or American Express
                                </p>
                                <div className="flex gap-2 mt-2">
                                    <img src="/visa.svg" alt="Visa" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    <img src="/mastercard.svg" alt="Mastercard" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                                    <img src="/amex.svg" alt="Amex" className="h-6" onError={(e) => e.currentTarget.style.display = 'none'} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Daraja - East Africa Mobile Money */}
                    <Card
                        className={cn(
                            'cursor-pointer transition-all hover:border-primary',
                            selectedMethod === 'daraja' && 'border-primary ring-2 ring-primary/20',
                            !isEastAfrica && 'opacity-50'
                        )}
                        onClick={() => isEastAfrica && onMethodChange('daraja')}
                    >
                        <CardContent className="flex items-start gap-4 p-4">
                            <RadioGroupItem value="daraja" id="daraja" disabled={!isEastAfrica} className="mt-1" />
                            <div className="flex-1 space-y-1">
                                <div className="flex items-center gap-2">
                                    <Smartphone className="h-5 w-5 text-green-600" />
                                    <Label
                                        htmlFor="daraja"
                                        className={cn(
                                            "text-base font-medium",
                                            isEastAfrica && "cursor-pointer"
                                        )}
                                    >
                                        Mobile Money
                                    </Label>
                                    {isEastAfrica && (
                                        <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full">
                                            Recommended
                                        </span>
                                    )}
                                </div>
                                <p className="text-sm text-muted-foreground">
                                    {isEastAfrica
                                        ? 'Pay with M-Pesa, MTN, Airtel Money, and more'
                                        : 'Available in Kenya, Tanzania, Uganda, Rwanda, Burundi, South Sudan, DRC'
                                    }
                                </p>
                                <div className="flex flex-wrap gap-2 mt-2">
                                    <span className="text-xs bg-green-50 text-green-700 px-2 py-1 rounded border border-green-200">
                                        M-Pesa
                                    </span>
                                    <span className="text-xs bg-yellow-50 text-yellow-700 px-2 py-1 rounded border border-yellow-200">
                                        MTN
                                    </span>
                                    <span className="text-xs bg-red-50 text-red-700 px-2 py-1 rounded border border-red-200">
                                        Airtel
                                    </span>
                                    <span className="text-xs bg-blue-50 text-blue-700 px-2 py-1 rounded border border-blue-200">
                                        Tigo
                                    </span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </RadioGroup>

            {/* Info Message */}
            {selectedMethod === 'daraja' && isEastAfrica && (
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-800">
                    <p className="font-medium">💚 Pay in your local currency</p>
                    <p className="text-green-700 mt-1">
                        Lower fees and instant processing with mobile money
                    </p>
                </div>
            )}

            {selectedMethod === 'stripe' && (
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg text-sm text-blue-800">
                    <p className="font-medium">🔒 Secure payment with Stripe</p>
                    <p className="text-blue-700 mt-1">
                        Your payment information is encrypted and secure
                    </p>
                </div>
            )}
        </div>
    );
}
