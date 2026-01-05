// const { Sequelize } = require('sequelize')
//
// const db = new Sequelize("node-api", "root", "", {
//     host: 'localhost',
//     dialect: 'mysql'
// })
//
// db.authenticate()
// .then(() => {
//     console.log('✅ Connexion BDD OK')
// })
// .catch((e) => {
//     console.error('Error de connexion bdd :' + e.message)
// })
//
// module.exports = db

const mysql = require('mysql2');
const path = require('path');

require('dotenv').config({
    path: path.resolve(__dirname, `.env.${process.env.NODE_ENV}`)
});

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10
});

module.exports = pool.promise();