const { Router } = require('express');
const  { query, validationResult, checkSchema, matchedData } = require('express-validator');
const { users } = require("../utils/constants");
const { validateUserExistence, requestLogger } = require("../middlewares");
const { userCreationSchema } = require("../utils/validationSchemas");

// mini router aplication to group endpoints of a domain
const router = Router();

// get a specific resource
router.get("/api/users",
    query(["filter", "value"]),
    (req, res) => {
        const { query: { filter, value } } = req;
        if(!filter && !value) return res.send(users);
        if(filter && value) {
            const filteredusers = users.filter(user => user[filter].toLowerCase().includes(value.toLowerCase()));
            return res.send(filteredusers)
    }
    return res.send(users);
})

router.get("/api/users/:id", validateUserExistence, (req, res) => {
    const { userId } = req;
    const userInfo = users.find(user => user.id == userId);
    res.status(200).send(userInfo);
})

// creates a new resource
router.post("/api/users", 
    checkSchema(userCreationSchema) // body schema validation
    ,(req, res) => {
    const validation = validationResult(req);
    if(!validation.isEmpty()) {
        return res.status(400).send({ error: validation.array() });
    }
    
    const data = matchedData(req);
    const newUser = { id: users.at(users.length - 1).id + 1, ...data }
    users.push(newUser);
    res.status(201).send(users.at(users.length - 1));
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

module.exports.userRoutes = router;
