import { apiClient } from './client';

// Types
export interface SupportedCountry {
    id: string;
    country_code: string;
    country_name: string;
    currency_code: string;
    currency_symbol: string | null;
    phone_prefix: string;
    mobile_networks: string[];
    min_amount: number | null;
    max_amount: number | null;
}

export interface InitiateDarajaPaymentRequest {
    country_code: string;
    phone_number: string;
    amount: number;
    currency: string;
    tier_id: string;
    billing_period: 'monthly' | 'yearly';
    mobile_network?: string;
}

export interface DarajaPaymentResponse {
    transaction_id: string;
    checkout_request_id: string | null;
    merchant_request_id: string | null;
    status: 'initiated' | 'pending' | 'completed' | 'failed' | 'cancelled';
    message: string;
}

export interface PaymentStatusResponse {
    ResultCode: string;
    ResultDesc: string;
    CheckoutRequestID: string;
}

// API Functions

/**
 * Get list of supported countries for Daraja payments
 */
export async function getSupportedCountries(): Promise<SupportedCountry[]> {
    const response = await apiClient.get('/daraja/supported-countries');
    return response.data;
}

/**
 * Initiate Daraja payment (M-Pesa, MTN, Airtel, etc.)
 */
export async function initiateDarajaPayment(
    request: InitiateDarajaPaymentRequest
): Promise<DarajaPaymentResponse> {
    const response = await apiClient.post('/daraja/initiate-payment', request);
    return response.data;
}

/**
 * Query Daraja payment status
 */
export async function queryDarajaPaymentStatus(
    checkoutRequestId: string
): Promise<PaymentStatusResponse> {
    const response = await apiClient.get(`/daraja/status/${checkoutRequestId}`);
    return response.data;
}

/**
 * Create Stripe checkout session
 */
export async function createStripeCheckoutSession(request: {
    tier_id: string;
    billing_period: 'monthly' | 'yearly';
}): Promise<{ session_id: string; url: string; payment_id: string }> {
    const response = await apiClient.post('/stripe/create-checkout-session', request);
    return response.data;
}

/**
 * Create Stripe billing portal session
 */
export async function createStripeBillingPortal(): Promise<{ url: string }> {
    const response = await apiClient.get('/stripe/portal-session');
    return response.data;
}
