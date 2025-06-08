import mysql from 'mysql2/promise';

const db = mysql.createPool({
  host: "localhost",
  user: "root",
  password: "RoblesThiago21122005",
  database: "drekkz_db",
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

export default db;