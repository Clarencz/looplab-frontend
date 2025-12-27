import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getSupportedCountries, type SupportedCountry } from '@/lib/api/payments';

interface CountryPaymentSelectorProps {
    selectedCountry: string;
    onCountryChange: (country: string) => void;
    phoneNumber: string;
    onPhoneNumberChange: (phone: string) => void;
    selectedNetwork?: string;
    onNetworkChange?: (network: string) => void;
}

export function CountryPaymentSelector({
    selectedCountry,
    onCountryChange,
    phoneNumber,
    onPhoneNumberChange,
    selectedNetwork,
    onNetworkChange,
}: CountryPaymentSelectorProps) {
    const { data: countries, isLoading } = useQuery({
        queryKey: ['supported-countries'],
        queryFn: getSupportedCountries,
    });

    const currentCountry = countries?.find(c => c.country_code === selectedCountry);
    const networks = currentCountry?.mobile_networks || [];

    const formatPhoneNumber = (value: string, country: SupportedCountry | undefined) => {
        if (!country) return value;

        // Remove all non-digits
        const digits = value.replace(/\D/g, '');

        // Remove country code if present
        const prefix = country.phone_prefix.replace('+', '');
        let cleaned = digits;
        if (digits.startsWith(prefix)) {
            cleaned = digits.slice(prefix.length);
        }

        // Remove leading zero
        if (cleaned.startsWith('0')) {
            cleaned = cleaned.slice(1);
        }

        return cleaned;
    };

    const handlePhoneChange = (value: string) => {
        const formatted = formatPhoneNumber(value, currentCountry);
        onPhoneNumberChange(formatted);
    };

    const getFullPhoneNumber = () => {
        if (!currentCountry || !phoneNumber) return '';
        return `${currentCountry.phone_prefix}${phoneNumber}`;
    };

    if (isLoading) {
        return <div className="text-sm text-muted-foreground">Loading countries...</div>;
    }

    return (
        <div className="space-y-4">
            {/* Country Selector */}
            <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Select value={selectedCountry} onValueChange={onCountryChange}>
                    <SelectTrigger id="country">
                        <SelectValue placeholder="Select country" />
                    </SelectTrigger>
                    <SelectContent>
                        {countries?.map((country) => (
                            <SelectItem key={country.country_code} value={country.country_code}>
                                <div className="flex items-center gap-2">
                                    <span className="text-2xl">{getFlagEmoji(country.country_code)}</span>
                                    <span>{country.country_name}</span>
                                    <span className="text-muted-foreground">({country.currency_code})</span>
                                </div>
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>

            {/* Phone Number Input */}
            <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="flex gap-2">
                    <div className="flex items-center px-3 border rounded-md bg-muted text-muted-foreground min-w-[80px]">
                        {currentCountry?.phone_prefix || '+254'}
                    </div>
                    <Input
                        id="phone"
                        type="tel"
                        placeholder="712345678"
                        value={phoneNumber}
                        onChange={(e) => handlePhoneChange(e.target.value)}
                        className="flex-1"
                    />
                </div>
                {phoneNumber && (
                    <p className="text-xs text-muted-foreground">
                        Full number: {getFullPhoneNumber()}
                    </p>
                )}
            </div>

            {/* Mobile Network Selector */}
            {networks.length > 1 && onNetworkChange && (
                <div className="space-y-2">
                    <Label htmlFor="network">Mobile Network</Label>
                    <Select value={selectedNetwork} onValueChange={onNetworkChange}>
                        <SelectTrigger id="network">
                            <SelectValue placeholder="Select network" />
                        </SelectTrigger>
                        <SelectContent>
                            {networks.map((network) => (
                                <SelectItem key={network} value={network}>
                                    <div className="flex items-center gap-2">
                                        <span className="capitalize">{network}</span>
                                        {getNetworkBadge(network)}
                                    </div>
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            )}

            {/* Country Info */}
            {currentCountry && (
                <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Currency:</span>
                        <span className="font-medium">
                            {currentCountry.currency_symbol} {currentCountry.currency_code}
                        </span>
                    </div>
                    {currentCountry.min_amount && currentCountry.max_amount && (
                        <div className="flex justify-between">
                            <span className="text-muted-foreground">Limits:</span>
                            <span className="font-medium">
                                {currentCountry.currency_symbol}{currentCountry.min_amount.toLocaleString()} - {currentCountry.currency_symbol}{currentCountry.max_amount.toLocaleString()}
                            </span>
                        </div>
                    )}
                    <div className="flex justify-between">
                        <span className="text-muted-foreground">Networks:</span>
                        <span className="font-medium capitalize">{networks.join(', ')}</span>
                    </div>
                </div>
            )}
        </div>
    );
}

// Helper functions
function getFlagEmoji(countryCode: string): string {
    const flags: Record<string, string> = {
        KE: '🇰🇪',
        TZ: '🇹🇿',
        UG: '🇺🇬',
        RW: '🇷🇼',
        BI: '🇧🇮',
        SS: '🇸🇸',
        CD: '🇨🇩',
    };
    return flags[countryCode] || '🌍';
}

function getNetworkBadge(network: string): JSX.Element | null {
    const colors: Record<string, string> = {
        mpesa: 'text-green-600',
        airtel: 'text-red-600',
        mtn: 'text-yellow-600',
        tigo: 'text-blue-600',
        lumicash: 'text-purple-600',
        zain: 'text-orange-600',
        orange: 'text-orange-500',
    };

    const color = colors[network.toLowerCase()] || 'text-gray-600';

    return <Check className={`h-4 w-4 ${color}`} />;
}
