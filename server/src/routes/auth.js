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
    checkSchema(userCreationSchema),
    async (req, res) => {
        const { username, displayName, password } = req.body;
        const { rows: userRegisters, rowCount } = await pool.query(`select * from users where name = $1`, [username])
        if(!rowCount) res.status(401).json({error: "User does not exist"});
        const { rows: hashedPassword } = await pool.query(`select name, password from users where name = $1`, [username]);
        const isHashableEqualsPlain = await comparePassword(password, hashedPassword[0].password);
        if(!isHashableEqualsPlain) res.status(401).json({error: "Bad credentials"});
            
        const jwtPayload = {
            id: userRegisters[0].id,
            name: userRegisters[0].name
        }

        const accessToken = jwt.sign(jwtPayload, process.env.ACCESS_TOKEN_SECRET, {
            algorithm: "HS256",
            expiresIn: 3600
        });
        res.cookie("jwt", accessToken);
        return res.status(200).json({ accessToken: accessToken });
    }
)

router.post("/api/register", 
    checkSchema(userCreationSchema),
    async (req, res) => {
        const result = validationResult(req);
        if(!result.isEmpty()) {
            const erroMsg = {};
            for(const err of result.array()) {
                erroMsg[err.path] = err.msg;
            }
            return res.status(400).send(erroMsg);
        }
        const data = matchedData(req);
        data.password = await hashPassword(data.password);
        try {
            const insertResult = await pool.query(`
                    insert into users (name, display_name, password)
                    values ($1, $2, $3)
                `, [data.username, data.displayName, data.password]);
            res.sendStatus(200);
        } catch(err) {
            res.status(400).send(err.message);
        }
    }
)

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
