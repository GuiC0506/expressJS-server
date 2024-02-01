const { Router } = require("express")
const { hashPassword, comparePassword } = require("../utils/helpers");
const passport = require('passport');
const _ = require("../strategies/local-strategy");
const pool = require("../database/db");
const jwt = require("jsonwebtoken");
const middlewares = require("../middlewares");
const UserController = require("../controllers/UserController");
const User = require("../models/User");
require("dotenv").config();

const router = Router();

// authorization via session: information about user is stored in the server, in the session store.
// subsequent requests, sends a session ID to the server, and then the server checks if that ID is in the session store

// authorization via jwt: information about user is stored in the client, together with the token.
router.post("/api/login",
    UserController._getByUsername,
    async (req, res) => {
        try {
            const data = req.body;
            const isHashableEqualsPlain = await comparePassword(data.password, req.user.password);
            if(!isHashableEqualsPlain) return res.status(401).json({erro: "Bad credentials"});

            const jwtPayload = {
                id: req.user.id,
                name: req.user.name
            }

            const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
                algorithm: "HS256",
                expiresIn: 3600
            });

            res.cookie("jwt", accessToken, {httpOnly: false});
            return res.status(200).json({ accessToken: accessToken });

        } catch(err) {
            return res.status(500).json({error: "Internal Server Error"});
        }
    }
)

router.post("/api/register", UserController.store);
router.post("/api/auth/logout",
    middlewares.authenticateToken,
    (req, res) => {
        res.clearCookie("jwt");
        res.sendStatus(202);
    }
)

module.exports.auth = router;
