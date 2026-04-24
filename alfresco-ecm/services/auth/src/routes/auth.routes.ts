import { Router, Request, Response } from 'express';
import { validateRegistration, validateLogin, validateEmail, validatePasswordReset, sanitizeInput } from '../middleware/validation.middleware';
import { validatePasswordStrength, hashPassword, comparePassword } from '../utils/password';
import { generateVerificationToken, sendVerificationEmail, sendPasswordResetEmail } from '../utils/email';
import { logger } from '../utils/logger';

const router = Router();

// POST /register - User registration
router.post('/register', sanitizeInput, validateRegistration, async (req: Request, res: Response) => {
  try {
    const { username, email, password, firstName, lastName } = req.body;

    const strengthCheck = validatePasswordStrength(password);
    if (!strengthCheck.isValid) {
      return res.status(400).json({ error: 'Password too weak', details: strengthCheck });
    }

    const passwordHash = await hashPassword(password);
    const verificationToken = generateVerificationToken();

    // In production, save user to database
    const user = {
      id: `usr_${Date.now()}`,
      username,
      email,
      passwordHash,
      firstName,
      lastName,
      status: 'pending',
      emailVerified: false,
      verificationToken,
      createdAt: new Date().toISOString()
    };

    await sendVerificationEmail(email, verificationToken);

    logger.info(`User registered: ${username}`);
    res.status(201).json({
      message: 'User registered successfully. Please verify your email.',
      user: { id: user.id, username: user.username, email: user.email, status: user.status }
    });
  } catch (error) {
    logger.error('Registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
});

// POST /login - User login
router.post('/login', sanitizeInput, validateLogin, async (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    // In production, fetch user from database and verify
    const token = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: username, iat: Date.now() })).toString('base64')}.signature`;
    const refreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    logger.info(`User logged in: ${username}`);
    res.status(200).json({
      message: 'Login successful',
      token,
      refreshToken,
      expiresIn: 604800,
      user: { username }
    });
  } catch (error) {
    logger.error('Login failed:', error);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// POST /logout - User logout
router.post('/logout', async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    if (!token) {
      return res.status(400).json({ error: 'No token provided' });
    }

    // In production, invalidate session/token in database
    logger.info('User logged out');
    res.status(200).json({ message: 'Logged out successfully' });
  } catch (error) {
    logger.error('Logout failed:', error);
    res.status(500).json({ error: 'Logout failed' });
  }
});

// POST /forgot-password - Send password reset email
router.post('/forgot-password', sanitizeInput, validateEmail, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    const resetToken = generateVerificationToken();

    // In production, store reset token with expiry in database
    await sendPasswordResetEmail(email, resetToken);

    logger.info(`Password reset requested for: ${email}`);
    res.status(200).json({ message: 'Password reset email sent if the address exists in our system' });
  } catch (error) {
    logger.error('Password reset request failed:', error);
    res.status(500).json({ error: 'Failed to process password reset request' });
  }
});

// POST /reset-password - Reset password with token
router.post('/reset-password', sanitizeInput, validatePasswordReset, async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    const strengthCheck = validatePasswordStrength(newPassword);
    if (!strengthCheck.isValid) {
      return res.status(400).json({ error: 'Password too weak', details: strengthCheck });
    }

    // In production, verify token and update password in database
    const passwordHash = await hashPassword(newPassword);

    logger.info('Password reset successful');
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    logger.error('Password reset failed:', error);
    res.status(500).json({ error: 'Password reset failed' });
  }
});

// POST /verify-email - Verify email with token
router.post('/verify-email', sanitizeInput, async (req: Request, res: Response) => {
  try {
    const { token } = req.body;
    if (!token) {
      return res.status(400).json({ error: 'Verification token is required' });
    }

    // In production, verify token and update user's email_verified status
    logger.info('Email verified successfully');
    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    logger.error('Email verification failed:', error);
    res.status(500).json({ error: 'Email verification failed' });
  }
});

// POST /refresh-token - Refresh JWT token
router.post('/refresh-token', async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) {
      return res.status(400).json({ error: 'Refresh token is required' });
    }

    // In production, verify refresh token and issue new tokens
    const newToken = `eyJhbGciOiJIUzI1NiJ9.${Buffer.from(JSON.stringify({ sub: 'user', iat: Date.now() })).toString('base64')}.signature`;
    const newRefreshToken = `refresh_${Date.now()}_${Math.random().toString(36).substring(7)}`;

    res.status(200).json({
      token: newToken,
      refreshToken: newRefreshToken,
      expiresIn: 604800
    });
  } catch (error) {
    logger.error('Token refresh failed:', error);
    res.status(500).json({ error: 'Token refresh failed' });
  }
});

export const authRouter = router;
