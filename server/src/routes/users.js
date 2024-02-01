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

router.get("/api/users", authenticateToken, UserController.index);
router.get("/api/users/:id", authenticateToken, UserController.getById);
router.patch("/api/users/:id", authenticateToken,
    async (req, res) => {
        const user = await pool.query(`
            update users set 
            `)
    return res.sendStatus(204);
})

// deletes a specific resource, given a ID
router.delete("/api/users/:id", authenticateToken, UserController.delete);

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
