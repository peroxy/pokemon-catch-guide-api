import express from 'express';
import { Strategy } from 'passport-http-bearer';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { getEncountersForLocation, getEncountersForPokemon, getPokemonByGeneration, updatePokemonCaught } from './db/db';

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

app.get('/pokemon/generations/:generation', passport.authenticate('bearer', { session: false }), (req, res) => {
  const generation = parseInt(req.params.generation);
  if (generation) {
    const pokemon = getPokemonByGeneration(generation);
    res.send(pokemon);
  } else {
    res.sendStatus(400);
  }
});

app.get('/pokemon/:pokemon_id/encounters', passport.authenticate('bearer', { session: false }), (req, res) => {
  const pokemonId = parseInt(req.params.pokemon_id);
  if (pokemonId) {
    const encounters = getEncountersForPokemon(pokemonId);
    res.send(encounters);
  } else {
    res.sendStatus(400);
  }
});

app.get('/locations/:location/generations/:generation/encounters', passport.authenticate('bearer', { session: false }), (req, res) => {
  const generation = parseInt(req.params.generation);
  if (generation) {
    const encounters = getEncountersForLocation(req.params.location, generation);
    res.send(encounters);
  } else {
    res.sendStatus(400);
  }
});

app.post('/pokemon/:pokemon_id/caught/:caught', passport.authenticate('bearer', { session: false }), (req, res) => {
  const pokemonId = parseInt(req.params.pokemon_id);
  const caught = parseInt(req.params.caught);
  if (pokemonId && !isNaN(caught)) {
    const id = updatePokemonCaught(pokemonId, caught > 0);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
