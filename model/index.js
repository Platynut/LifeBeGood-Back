const { Sequelize } = require('sequelize')

const db = new Sequelize("node-api", "root", "", {
    host: 'localhost',
    dialect: 'mysql'
})

db.authenticate()
.then(() => {
    console.log('✅ Connexion BDD OK')
})
.catch((e) => {
    console.error('Error de connexion bdd :' + e.message)
})

module.exports = db