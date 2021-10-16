import db from 'better-sqlite3';
import { InsertEncounter, InsertPokemon, Pokemon } from './db_models';

const dbPath = process.env.DATABASE_PATH || './src/db/pokemon.db';
const database = db(dbPath, { fileMustExist: true });

export const getPokemon = () => {
  const row = database.prepare('SELECT * FROM pokemon');
  const neki: Pokemon[] = row.all();
  return neki;
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
