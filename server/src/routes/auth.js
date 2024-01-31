const { Router } = require("express")
const  { query, validationResult, checkSchema, matchedData } = require('express-validator');
const { userCreationSchema } = require("../utils/validationSchemas");
const { hashPassword, comparePassword } = require("../utils/helpers");
const passport = require('passport');
const _ = require("../strategies/local-strategy");
const pool = require("../database/db");
const jwt = require("jsonwebtoken");
const middlewares = require("../middlewares");
const { users } = require("../utils/constants");
const UserController = require("../controllers/UserController");
const User = require("../models/User");
require("dotenv").config();

const router = Router();

// authorization via session: information about user is stored in the server, in the session store.
// subsequent requests, sends a session ID to the server, and then the server checks if that ID is in the session store
router.post("/api/login", passport.authenticate("local", {failWithError: false, failureMessage: false}), 
    (req, res) => {
    res.status(200).send("You have logged in!");
});

// authorization via jwt: information about user is stored in the client, together with the token.
router.post("/api/loginjwt",
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

            const accessToken = jwt.sign(jwtPayload, "secret", {
                algorithm: "HS256",
                expiresIn: 3600
            });

            res.cookie("jwt", accessToken, {httpOnly: false});
            return res.status(200).json({ accessToken: accessToken });

        } catch(err) {
            console.log("TESTE");
        }
    }
)

router.post("/api/register", UserController.store);

router.post("/api/auth/logout", (req, res) => {
    if(!req.isAuthenticated()) return res.status(401).send("You have not made the login yet.");
    req.logout((err) => {
        if(err) return res.sendStatus(400);
        res.sendStatus(200);
    })
})

router.post("/api/auth/logoutjwt",
    middlewares.authenticateToken,
    (req, res) => {
        res.clearCookie("jwt");
        res.sendStatus(202);
    }
)

router.get("/api/auth/status", middlewares.authenticateToken,
    (req, res) => {
    /* console.log(req.session) */
    /* req.sessionStore.get(req.sessionID, (err, session) => { */
    /*     console.log(session); */
    /*     console.log(req.sessionID); */
    /* }); */
    if(!req.user) {
        return res.status(401).send("Not authenticated")
    }
    res.status(200).send(req.user);
})

module.exports.auth = router;
