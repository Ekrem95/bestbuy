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
      id int primary key not null,
      name     text  not null,
      email    text  not null,
      password text  not null,
      age      int,
      address  char(50),
      balance  int   not null,
      unique (email)
    );
  `)
    .then(() => null)
    .catch(e => console.error(e.stack))
    .then(() => {
      client.query(`
        create table if not exists items(
          id int primary key not null,
          name    text    not null,
          price   int     not null,
          onsale  boolean not null default true,
          ownerID int    not null,
          tags    text[]
        );
      `)
      .then(() => null)
      .catch(e => console.error(e.stack));
    })
    .catch(e => console.log(e));
};
