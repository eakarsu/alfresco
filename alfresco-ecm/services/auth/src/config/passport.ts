import { PassportStatic } from 'passport';
import { logger } from '../utils/logger';

/**
 * Configure Passport.js authentication strategies.
 * This is a stub that should be extended with actual strategy configurations
 * (JWT, Local, LDAP, SAML, OAuth2) once the user model and database are wired up.
 */
export function configurePassport(passport: PassportStatic): void {
  logger.info('Configuring Passport authentication strategies');

  // ─── JWT Strategy (stub) ───────────────────────────────────────────────────
  // TODO: Configure passport-jwt strategy
  // import { Strategy as JwtStrategy, ExtractJwt } from 'passport-jwt';
  //
  // const jwtOptions = {
  //   jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  //   secretOrKey: process.env.JWT_SECRET || 'change-me-in-production',
  //   issuer: process.env.JWT_ISSUER || 'alfresco-auth-service',
  // };
  //
  // passport.use(new JwtStrategy(jwtOptions, async (payload, done) => {
  //   try {
  //     const user = await findUserById(payload.sub);
  //     if (user) return done(null, user);
  //     return done(null, false);
  //   } catch (error) {
  //     return done(error, false);
  //   }
  // }));

  // ─── Local Strategy (stub) ─────────────────────────────────────────────────
  // TODO: Configure passport-local strategy for username/password auth

  // ─── LDAP Strategy (stub) ──────────────────────────────────────────────────
  // TODO: Configure passport-ldapauth for LDAP/Active Directory integration

  // ─── SAML Strategy (stub) ──────────────────────────────────────────────────
  // TODO: Configure passport-saml for SAML SSO

  // ─── OAuth2 Strategy (stub) ────────────────────────────────────────────────
  // TODO: Configure passport-oauth2 for external OAuth providers

  // ─── Serialization ─────────────────────────────────────────────────────────
  passport.serializeUser((user: any, done) => {
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    try {
      // TODO: Look up user by ID from database
      // const user = await findUserById(id);
      // done(null, user);
      done(null, { id });
    } catch (error) {
      done(error, null);
    }
  });

  logger.info('Passport strategies configured (stubs)');
}
