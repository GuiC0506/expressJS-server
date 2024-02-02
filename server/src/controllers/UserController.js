const User = require("../models/User");
const Department = require("../models/Department");
const { hashPassword } = require("../utils/helpers");

module.exports = {
    async index(req, res, next) {
        const users = await User.findAll();
        return res.status(200).json(users);
    },
    
    async getById(req, res) {
        const { id } = req.params;
        const user = await User.findByPk(id);
        if(!user) return res.status(400).json({error: "User not found"});
        return res.status(200).json(user);
    },

    async edit(req, res) {
        const [ field, value ] = Object.entries(field);
        return res.send([field, value]);
    },

    async delete(req, res) {
        const { id } = req.params;
        const user = await User.destroy({ where: { id } });
        if(!user) return res.status(400).json({ error: "User not found" })
        return res.status(200).json({ message: `User with id ${id} deleted`});
    },

    async store(req, res) {
        try {
            const data = req.body;
            const { department_id } = req.params;
            data.password = data.password && await hashPassword(data.password);
            const { name, password } = data;
            const department = await Department.findByPk(department_id);

            if(!department) return res.status(404).json({error: "Department does not exist"});
            const user = await User.create({ name, password, department_id});
            return res.status(200).json(user);
        } catch(err) {
            console.log(err);
            const validationErrors = err.errors.map(err => ({ error: err.message }));
            return res.status(400).json(validationErrors);
        }
    }
}
