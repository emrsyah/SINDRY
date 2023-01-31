import mysql from 'mysql';

export const connectionSql = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: null,
    database: "sindry_db"
})

// connection.connect()