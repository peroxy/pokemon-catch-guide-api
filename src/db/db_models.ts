export interface Pokemon {
  id: number;
  dex_id: number;
  name: string;
  generation: number;
  caught: boolean;
}

export interface InsertPokemon {
  dex_id: number;
  name: string;
  generation: number;
  caught: number;
}

export interface InsertEncounter {
  location: string;
  pokemon_id: number;
  version: string | null;
  conditions: string | null;
  obtain_method: string | null;
  chance: number | null;
  min_level: number | null;
  max_level: number | null;
  evolution_trigger: string;
  evolution_method: string;
  is_baby: number;
}

export interface Encounter {
  id: number;
  location: string;
  pokemon_id: number;
  version: string | null;
  conditions: string | null;
  obtain_method: string | null;
  chance: number | null;
  min_level: number | null;
  max_level: number | null;
  evolution_trigger: string;
  evolution_method: string;
  is_baby: boolean;
}

export interface EncounterWithName {
  id: number;
  location: string;
  pokemon_id: number;
  pokemon_name: string;
  version: string | null;
  conditions: string | null;
  obtain_method: string | null;
  chance: number | null;
  min_level: number | null;
  max_level: number | null;
  evolution_trigger: string;
  evolution_method: string;
  is_baby: boolean;
}
