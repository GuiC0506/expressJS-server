const { hashPassword, comparePassword } = require("../utils/helpers");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

module.exports = {
    async login(req, res) {
        try {
            const { password, name } = req.body;
            const user = await User.findOne({where: { name }})
            if(!user) return res.status(400).json({ error: "User not found"});

            const isHashableEqualsPlain = await comparePassword(password, user.password);
            if(!isHashableEqualsPlain) return res.status(401).json({error: "Check username/password again"});

            const jwtPayload = {
                id: user.id,
                name: user.name
             }

            const accessToken = jwt.sign(jwtPayload, 
                process.env.ACCESS_TOKEN_SECRET, { expiresIn: 3600 });

            res.cookie("jwt", accessToken, {httpOnly: false});
            return res.status(200).json({ message: "Logged in!" });

        } catch(err) {
            console.log(err);
            return res.status(500).json({error: "Internal Server Error"});
        }
    },

    async logout(req, res) {
        res.clearCookie("jwt");
        res.status(202).json({ error: "Logged out!"});
    }
}
