import express from 'express';
import { Strategy } from 'passport-http-bearer';
import passport from 'passport';

const app = express();
const port = process.env.SERVER_PORT || 8080;
//const secretHash = process.env.API_SECRET_HASH || "random";

app.use(passport.initialize());

passport.use(
  new Strategy(function (token, cb) {
    return cb(null, 'user');
  })
);

// define a route handler for the default home page
app.get('/', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.send('Hello world!');
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
