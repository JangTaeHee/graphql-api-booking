const mysql = require('mysql2/promise');

export const pool = mysql.createPool({
  host     : 'localhost',
  user     : 'jth',
  password : 'dkfrhf8',
  database : 'example_db',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
})