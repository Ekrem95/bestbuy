const pool = require('../../router/router').db;
const { user, item } = require('./static');

const clear = () => {
  pool.connect((err, client, done) => {
    if (err) throw err;
    client.query(
      'delete from users where email = $1',
      [user.email], (err, rows) => {
      if (err) {
        done();
        console.log(err.stack);
        return;
      }

      client.query(`
        delete from items
         where id in (
           select id from items where name = $1 limit 1
          )
          returning id
        `,
        [item.name], (err, rows) => {
        if (err) {
          done();
          console.log(err.stack);
          return;
        }

        if (rows.rowCount === 0) {
          return;
        } else {
          const itemID = rows.rows[0].id;

          client.query(
            'delete from item_attributes where id = $1',
            [itemID], (err, rows) => {
            done();
            if (err) {
              console.log(err.stack);
              return;
            }

            clear();
          });
        }
      });
    });
  });
};

module.exports = clear;
