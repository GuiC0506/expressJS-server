const User = require("../models/User");
const Department = require("../models/Department");
const { hashPassword } = require("../utils/helpers");

module.exports = {
    async index(req, res, next) {
        const users = await User.findAll();
        return res.status(200).json(users);
    },
    
    async _getByUsername(req, res, next) {
        const { name } = req.body;
        const user = await User.findOne({where: { name }});
        if(!user) return res.status(400).send("User not found");
        req.user = user;
        next();
    },

    async getById(req, res) {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if(!user) return res.status(400).json({error: "User not found"});
        return res.status(200).json(user);
    },

    async store(req, res) {
        try {
            const data = req.body
            data.password = data.password && await hashPassword(data?.password);
            const { name, password, dptm_id } = data;
            const department = await Department.findByPk(dptm_id);
            if(!department) return res.status(404).json({error: "Department does not exist"});
            const user = await User.create({ name, password, dptm_id});
            return res.status(200).json(user);
        } catch(err) {
            const validationErrors = err.errors.map(err => ({ error: err.message }));
            return res.status(400).json(validationErrors);
        }
    }
}
