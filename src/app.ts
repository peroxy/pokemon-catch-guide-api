import express from 'express';
import { Strategy } from 'passport-http-bearer';
import passport from 'passport';
import bcrypt from 'bcryptjs';
import { getEncountersForLocation, getEncountersForPokemon, getLocations, getPokemonByGeneration, getPokemonById, updatePokemonCaught } from './db/db';

const app = express();
const cors = require('cors');
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
app.use(cors());

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

app.get('/pokemon/:id', passport.authenticate('bearer', { session: false }), (req, res) => {
  const id = parseInt(req.params.id);
  if (id) {
    const pokemon = getPokemonById(id);
    console.log(pokemon);
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

app.get('/generations/:generation/locations', passport.authenticate('bearer', { session: false }), (req, res) => {
  const generation = parseInt(req.params.generation);
  if (generation) {
    const locations = getLocations(generation);
    res.send(locations);
  } else {
    res.sendStatus(400);
  }
});

app.post('/pokemon/:pokemon_id/caught/:caught', passport.authenticate('bearer', { session: false }), (req, res) => {
  const pokemonId = parseInt(req.params.pokemon_id);
  const caught = parseInt(req.params.caught);
  if (pokemonId && !isNaN(caught)) {
    updatePokemonCaught(pokemonId, caught > 0);
    res.sendStatus(200);
  } else {
    res.sendStatus(400);
  }
});

app.post('/login', passport.authenticate('bearer', { session: false }), (req, res) => {
  res.sendStatus(200);
});

// start the Express server
app.listen(port, () => {
  console.log(`server started at http://localhost:${port}`);
});
