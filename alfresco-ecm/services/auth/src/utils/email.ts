import { v4 as uuidv4 } from 'uuid';
import { logger } from './logger';

export interface EmailVerificationToken {
  token: string;
  expiresAt: Date;
  email: string;
}

export interface PasswordResetToken {
  token: string;
  expiresAt: Date;
  email: string;
}

/**
 * Generate an email verification token.
 * Token expires in 24 hours by default.
 */
export function generateEmailVerificationToken(
  email: string,
  expiresInMs: number = 24 * 60 * 60 * 1000
): EmailVerificationToken {
  return {
    token: uuidv4(),
    expiresAt: new Date(Date.now() + expiresInMs),
    email,
  };
}

/**
 * Generate a password reset token.
 * Token expires in 1 hour by default.
 */
export function generatePasswordResetToken(
  email: string,
  expiresInMs: number = 60 * 60 * 1000
): PasswordResetToken {
  return {
    token: uuidv4(),
    expiresAt: new Date(Date.now() + expiresInMs),
    email,
  };
}

/**
 * Validate that a token has not expired.
 */
export function isTokenExpired(expiresAt: Date): boolean {
  return new Date() > expiresAt;
}

/**
 * Send a verification email (placeholder implementation).
 * In production, integrate with SendGrid, AWS SES, or SMTP.
 */
export async function sendVerificationEmail(
  email: string,
  token: string
): Promise<boolean> {
  const verificationUrl = `${process.env.APP_URL || 'http://localhost:3000'}/verify-email?token=${token}`;

  logger.info(`Sending verification email to ${email}`, { verificationUrl });

  // TODO: Replace with actual email sending logic
  logger.info(`[STUB] Verification email would be sent to: ${email} with URL: ${verificationUrl}`);

  return true;
}

/**
 * Send a password reset email (placeholder implementation).
 * In production, integrate with an email provider.
 */
export async function sendPasswordResetEmail(
  email: string,
  token: string
): Promise<boolean> {
  const resetUrl = `${process.env.APP_URL || 'http://localhost:3000'}/reset-password?token=${token}`;

  logger.info(`Sending password reset email to ${email}`, { resetUrl });

  // TODO: Replace with actual email sending logic
  logger.info(`[STUB] Password reset email would be sent to: ${email} with URL: ${resetUrl}`);

  return true;
}
