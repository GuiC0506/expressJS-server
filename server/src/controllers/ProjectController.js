const Project = require("../models/Project");
const User = require("../models/User");
module.exports = {
    async store(req, res) {
        try {
            const { owner_id } = req.params;
            const { name } = req.body;

            const user = await User.findByPk(owner_id);
            if(!user) return res.status(400).json({ error: `User with id ${owner_id} not found`});

            const [ project ] = await Project.findOrCreate({
                where: { name },
                defaults: {
                    owner_id,
                    name
                }
            });
            
            await user.addProject(project);
            return res.status(200).json(project);
        } catch(err) {
            console.log(err);
            return res.status(400).json(err);
        }
    },

    async index(req, res) {
        try {
            const { id } = req.params;
            const projects = await Project.findAll({
                where: {
                    id
                },
                include: {
                    association: "users"
                }
            });

            if(!projects) return res.status(400).json({ error: `Project with id ${id} does not exist`})
            return res.status(200).json(projects);
        } catch(err) {
            return res.sendStatus(500);
        }
    },

    async delete(req, res) {
        const { owner_id } = req.params;
        const user = await User.findByPk(owner_id);
        if(!user) return res.status(400).json({ error: "User not found"});
        
        const project = await Project.findOne({
            where: { name: req.body.name}
        })

        if(!project) return res.status(400).json({error: "Project not found"});

        await user.removeProject(project);
        return res.sendStatus(200);
        
    }
}
