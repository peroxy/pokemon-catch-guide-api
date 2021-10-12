import db from 'better-sqlite3';

export const getPokemon = () => {
  const database = db('/home/peroxy/dev/pokemon-catch-guide-api/src/db/pokemon.db', { fileMustExist: true });

  interface Pokemon {
    id: number;
    dex_id: number;
    name: string;
    generation: number;
    caught: boolean;
  }

  const row = database.prepare('SELECT * FROM pokemon WHERE dex_id = 1');
  const neki: Pokemon[] = row.all();
  console.log(neki);
};
