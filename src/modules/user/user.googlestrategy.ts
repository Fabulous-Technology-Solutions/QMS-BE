import passport from 'passport';
import { Strategy as GoogleStrategy, Profile } from 'passport-google-oauth20';
import dotenv from 'dotenv';
import userModel from './user.model'; // Make sure IUser is exported from your model
import { Request } from 'express';

dotenv.config();

interface GoogleAuthState {
  linking?: boolean;
  role?: 'admin' | 'user';
}

export default function (passport: passport.PassportStatic) {
  passport.use(
    new GoogleStrategy(
      {
        clientID: process.env['GOOGLE_CLIENT_ID'] as string,
        clientSecret: process.env['GOOGLE_CLIENT_SECRET'] as string,
        callbackURL: process.env['GOOGLE_REDIRECT_URI'] as string,
        passReqToCallback: true
      },
      async (
        req: Request,
        accessToken: string,
        refreshToken: string,
        params: any,
        profile: Profile,
        done: any
      ) => {
        try {
          const state: GoogleAuthState = JSON.parse(req.query['state'] as string || '{}');
          console.log('Google profile:', accessToken, refreshToken, params);

          const email = profile.emails?.[0]?.value;
          if (!email) {
            return done(new Error('No email found in Google profile'), undefined);
          }
          const existingUser = await userModel.findOne({ email });

          if (existingUser) {
            // If you want to show full name, use existingUser.firstName + ' ' + existingUser.lastName
            console.log('existingUser:', `${existingUser.firstName} ${existingUser.lastName}`);

            if (state.linking) {
              if (!existingUser.providers.includes('google')) {
                existingUser.providers.push('google');
                existingUser.googleId = profile.id;
                existingUser.isEmailVerified = true;
                await existingUser.save();
              }
              return done(null, existingUser);
            }

            if (!existingUser.providers.includes('google')) {
              return done(
                new Error('This email is already registered. Please log in using your email and password'),
                undefined
              );
            }

            let needsUpdate = false;

            if (!existingUser.googleId) {
              existingUser.googleId = profile.id;
              needsUpdate = true;
            }

            if (!existingUser.isEmailVerified) {
              existingUser.isEmailVerified = true;
              needsUpdate = true;
            }

            if (needsUpdate) {
              await existingUser.save();
            }

            return done(null, existingUser);
          }

          const newUser = await userModel.create({
            googleId: profile.id,
            firstName: profile.name?.givenName || 'Unknown',
            lastName: profile.name?.familyName || 'Unknown',
            role: "admin",
            email: email,
            isEmailVerified: true,
            // profilePicture: (profile._json as any)?.picture,
            providers: ['google']
          });

          return done(null, newUser);
        } catch (error) {
          console.error('Google strategy error:', error);
          return done(error, undefined);
        }
      }
    )
  );

  passport.serializeUser((user: any, done) => {
    console.log('inside serializeUser', user.firstName);
    done(null, user.id);
  });

  passport.deserializeUser(async (id: string, done) => {
    console.log('inside deserializeUser', id);
    try {
      const user = await userModel.findById(id);
      done(null, user);
    } catch (error) {
      done(error, null);
    }
  });
}
