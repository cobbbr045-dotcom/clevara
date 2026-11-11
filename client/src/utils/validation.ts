import { isValidNepalProvince, isValidNepalDistrict } from '../data/nepalLocations.js';

export interface NameValidation {
  valid: boolean;
  error?: string;
  trimmed: string;
}

export function validateCustomerName(name: string): NameValidation {
  if (!name || typeof name !== 'string') {
    return { valid: false, error: 'Full name is compulsory.', trimmed: '' };
  }
  const trimmed = name.trim().replace(/\s+/g, ' ');
  if (trimmed.length === 0) {
    return { valid: false, error: 'Full name cannot be empty or contain only spaces.', trimmed };
  }
  if (trimmed.length < 2) {
    return { valid: false, error: 'Full name must be at least 2 characters.', trimmed };
  }
  if (trimmed.length > 20) {
    return { valid: false, error: 'Full name must not exceed 20 characters.', trimmed };
  }
  const validNameRegex = /^[A-Za-z\u0900-\u097F]+(?:[ '-][A-Za-z\u0900-\u097F]+)*$/;
  if (!validNameRegex.test(trimmed)) {
    return { valid: false, error: 'Full name contains invalid characters. Only letters are allowed.', trimmed };
  }
  return { valid: true, trimmed };
}

export interface MobileValidation {
  valid: boolean;
  error?: string;
  cleaned: string;
}

export function validateNepalMobile(phone: string): MobileValidation {
  if (!phone || typeof phone !== 'string') {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number.', cleaned: '' };
  }
  const raw = phone.trim();
  if (!/^\d+$/.test(raw)) {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number.', cleaned: raw };
  }
  if (raw.length !== 10) {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number.', cleaned: raw };
  }
  if (!/^9[78]\d{8}$/.test(raw)) {
    return { valid: false, error: 'Please enter a valid 10-digit mobile number.', cleaned: raw };
  }
  return { valid: true, cleaned: raw };
}

export function validateWardNumber(ward: string | number): { valid: boolean; error?: string; wardNumber: number } {
  if (ward == null || String(ward).trim() === '') {
    return { valid: false, error: 'Ward number is compulsory.', wardNumber: 0 };
  }
  const wardStr = String(ward).trim();
  if (!/^\d+$/.test(wardStr)) {
    return { valid: false, error: 'Ward number must be a positive whole number.', wardNumber: 0 };
  }
  const wardNum = parseInt(wardStr, 10);
  if (wardNum <= 0 || wardNum > 40) {
    return { valid: false, error: 'Ward number must be a valid ward number between 1 and 40.', wardNumber: 0 };
  }
  return { valid: true, wardNumber: wardNum };
}

export const CLEVARA_FIXED_PROMOS = [
  {
    code: 'Over3000',
    minSubtotal: 3000,
    discount: 200,
    description: 'Rs. 200 off on orders above Rs. 3,000'
  },
  {
    code: 'Over5000',
    minSubtotal: 5000,
    discount: 500,
    description: 'Rs. 500 off on orders above Rs. 5,000'
  },
  {
    code: 'Over10000',
    minSubtotal: 10000,
    discount: 1000,
    description: 'Rs. 1,000 off on orders above Rs. 10,000'
  },
  {
    code: 'Over20000',
    minSubtotal: 20000,
    discount: 2000,
    description: 'Rs. 2,000 off on orders above Rs. 20,000'
  }
] as const;

export function evaluatePromotionalCode(code: string | undefined | null, subtotal: number): {
  valid: boolean;
  code?: string;
  discount: number;
  error?: string;
} {
  if (!code || !code.trim()) {
    return { valid: true, discount: 0 };
  }
  const cleanCode = code.trim();
  const matched = CLEVARA_FIXED_PROMOS.find(p => p.code.toLowerCase() === cleanCode.toLowerCase());

  if (!matched) {
    return {
      valid: false,
      discount: 0,
      error: 'Invalid promotional code. Only official CLEVARA promotional codes are accepted.'
    };
  }

  if (subtotal < matched.minSubtotal) {
    return {
      valid: false,
      code: matched.code,
      discount: 0,
      error: `Promotional code ${matched.code} requires a minimum product subtotal of Rs. ${matched.minSubtotal.toLocaleString()}. Your current subtotal is Rs. ${subtotal.toLocaleString()}.`
    };
  }

  const effectiveDiscount = Math.min(matched.discount, subtotal);
  return {
    valid: true,
    code: matched.code,
    discount: effectiveDiscount
  };
}
