const { Client } = require('pg');
const dotenv = require('dotenv');

const client = new Client({
  user: process.env.dbname,
  host: 'localhost',
  database: process.env.dbname,
  password: process.env.pgpass,
  port: 5432,
});

module.exports = () => {
  client.connect();

  client.query(`
    create table if not exists users(
      id serial primary key not null,
      name     text  not null,
      email    text  not null,
      password text  not null,
      age      int,
      address  char(50),
      balance  int   not null default 5000,
      unique (email)
    );
  `)
    .catch(e => console.error(e.stack))
    .then(() => {
      client.query(`
        create table if not exists items(
          id serial primary key not null,
          name     text    not null,
          price    int     not null,
          quantity int     not null,
          owner_id int     not null
        );
      `)
      .catch(e => console.error(e.stack));
    })
    .catch(e => console.log(e))
    .then(() => {
      client.query(`
        create table if not exists item_attributes(
          id serial primary key not null,
          src      text    not null,
          item_id  int     not null,
          add_time timestamp default now(),
          tags text[]
        );
      `)
      .catch(e => console.error(e.stack));
    })
    .catch(e => console.log(e))
    .then(() => {
      client.query(`
        create table if not exists transactions(
          id serial primary key not null,
          sender   text    not null,
          receiver text    not null,
          quantity int     not null default 1,
          time timestamp default now()
        );
      `)
      .catch(e => console.error(e.stack));
    })
    .catch(e => console.log(e));
};
