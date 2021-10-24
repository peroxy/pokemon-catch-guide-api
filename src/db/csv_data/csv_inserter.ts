import * as fs from 'fs';
import * as csv from 'fast-csv';
import { insertEncounter, insertPokemon } from '../db';
import { Pokemon } from '../db_models';

interface CsvRow {
  id: number;
  name: string;
  location: string;
  version: string | null;
  conditions: string | null;
  method: string | null;
  chance: number | null;
  minLvl: number | null;
  maxLvl: number | null;
  trigger: string;
  evolution_method: string;
  baby: number;
  generation: number;
}

function readCsv(csvName: string) {
  return new Promise((resolve, reject) => {
    console.log(`reading ${csvName}...`);
    const insertedPokemon: Pokemon[] = [];
    fs.createReadStream(csvName)
      .pipe(csv.parse({ headers: true, delimiter: ';' }))
      .on('data', (row: CsvRow) => {
        let existingPokemon = insertedPokemon.find((x) => x.dex_id == row.id && x.generation == row.generation);
        if (!existingPokemon) {
          const id = insertPokemon({ caught: 0, dex_id: row.id, generation: row.generation, name: row.name }) as number;
          existingPokemon = { id: id, dex_id: row.id, generation: row.generation, name: row.name, caught: false };
          insertedPokemon.push(existingPokemon);
        }
        insertEncounter({
          chance: row.chance,
          conditions: row.conditions,
          evolution_method: row.evolution_method,
          evolution_trigger: row.trigger,
          location: row.location,
          version: row.version,
          is_baby: row.baby,
          max_level: row.maxLvl,
          min_level: row.minLvl,
          obtain_method: row.method,
          pokemon_id: existingPokemon.id
        });
      })
      .on('end', (rowCount: number) => {
        console.log(`end reading ${rowCount} rows from ${csvName}`);
        resolve(rowCount);
      })
      .on('error', (err) => {
        console.error(err);
        reject(err);
      });
  });
}

async function insertCsvFilesIntoDatabase() {
  for (let i = 1; i <= 6; i++) {
    const csvName = `./src/db/csv_data/gen${i}.csv`;
    await readCsv(csvName);
  }
}

insertCsvFilesIntoDatabase().then(() => console.log('finished!'));
