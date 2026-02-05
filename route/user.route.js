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
    User.getAll().then(users => {
        const usersSafe = users.map(user => {
            const userJson = user.toJSON();
            delete userJson.passwordHash;
            return userJson;
        });
        res.json({ users: usersSafe });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    });
    res.status(501).end();
});

router.get('/get/:id', (req, res) => {
    const userId = req.params.id;
    User.getById(userId).then(user => {
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }
        const userSafe = user.toJSON();
        delete userSafe.passwordHash;
        res.json({ userSafe });
    }).catch(err => {
        console.error(err);
        res.status(500).json({ error: 'internal server error' });
    });
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

router.put('/put/:id', (req, res) => {
    const userId = req.params.id;
    const { name, email, username, role, password } = req.body;

    const updates = Object.fromEntries(
        Object.entries({ name, email, username, role })
            .filter(([_, value]) => value !== undefined)
    );

    if (password) {
        updates.passwordHash = hashPassword(password);
    }

    updates.updatedAt = new Date();

    try {
        const user = await User.findByPk(userId);
        if (!user) {
            return res.status(404).json({ error: 'user not found' });
        }

        await user.update(updates);

        const userSafe = user.toJSON();
        delete userSafe.passwordHash;
        return res.json({ user: userSafe });
    } catch (err) {
        if (err instanceof Sequelize.UniqueConstraintError || err.name === 'SequelizeUniqueConstraintError') {
            const field = (err.errors && err.errors[0] && err.errors[0].path) || 'field';
            return res.status(409).json({ error: `${field} already in use` });
        }
        console.error(err);
        return res.status(500).json({ error: 'internal server error' });
    }
    res.status(501).end();
});

router.delete('/delete/:id', (req, res) => {
    const userId = req.params.id;
    User.destroy({ where: { id: userId } }).then(deleted => {
        if (deleted === 0) {
            return res.status(404).json({ error: 'user not found' });
        }
        res.json({ message: 'user deleted successfully' });
    }
    res.status(501).end();
});

module.exports = router;
