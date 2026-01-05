const express = require('express');
const crypto = require('crypto');
const { Sequelize } = require('sequelize');
const router = express.Router();
const UserDto = require('../dto/UserDto');
const User = require('../model/user.model');

const hashPassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return `${salt}$${hash}`;
};

router.get('/get', (req, res) => {
    console.log('Récup des user');
    res.status(501).end();
});

router.post('/create', async (req, res) => {
    const { valid, errors, value } = UserDto.validate(req.body);
    if (!valid) {
        return res.status(400).json({ errors });
    }

    let username = value.username || value.email.split('@')[0].replace(/\s+/g, '').toLowerCase();
    const passwordHash = hashPassword(value.password);

    try {
        const user = await User.create({
            email: value.email,
            name: value.name,
            username,
            role: value.role || 'user',
            passwordHash
        });

        const userSafe = user.toJSON();
        delete userSafe.passwordHash;

        return res.status(201).json({ user: userSafe });
    } catch (err) {
        if (err instanceof Sequelize.UniqueConstraintError || err.name === 'SequelizeUniqueConstraintError') {
            const field = (err.errors && err.errors[0] && err.errors[0].path) || 'field';
            return res.status(409).json({ error: `${field} already in use` });
        }

        console.error(err);
        return res.status(500).json({ error: 'internal server error' });
    }
});

router.put('/put', (req, res) => {
    console.log('update des user');
    res.status(501).end();
});

router.delete('/delete', (req, res) => {
    console.log('suppr des user');
    res.status(501).end();
});

module.exports = router;
