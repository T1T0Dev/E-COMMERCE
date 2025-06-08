import mysql from 'mysql2/promise';


const db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "RoblesThiago21122005", // tu pass de MySQL
    database: "drekkz_db"
  });

console.log("Conexión a la base de datos establecida correctamente");

export default db;