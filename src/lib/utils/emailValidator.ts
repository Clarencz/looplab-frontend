/**
 * Email Validator for Enterprise Demo Requests
 * Blocks disposable emails and free email providers
 * Only allows corporate/business domain emails
 */

// Free email providers to block (corporate domains only requirement)
const FREE_EMAIL_PROVIDERS = [
    // Major providers
    'gmail.com', 'googlemail.com',
    'yahoo.com', 'yahoo.co.uk', 'yahoo.fr', 'yahoo.de', 'yahoo.es', 'yahoo.it',
    'outlook.com', 'hotmail.com', 'live.com', 'msn.com',
    'icloud.com', 'me.com', 'mac.com',
    'aol.com',
    'protonmail.com', 'proton.me',
    'zoho.com',
    'yandex.com', 'yandex.ru',
    'mail.ru',
    'gmx.com', 'gmx.de',
    'web.de',
    // Regional providers
    'qq.com', '163.com', '126.com',
    'naver.com', 'daum.net',
    'rediffmail.com',
    'seznam.cz',
    'wp.pl', 'onet.pl', 'interia.pl',
    'libero.it', 'virgilio.it',
    'orange.fr', 'wanadoo.fr', 'laposte.net', 'sfr.fr', 'free.fr',
    'arcor.de', 't-online.de', 'freenet.de',
    'btinternet.com', 'sky.com', 'ntlworld.com',
    'comcast.net', 'verizon.net', 'att.net', 'cox.net', 'charter.net',
];

// Common disposable/temporary email domains
const DISPOSABLE_EMAIL_DOMAINS = [
    // Most popular disposable services
    'tempmail.com', 'temp-mail.org', 'temp-mail.io',
    'guerrillamail.com', 'guerrillamail.org', 'guerrillamail.net', 'guerrillamail.biz',
    '10minutemail.com', '10minutemail.net',
    'mailinator.com', 'mailinater.com',
    'throwaway.email', 'throwawaymail.com',
    'fakemailgenerator.com', 'fakemail.net',
    'sharklasers.com', 'guerrillamail.info',
    'grr.la', 'spam4.me',
    'dispostable.com',
    'mailnesia.com',
    'getnada.com', 'nada.email',
    'tempail.com',
    'mohmal.com',
    'emailondeck.com',
    'tempmailaddress.com',
    'burnermail.io',
    'trashmail.com', 'trashmail.net',
    'mytrashmail.com',
    'spambox.us',
    'yopmail.com', 'yopmail.fr',
    'maildrop.cc',
    'mintemail.com',
    'mailcatch.com',
    'spamgourmet.com',
    'haltospam.com',
    'mailnull.com',
    'jetable.org',
    'incognitomail.org',
    'discardmail.com',
    'spamex.com',
    'mailexpire.com',
    'tempinbox.com',
    'fakeinbox.com',
    'safetymail.info',
    'disposableinbox.com',
    'emailthe.net',
    'sneakemail.com',
    'spamhole.com',
    'deadaddress.com',
    'sogetthis.com',
    'mailmoat.com',
    'mailslot.us',
    'rejectmail.com',
    'dodgeit.com',
    'spamavert.com',
    'sneakemail.com',
    'gishpuppy.com',
    'devnullmail.com',
    'hidzz.com',
    'emailage.com',
    'anonymousspeech.com',
    'bugmenot.com',
    'e4ward.com',
    'filzmail.com',
    'lookugly.com',
    'notsharingmy.info',
    'soodonims.com',
    'tempinbox.co.uk',
    'veryrealemail.com',
    'willselfdestruct.com',
];

// All blocked domains combined
const BLOCKED_DOMAINS = new Set([
    ...FREE_EMAIL_PROVIDERS,
    ...DISPOSABLE_EMAIL_DOMAINS,
]);

export interface EmailValidationResult {
    isValid: boolean;
    error?: string;
    errorType?: 'format' | 'disposable' | 'free_provider' | 'blocked';
}

/**
 * Basic email format validation
 */
export function isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Extract domain from email
 */
export function getEmailDomain(email: string): string {
    return email.toLowerCase().split('@')[1] || '';
}

/**
 * Check if email domain is a free provider
 */
export function isFreeEmailProvider(email: string): boolean {
    const domain = getEmailDomain(email);
    return FREE_EMAIL_PROVIDERS.includes(domain);
}

/**
 * Check if email domain is a disposable/temporary email service
 */
export function isDisposableEmail(email: string): boolean {
    const domain = getEmailDomain(email);
    return DISPOSABLE_EMAIL_DOMAINS.includes(domain);
}

/**
 * Check if email domain is blocked (either free or disposable)
 */
export function isBlockedEmailDomain(email: string): boolean {
    const domain = getEmailDomain(email);
    return BLOCKED_DOMAINS.has(domain);
}

/**
 * Validate email for enterprise demo request
 * Requires corporate domain (blocks free providers and disposable emails)
 */
export function validateCorporateEmail(email: string): EmailValidationResult {
    // Check format
    if (!email || !isValidEmailFormat(email)) {
        return {
            isValid: false,
            error: 'Please enter a valid email address',
            errorType: 'format',
        };
    }

    const domain = getEmailDomain(email);

    // Check for disposable email
    if (isDisposableEmail(email)) {
        return {
            isValid: false,
            error: 'Temporary or disposable email addresses are not allowed',
            errorType: 'disposable',
        };
    }

    // Check for free email provider
    if (isFreeEmailProvider(email)) {
        return {
            isValid: false,
            error: 'Please use your corporate email address (e.g., you@yourcompany.com)',
            errorType: 'free_provider',
        };
    }

    // Additional check for generic blocked domains
    if (BLOCKED_DOMAINS.has(domain)) {
        return {
            isValid: false,
            error: 'This email domain is not accepted. Please use your corporate email.',
            errorType: 'blocked',
        };
    }

    return { isValid: true };
}

/**
 * Get list of blocked domains (for backend sync if needed)
 */
export function getBlockedDomains(): string[] {
    return Array.from(BLOCKED_DOMAINS);
}

export default {
    validateCorporateEmail,
    isValidEmailFormat,
    isBlockedEmailDomain,
    isFreeEmailProvider,
    isDisposableEmail,
    getEmailDomain,
    getBlockedDomains,
};
