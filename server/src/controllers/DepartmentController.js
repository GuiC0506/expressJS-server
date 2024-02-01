const Department = require("../models/Department");
const User = require("../models/User");

module.exports = {
    async index(req, res) {
        try {
            const departments = await Department.findAll();
            return res.status(200).json(departments);
        } catch (error) {
            return res.status(500).json({ error: "Erro interno no servidor" });
        }
    },

    async store(req, res) {
        try {
            const { name, owner  } = req.body;
            const department = await Department.create({name, owner})
            return res.status(200).json(department);
        } catch(err) {
            return res.json(err);
        }
    }
}
