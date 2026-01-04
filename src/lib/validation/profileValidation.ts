import { z } from "zod"
import DOMPurify from "dompurify"

// URL validation regex patterns
const LINKEDIN_REGEX = /^(https?:\/\/)?(www\.)?linkedin\.com\/(in|company)\/[\w-]+\/?$/i
const GITHUB_REGEX = /^(https?:\/\/)?(www\.)?github\.com\/[\w-]+\/?$/i
const URL_REGEX = /^(https?:\/\/)?([\w-]+\.)+[\w-]+(\/[\w-._~:/?#[\]@!$&'()*+,;=]*)?$/i

// Sanitization helper
export function sanitizeText(text: string): string {
    return DOMPurify.sanitize(text, {
        ALLOWED_TAGS: [], // Strip all HTML tags
        ALLOWED_ATTR: [], // Strip all attributes
        KEEP_CONTENT: true, // Keep text content
    }).trim()
}

// Custom refinement for sanitized text
const sanitizedString = (maxLength?: number) => {
    let schema = z.string().transform(sanitizeText)
    if (maxLength) {
        schema = schema.refine((val) => val.length <= maxLength, {
            message: `Text must be ${maxLength} characters or less`,
        })
    }
    return schema
}

// Personal Information Schema
export const personalInfoSchema = z.object({
    fullName: z
        .string()
        .min(2, "Name must be at least 2 characters")
        .max(100, "Name must be less than 100 characters")
        .transform(sanitizeText),
    email: z
        .string()
        .email("Please enter a valid email address")
        .transform(sanitizeText),
    phone: z
        .string()
        .optional()
        .transform((val) => (val ? sanitizeText(val) : "")),
    location: z
        .string()
        .max(200, "Location must be less than 200 characters")
        .optional()
        .transform((val) => (val ? sanitizeText(val) : "")),
    subdomain: z
        .string()
        .optional()
        .refine(
            (val) => !val || val === "" || /^[a-z0-9]([a-z0-9-]{1,61}[a-z0-9])?$/.test(val),
            "Subdomain must be 3-63 characters, lowercase letters, numbers, and hyphens only"
        )
        .transform((val) => (val ? val.toLowerCase() : "")),
    linkedin: z
        .string()
        .optional()
        .refine(
            (val) => !val || val === "" || LINKEDIN_REGEX.test(val),
            "Please enter a valid LinkedIn URL (e.g., linkedin.com/in/username)"
        )
        .transform((val) => (val ? sanitizeText(val) : "")),
    github: z
        .string()
        .optional()
        .refine(
            (val) => !val || val === "" || GITHUB_REGEX.test(val),
            "Please enter a valid GitHub URL (e.g., github.com/username)"
        )
        .transform((val) => (val ? sanitizeText(val) : "")),
    portfolio: z
        .string()
        .optional()
        .refine(
            (val) => !val || val === "" || URL_REGEX.test(val),
            "Please enter a valid URL"
        )
        .transform((val) => (val ? sanitizeText(val) : "")),
})

// Professional Summary Schema
export const professionalSummarySchema = z.object({
    summary: sanitizedString(1000).optional(),
})

// Experience Schema
export const experienceItemSchema = z.object({
    id: z.string(),
    company: z
        .string()
        .min(1, "Company name is required")
        .max(200, "Company name must be less than 200 characters")
        .transform(sanitizeText),
    role: z
        .string()
        .min(1, "Role is required")
        .max(200, "Role must be less than 200 characters")
        .transform(sanitizeText),
    period: z
        .string()
        .max(100, "Period must be less than 100 characters")
        .optional()
        .transform((val) => (val ? sanitizeText(val) : "")),
    description: sanitizedString(1000).optional(),
})

export const experienceSchema = z.object({
    experiences: z.array(experienceItemSchema),
})

// Education Schema
export const educationItemSchema = z.object({
    id: z.string(),
    school: z
        .string()
        .min(1, "School name is required")
        .max(200, "School name must be less than 200 characters")
        .transform(sanitizeText),
    course: z
        .string()
        .min(1, "Course/Degree is required")
        .max(200, "Course must be less than 200 characters")
        .transform(sanitizeText),
    year: z
        .string()
        .max(50, "Year must be less than 50 characters")
        .optional()
        .refine(
            (val) =>
                !val ||
                val === "" ||
                /^\d{4}$/.test(val) || // Single year: 2020
                /^\d{4}\s*-\s*\d{4}$/.test(val) || // Range: 2020-2024
                /^\d{4}\s*-\s*Present$/i.test(val), // Ongoing: 2020-Present
            "Year must be in format: 2020, 2020-2024, or 2020-Present"
        )
        .transform((val) => (val ? sanitizeText(val) : "")),
})

export const educationSchema = z.object({
    education: z.array(educationItemSchema),
})

// Skills Schema
export const skillsSchema = z.object({
    skills: z.array(z.string().transform(sanitizeText)),
})

// Combined Profile Form Schema
export const profileFormSchema = z.object({
    ...personalInfoSchema.shape,
    ...professionalSummarySchema.shape,
    ...experienceSchema.shape,
    ...educationSchema.shape,
    ...skillsSchema.shape,
})

export type ProfileFormValues = z.infer<typeof profileFormSchema>
