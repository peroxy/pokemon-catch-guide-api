drop table if exists pokemon;
create table pokemon
(
    id         INTEGER not null
        primary key autoincrement,
    dex_id     INTEGER not null,
    name       TEXT    not null,
    generation INTEGER not null,
    caught     INTEGER not null
);

drop table if exists encounter;
create table encounter
(
    id                INTEGER not null
        primary key autoincrement,
    location          TEXT    not null,
    pokemon_id        INTEGER not null
        constraint encounter_FK
            references pokemon,
    version           TEXT,
    conditions        TEXT,
    obtain_method     TEXT,
    chance            INTEGER,
    min_level         INTEGER,
    max_level         INTEGER,
    evolution_trigger TEXT    not null,
    evolution_method  TEXT    not null,
    is_baby           INTEGER not null
);

