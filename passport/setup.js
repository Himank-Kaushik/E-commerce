const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await prisma.user.findUnique({ where: { id } });
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: '/auth/google/callback', // Must match Google Console
      proxy: true,
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        // 1. Check if user already exists
        const existingUser = await prisma.user.findUnique({
          where: { googleId: profile.id },
        });

        if (existingUser) {
          // 2. If they exist, return them
          return done(null, existingUser);
        }

        // 3. If new user, create them in the database
        const newUser = await prisma.user.create({
          data: {
            googleId: profile.id,
            email: profile.emails[0].value,
            name: profile.displayName,
            avatarUrl: profile.photos[0].value,
          },
        });
        done(null, newUser);
      } catch (error) {
        done(error, null);
      }
    }
  )
);