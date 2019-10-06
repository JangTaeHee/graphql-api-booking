const mysql = require('mysql2/promise');

export const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'user',
  password : '1234',
  database : 'example_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})