const express = require('express');
const router = express.Router();
const UserDto = require('../dto/UserDto');

router.get('/', () => {
    console.log('Récup des user')
})

router.post('/', (req, res) => {
    const { valid, errors, value } = UserDto.validate(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }

    const createdUser = { id: Date.now().toString(), ...value };

    // Ne pas renvoyer le mot de passe
    delete createdUser.password;

    return res.status(201).json({ user: createdUser });
});

router.put('/', () => {
    console.log('update des user')
})

router.delete('/', () => {
    console.log('suppr des user')
})

module.exports = router; 