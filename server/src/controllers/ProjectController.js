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
    }
}
