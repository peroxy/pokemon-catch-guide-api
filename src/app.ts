import express from 'express';
import { Strategy } from 'passport-http-bearer';
import passport from 'passport';
import bcrypt from 'bcryptjs';

const app = express();
const env = process.env.NODE_ENV || 'development';
const port = process.env.SERVER_PORT || 8080;

let secretHash: string;
switch (env) {
  case 'development':
    secretHash = bcrypt.hashSync('pokemon');
    break;
  case 'production':
    if (!process.env.API_SECRET_HASH) {
      throw 'Environment variable API_SECRET_HASH is missing';
    }
    secretHash = process.env.API_SECRET_HASH;
}

app.use(passport.initialize());

passport.use(
  new Strategy(function (token, cb) {
    if (bcrypt.compareSync(token, secretHash)) {
      return cb(null, 'authorized');
    } else {
      return cb('could not authorize bearer token', null);
    }
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
