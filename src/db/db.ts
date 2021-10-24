import db from 'better-sqlite3';
import { Encounter, EncounterWithPokemon, InsertEncounter, InsertPokemon, Location, Pokemon } from './db_models';

const dbPath = process.env.DATABASE_PATH || './src/db/pokemon.db';
const database = db(dbPath, { fileMustExist: true });

export const getPokemonByGeneration = (generation: number): Pokemon[] => {
  const rows = database.prepare('SELECT * FROM pokemon WHERE generation = ?');
  return rows.all(generation) as Pokemon[];
};

export const getPokemonById = (id: number): Pokemon => {
  const row = database.prepare('SELECT * FROM pokemon WHERE id = ?');
  return row.get(id) as Pokemon;
};

export const getEncountersForPokemon = (pokemonId: number): Encounter[] => {
  const rows = database.prepare('SELECT * FROM encounter WHERE pokemon_id = ?');
  return rows.all(pokemonId) as Encounter[];
};

export const getLocations = (generation: number): Location[] => {
  const rows = database.prepare(`
      select location as name, count(*) as encounters_number
      from (
         select e.location
         from encounter e
            join pokemon p on p.id = e.pokemon_id
         where p.generation = ?
         group by e.location, p.name)
      group by location
      order by encounters_number desc
      `);
  return rows.all(generation) as Location[];
};

export const getEncountersForLocation = (location: string, generation: number): EncounterWithPokemon[] => {
  const rows = database.prepare(`
    SELECT e.*, p.name as pokemon_name, p.dex_id  FROM encounter e
    JOIN pokemon p on e.pokemon_id = p.id
    WHERE location = ? and generation = ?`);
  return rows.all(location, generation) as EncounterWithPokemon[];
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
