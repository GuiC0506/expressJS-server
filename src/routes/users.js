const { Router } = require('express');
const  { query, validationResult, checkSchema, matchedData } = require('express-validator');
const { users } = require("../utils/constants");
const { validateUserExistence, requestLogger, checkAuthentication } = require("../middlewares");
const { userCreationSchema } = require("../utils/validationSchemas");
const passport = require('passport');
const _ = require("../strategies/local-strategy");
const pool = require("../database/db");

// mini router aplication to group endpoints of a domain
const router = Router();

// get a specific resource
router.get("/api/users",
    checkAuthentication,
    async (req, res) => {
        const { rows } = await pool.query(`select * from users;`);
        return res.status(200).json(rows);
});

router.get("/api/users/:id",
    checkAuthentication,
    async (req, res) => {
    const userId = req.params.id;
    try {
        const { rows: user } = await pool.query(`
            select * from users u where u.id = $1
         `, [userId]);
        res.status(200).send(user)
    } catch(err) {
        res.sendStatus(401).send({msg: err});
    }
})

// creates a new resource
router.post("/api/users",
    checkAuthentication,
    checkSchema(userCreationSchema), // body schema validation
    async (req, res) => {
        const validation = validationResult(req);
        if(!validation.isEmpty()) {
            return res.status(400).send({ error: validation.array() });
        }
        
        const data = matchedData(req);
        const { username, displayName, password } = data;
        const result = await pool.query(`
            insert into users (name, display_name, password)
            values ($1, $2, $3);
            `, [username, displayName, password]);
        res.status(201).send(result);
})

// updates the whole resource, given a specific ID. Overwrites the resource
router.put("/api/users/:id",
    validateUserExistence,
    checkSchema(userCreationSchema),
    (req, res) => {
    const { userIndex } = req;
    users[userIndex] = { id: users[userIndex].id, ...req.body};
    return res.sendStatus(204);
})


// updates a resource partially. For example, a single field of a object.
router.patch("/api/users/:id", validateUserExistence, (req, res) => {
    const { userIndex } = req;
    users[userIndex] = { ...users[userIndex], ...req.body };
    return res.sendStatus(204);
})

// deletes a specific resource, given a ID
router.delete("/api/users/:id", validateUserExistence, (req, res) => {
    const { userIndex } = req;
    users.splice(userIndex, 1);
    return res.sendStatus(200);
})

/*router.post("/api/auth", (req, res) => {
    const { body: { username, password } } = req;
    const findUser = users.find(user => (user.password === password) && (user.username === username));
    if(!findUser) {
        return res.status(401).send({msg: "Bad Credentials"})
    }
    req.session.user = findUser;
    res.status(200).send(findUser);
})*/

router.post("/api/login", passport.authenticate("local"), 
    (req, res) => {
    res.sendStatus(200);
})

router.post("/api/auth/logout", (req, res) => {
    if(!req.user) return res.status(401).send("You have not made the login yet.");
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
