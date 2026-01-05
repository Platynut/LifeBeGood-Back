const bdd = require('./index');
require('./user.model')
require('./product.model')

const sync = async () => {
    await bdd.sync({alter: true});
    console.log("Synchronisation réussie")
}

sync();