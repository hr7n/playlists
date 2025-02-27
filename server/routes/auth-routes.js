const router = require('express').Router();
const passport = require('passport');

router.get('/login/failed', (req, res) => {
  res.status(401).json({ success: false, message: 'failure' });
});

router.get('/login/success', (req, res) => {
  if (req.user) {
    res
      .status(200)
      .json({ success: true, message: 'Successful', user: req.user });
  }
});

router.get('/logout', (req, res) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    res.redirect('/');
  });
});

router.get(
  '/spotify',
  passport.authenticate('spotify', {
    scope: [
      'user-read-email',
      'user-read-private',
      'streaming',
      'user-read-playback-state',
      'user-modify-playback-state',
    ],
  })
);

router.get(
  '/spotify/callback',
  passport.authenticate('spotify', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect(
      `http://localhost:3000/spotify-success?access_token=${req.user.accessToken}`
    );
  }
);

module.exports = router;
