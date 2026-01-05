class UserDto {
    static validate(payload) {
        const errors = [];
        const value = {};
        const { name, email, password, role } = payload || {};

        if (!name || typeof name !== 'string' || !name.trim()) {
            errors.push('name is required and must be a non-empty string');
        } else {
            value.name = name.trim();
        }

        if (!email || typeof email !== 'string' || !/^\S+@\S+\.\S+$/.test(email)) {
            errors.push('valid email is required');
        } else {
            value.email = email.toLowerCase().trim();
        }

        if (!password || typeof password !== 'string' || password.length < 6) {
            errors.push('password is required and must be at least 6 characters');
        } else {
            value.password = password;
        }

        if (role !== undefined) {
            if (typeof role !== 'string') {
                errors.push('role must be a string when provided');
            } else {
                value.role = role.trim();
            }
        }

        return { valid: errors.length === 0, errors, value };
    }
}

module.exports = UserDto;