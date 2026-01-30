// Rewire Event - Validation Utilities

import { ProfilePayload } from './types';
import { REWIRE_CONFIG } from './config';

export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
}

/**
 * Validate email format
 */
export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email.trim());
}

/**
 * Validate Indian phone number (10 digits)
 */
export function validatePhone(phone: string): boolean {
    // Remove spaces, dashes, and optional +91 prefix
    const cleaned = phone.replace(/[\s-]/g, '').replace(/^\+91/, '');
    return /^[6-9]\d{9}$/.test(cleaned);
}

/**
 * Normalize phone number to 10 digits
 */
export function normalizePhone(phone: string): string {
    return phone.replace(/[\s-]/g, '').replace(/^\+91/, '');
}

/**
 * Validate name (non-empty, reasonable length)
 */
export function validateName(name: string): boolean {
    const trimmed = name.trim();
    return trimmed.length >= 2 && trimmed.length <= 100;
}

/**
 * Validate team code format (RW-XXXX)
 */
export function validateTeamCode(code: string): boolean {
    const pattern = new RegExp(`^${REWIRE_CONFIG.EVENT_SHORTCODE}-\\d{4}$`);
    return pattern.test(code.toUpperCase().trim());
}

/**
 * Normalize team code to uppercase
 */
export function normalizeTeamCode(code: string): string {
    return code.toUpperCase().trim();
}

/**
 * Validate college name
 */
export function validateCollege(college: string): boolean {
    const trimmed = college.trim();
    return trimmed.length >= 2 && trimmed.length <= 200;
}

/**
 * Validate year selection
 */
export function validateYear(year: string): boolean {
    return REWIRE_CONFIG.YEAR_OPTIONS.includes(year as typeof REWIRE_CONFIG.YEAR_OPTIONS[number]);
}

/**
 * Validate skills array
 */
export function validateSkills(skills: string[]): boolean {
    if (!Array.isArray(skills) || skills.length === 0) {
        return false;
    }
    return skills.every(skill =>
        REWIRE_CONFIG.SKILLS_OPTIONS.includes(skill as typeof REWIRE_CONFIG.SKILLS_OPTIONS[number])
    );
}

/**
 * Validate complete profile payload
 */
export function validateProfilePayload(data: Partial<ProfilePayload>): ValidationResult {
    const errors: Record<string, string> = {};

    // Name validation
    if (!data.name || !validateName(data.name)) {
        errors.name = 'Please enter a valid name (2-100 characters)';
    }

    // Email validation
    if (!data.email || !validateEmail(data.email)) {
        errors.email = 'Please enter a valid email address';
    }

    // Phone validation
    if (!data.phone || !validatePhone(data.phone)) {
        errors.phone = 'Please enter a valid 10-digit Indian phone number';
    }

    // College validation (optional)
    // if (!data.college || !validateCollege(data.college)) {
    //     errors.college = 'Please enter your college name';
    // }

    // Year validation (optional)
    // if (!data.year || !validateYear(data.year)) {
    //     errors.year = 'Please select your year of study';
    // }

    // Skills validation
    if (!data.skills || !validateSkills(data.skills)) {
        errors.skills = 'Please select at least one skill';
    }

    // Consent validation
    if (data.consent !== true) {
        errors.consent = 'Please accept the terms to continue';
    }

    // Source validation
    if (!data.source || !['STALL', 'ONLINE'].includes(data.source)) {
        errors.source = 'Please select how you heard about us';
    }

    return {
        valid: Object.keys(errors).length === 0,
        errors
    };
}

/**
 * Validate participant ID format (UUID)
 */
export function validateParticipantId(id: string): boolean {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    return uuidRegex.test(id.trim());
}

/**
 * Sanitize string input
 */
export function sanitizeString(input: string): string {
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove potential HTML tags
        .slice(0, 500); // Limit length
}
