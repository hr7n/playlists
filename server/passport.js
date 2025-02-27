const SpotifyStrategy = require('passport-spotify').Strategy;
const passport = require('passport');
const User = require('./models/User');
const env = require('dotenv').config();

passport.use(
  new SpotifyStrategy(
    {
      clientID: process.env.SPOTIFY_CLIENT_ID,
      clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
      callbackURL: 'http://localhost:3001/auth/spotify/callback',
    },
    function (accessToken, refreshToken, expires_in, profile, done) {
      try {
        User.findOne({ spotifyId: profile.id }).then((existingUser) => {
          if (existingUser) {
            return done(null, existingUser);
          } else {
            new User({
              username: profile.displayName || profile.id,
              email:
                profile.emails && profile.emails[0]
                  ? profile.emails[0].value
                  : `${profile.id}@spotify.user`,
              spotifyId: profile.id,
              accessToken,
              refreshToken,
              spotifyConnected: true,
            })
              .save()
              .then((user) => done(null, user));
          }
        });
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user);
});

passport.deserializeUser((user, done) => {
  done(null, user);
});

module.exports = passport;
