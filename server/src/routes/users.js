const { Router } = require('express');
const  { query, validationResult, checkSchema, matchedData, check } = require('express-validator');
const { users } = require("../utils/constants");
const { validateUserExistence, requestLogger, checkAuthentication, authenticateToken } = require("../middlewares");
const { userCreationSchema } = require("../utils/validationSchemas");
const passport = require('passport');
const _ = require("../strategies/local-strategy");
const pool = require("../database/db");
const UserController = require('../controllers/UserController');

// mini router aplication to group endpoints of a domain
const router = Router();

// get a specific resource
router.get("/api/users", authenticateToken, UserController.index);

router.get("/api/users/:id",
    authenticateToken,
    async (req, res) => {
    const userId = req.params.id;
    try {
        const data = await pool.query(`
            select * from users u where u.id = $1
         `, [userId]);
        if(data.rowCount) {
            res.status(200).send(data.rows[0]);
        } else {
            throw new Error("User not found");
        }
    } catch(err) {
        res.status(401).send({msg: err.message});
    }
})
// updates the whole resource, given a specific ID. Overwrites the resource
router.put("/api/users/:id",
    authenticateToken,
    checkSchema(userCreationSchema),
    async (req, res) => {
    const { id: userId } = req.params;
    const { username, displayName, password } = req.body;
    try {
        const { rowCount } = await pool.query(`select * from users u where u.id = $1 `, [userId]);
        if(!rowCount) return res.status(404).json({error: `User with ID ${userId} not found`});
        const result = await pool.query(`
            update users set
                name = $1,
                display_name = $2,
                password = $3
            where id = $4;
            `, [username, displayName, password, userId]);
        return res.status(200).send(`User was updated`);
    } catch(err) {
        return res.status(400).json({error: err.message});
    }
})


// updates a resource partially. For example, a single field of a object.
router.patch("/api/users/:id",
    authenticateToken,
    async (req, res) => {
        const user = await pool.query(`
            update users set 
            `)
    return res.sendStatus(204);
})

// deletes a specific resource, given a ID
router.delete("/api/users/:id", validateUserExistence, (req, res) => {
    const { userIndex } = req;
    users.splice(userIndex, 1);
    return res.sendStatus(200);
})

router.post("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    const { body: item } = req;

    const { cart } = req.session;
    if(cart) {
        cart.push(item)
    } else {
        req.session.cart = [item];
    }

    return res.status(200).send(item);

})

router.get("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    return res.status(200).send(req.session.cart ?? []);

})

module.exports.userRoutes = router;
