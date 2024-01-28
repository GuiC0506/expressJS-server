const { Router } = require("express")
const  { query, validationResult, checkSchema, matchedData } = require('express-validator');
const { userCreationSchema } = require("../utils/validationSchemas");
const { hashPassword } = require("../utils/helpers");
const passport = require('passport');
const _ = require("../strategies/local-strategy");
const pool = require("../database/db");


const router = Router();

router.post("/api/login", passport.authenticate("local"), 
    (req, res) => {
    res.status(200).send("You have logged in!");
})

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

router.get("/api/auth/status", (req, res) => {
    console.log(req.session)
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
        console.log(req.sessionID);
    });
    if(!req.user) {
        return res.status(401).send("Not authenticated")
    }
    res.status(200).send(req.user);
})

module.exports.auth = router;
