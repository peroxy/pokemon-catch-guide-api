import db from 'better-sqlite3';
import { Encounter, InsertEncounter, InsertPokemon, Pokemon } from './db_models';

const dbPath = process.env.DATABASE_PATH || './src/db/pokemon.db';
const database = db(dbPath, { fileMustExist: true });

export const getPokemonByGeneration = (generation: number): Pokemon[] => {
  const rows = database.prepare('SELECT * FROM pokemon WHERE generation = ?');
  return rows.all(generation) as Pokemon[];
};

export const getEncountersForPokemon = (pokemonId: number): Encounter[] => {
  const rows = database.prepare('SELECT * FROM encounter WHERE pokemon_id = ?');
  return rows.all(pokemonId) as Encounter[];
};

export const getEncountersForLocation = (location: string, generation: number): Encounter[] => {
  const rows = database.prepare(`
    SELECT e.* FROM encounter e
    JOIN pokemon p on e.pokemon_id = p.id
    WHERE location = ? and generation = ?`);
  return rows.all(location, generation) as Encounter[];
};

export const updatePokemonCaught = (pokemonId: number, caught: boolean) => {
  const insert = database.prepare(`UPDATE pokemon set caught = ? WHERE id = ?`);
  return insert.run(caught ? 1 : 0, pokemonId).lastInsertRowid;
};

export const insertPokemon = (pokemon: InsertPokemon) => {
  const insert = database.prepare(`INSERT INTO pokemon (dex_id, name, generation, caught) VALUES 
                           (@dex_id, @name, @generation, @caught)`);
  return insert.run(pokemon).lastInsertRowid;
};

export const insertEncounter = (encounter: InsertEncounter) => {
  const insert = database.prepare(
    `INSERT INTO encounter 
    (location, pokemon_id, version, conditions, obtain_method, chance, min_level, max_level, evolution_trigger, evolution_method, is_baby) VALUES 
    (@location, @pokemon_id, @version, @conditions, @obtain_method, @chance, @min_level, @max_level, @evolution_trigger, @evolution_method, @is_baby)`
  );
  return insert.run(encounter).lastInsertRowid;
};
