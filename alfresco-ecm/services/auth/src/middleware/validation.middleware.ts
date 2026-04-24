import { Request, Response, NextFunction } from 'express';

// ─── Regex Patterns ────────────────────────────────────────────────────────────

const EMAIL_REGEX = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
const USERNAME_REGEX = /^[a-zA-Z0-9_.-]{3,64}$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_UPPERCASE_REGEX = /[A-Z]/;
const PASSWORD_LOWERCASE_REGEX = /[a-z]/;
const PASSWORD_DIGIT_REGEX = /[0-9]/;
const PASSWORD_SPECIAL_REGEX = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?`~]/;

// Patterns that indicate potential XSS payloads
const XSS_PATTERNS = [
  /<script[\s>]/i,
  /javascript\s*:/i,
  /on\w+\s*=/i,
  /<iframe[\s>]/i,
  /<object[\s>]/i,
  /<embed[\s>]/i,
  /<link[\s>]/i,
  /vbscript\s*:/i,
  /data\s*:\s*text\/html/i,
  /expression\s*\(/i,
];

// Patterns that indicate potential SQL injection
const SQL_INJECTION_PATTERNS = [
  /(\b(SELECT|INSERT|UPDATE|DELETE|DROP|CREATE|ALTER|EXEC|EXECUTE|UNION|TRUNCATE|GRANT|REVOKE)\b\s)/i,
  /('|\"|;|--|\|\||&&)/,
  /(\b(OR|AND)\b\s+\d+\s*=\s*\d+)/i,
  /(\/\*[\s\S]*?\*\/)/,
  /(\bWAITFOR\b\s+\bDELAY\b)/i,
  /(\bBENCHMARK\b\s*\()/i,
  /(\bSLEEP\b\s*\()/i,
];

// ─── Sanitization Functions ────────────────────────────────────────────────────

/**
 * Strip HTML tags from a string.
 */
function stripHtmlTags(input: string): string {
  return input.replace(/<[^>]*>/g, '');
}

/**
 * Encode HTML entities to prevent XSS.
 */
function encodeHtmlEntities(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Check if a string contains XSS patterns.
 */
function containsXss(input: string): boolean {
  return XSS_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Check if a string contains SQL injection patterns.
 */
function containsSqlInjection(input: string): boolean {
  return SQL_INJECTION_PATTERNS.some((pattern) => pattern.test(input));
}

/**
 * Recursively sanitize all string values in an object.
 */
function sanitizeObject(obj: any): any {
  if (typeof obj === 'string') {
    return encodeHtmlEntities(stripHtmlTags(obj.trim()));
  }
  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }
  if (obj !== null && typeof obj === 'object') {
    const sanitized: Record<string, any> = {};
    for (const key of Object.keys(obj)) {
      sanitized[key] = sanitizeObject(obj[key]);
    }
    return sanitized;
  }
  return obj;
}

/**
 * Recursively check all string values in an object for malicious patterns.
 */
function checkForMaliciousInput(obj: any, path: string = ''): string[] {
  const errors: string[] = [];

  if (typeof obj === 'string') {
    if (containsXss(obj)) {
      errors.push(`Potential XSS detected in field: ${path || 'input'}`);
    }
    if (containsSqlInjection(obj)) {
      errors.push(`Potential SQL injection detected in field: ${path || 'input'}`);
    }
  } else if (Array.isArray(obj)) {
    obj.forEach((item, index) => {
      errors.push(...checkForMaliciousInput(item, `${path}[${index}]`));
    });
  } else if (obj !== null && typeof obj === 'object') {
    for (const key of Object.keys(obj)) {
      errors.push(...checkForMaliciousInput(obj[key], path ? `${path}.${key}` : key));
    }
  }

  return errors;
}

// ─── Validation Functions ──────────────────────────────────────────────────────

export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email);
}

export function isValidUsername(username: string): boolean {
  return USERNAME_REGEX.test(username);
}

export interface PasswordValidationResult {
  isValid: boolean;
  errors: string[];
}

export function validatePassword(password: string): PasswordValidationResult {
  const errors: string[] = [];

  if (!password || password.length < PASSWORD_MIN_LENGTH) {
    errors.push('Password must be at least 8 characters long');
  }
  if (!PASSWORD_UPPERCASE_REGEX.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  }
  if (!PASSWORD_LOWERCASE_REGEX.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  }
  if (!PASSWORD_DIGIT_REGEX.test(password)) {
    errors.push('Password must contain at least one digit');
  }
  if (!PASSWORD_SPECIAL_REGEX.test(password)) {
    errors.push('Password must contain at least one special character');
  }

  return { isValid: errors.length === 0, errors };
}

// ─── Middleware ─────────────────────────────────────────────────────────────────

/**
 * Middleware that sanitizes request body, query, and params.
 * Also checks for XSS and SQL injection patterns.
 */
export function sanitizeInput(req: Request, res: Response, next: NextFunction): void {
  // Check for malicious patterns before sanitizing
  const bodyErrors = checkForMaliciousInput(req.body, 'body');
  const queryErrors = checkForMaliciousInput(req.query, 'query');
  const paramErrors = checkForMaliciousInput(req.params, 'params');

  const allErrors = [...bodyErrors, ...queryErrors, ...paramErrors];

  if (allErrors.length > 0) {
    res.status(400).json({
      error: 'Malicious input detected',
      details: allErrors,
    });
    return;
  }

  // Sanitize inputs
  if (req.body && typeof req.body === 'object') {
    req.body = sanitizeObject(req.body);
  }
  if (req.query && typeof req.query === 'object') {
    req.query = sanitizeObject(req.query);
  }

  next();
}

/**
 * Middleware factory that validates required fields exist in the request body.
 */
export function validateRequiredFields(...fields: string[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const missing: string[] = [];

    for (const field of fields) {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missing.push(field);
      }
    }

    if (missing.length > 0) {
      res.status(400).json({
        error: 'Missing required fields',
        fields: missing,
      });
      return;
    }

    next();
  };
}

/**
 * Middleware that validates email format in request body.
 */
export function validateEmailField(fieldName: string = 'email') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const email = req.body[fieldName];
    if (email && !isValidEmail(email)) {
      res.status(400).json({
        error: 'Invalid email format',
        field: fieldName,
      });
      return;
    }
    next();
  };
}

/**
 * Middleware that validates username format in request body.
 */
export function validateUsernameField(fieldName: string = 'username') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const username = req.body[fieldName];
    if (username && !isValidUsername(username)) {
      res.status(400).json({
        error: 'Invalid username format. Must be 3-64 characters, alphanumeric with dots, hyphens, and underscores.',
        field: fieldName,
      });
      return;
    }
    next();
  };
}

/**
 * Middleware that validates password strength in request body.
 */
export function validatePasswordField(fieldName: string = 'password') {
  return (req: Request, res: Response, next: NextFunction): void => {
    const password = req.body[fieldName];
    if (password) {
      const result = validatePassword(password);
      if (!result.isValid) {
        res.status(400).json({
          error: 'Password does not meet strength requirements',
          details: result.errors,
        });
        return;
      }
    }
    next();
  };
}

/**
 * Middleware that validates a UUID format in route params.
 */
export function validateUuidParam(paramName: string = 'id') {
  const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

  return (req: Request, res: Response, next: NextFunction): void => {
    const value = req.params[paramName];
    if (value && !UUID_REGEX.test(value)) {
      res.status(400).json({
        error: `Invalid ${paramName} format. Must be a valid UUID.`,
      });
      return;
    }
    next();
  };
}
