const User = require("../models/User");
const { hashPassword } = require("../utils/helpers");

module.exports = {
    async index(req, res, next) {
        const users = await User.findAll();
        return res.status(200).json(users);
    },

    async store(req, res, next) {
        try {
            const data = req.body
            data.password = data.password && await hashPassword(data?.password);
            const { name, password } = data;
            const user = await User.create({ name, password});
            return res.status(200).json(user);
        } catch(err) {
            const validationErros = err.errors.map(err => ({ error: err.message }));
            return res.status(400).json(validationErros);
        }
    }
}
