const sqlite3 = require('sqlite3').verbose();
require('dotenv').config();

const db: any = new sqlite3.Database(
  process.env.DB_PATH,
  sqlite3.OPEN_READWRITE,
  (err: Error) => {
    if (err !== null) console.log(err);
    else console.log('Connected to db');
  }
);

function sendQuery(query: string): void {
  const user = 'fuchs';
  db.all(query, [user], (err: Error, rows: any): void => {
    if (err !== null) {
      console.error(err.message);
    }
    console.log(rows[0]);
  });
}

module.exports = { sendQuery, db };
