const express = require("express");
const { query, body, validationResult, matchedData, checkSchema } = require("express-validator");
const userCreationSchema = require("./utils/validationSchemas");
const { userRoutes } = require('./routes/users');
const { users } = require('./utils/constants');

const app = express();
const PORT = process.env.PORT || 3333;

const validateUserExistence = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Bad Request");

    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1) return res.status(404).send("Not Found");
    req.userIndex = userIndex;
    next();
}

app.use(
    express.json(),
    // register router
    userRoutes
)


app.get("/", (req, res) => {
    res.status(200).send("Welcome");
})

app.get("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userInfo = users.find(user => user.id == userId);
    if(isNaN(userId)) return res.status(400).send( { msg: "Bad request. Invalid ID" });
    res.status(200).send(userInfo);
})

// creates a new resource
app.post("/api/users", 
    checkSchema(userCreationSchema)
    ,(req, res) => {
    const validation = validationResult(req);
    console.log(validation);
    if(!validation.isEmpty()) {
        return res.status(400).send({ error: validation.array() });
    }
    
    const data = matchedData(req);
    const newUser = { id: users.at(users.length - 1).id + 1, ...data }
    users.push(newUser);
    res.status(201).send(users.at(users.length - 1));
})

// updates the whole resource, given a specific ID. Overwrites the resource
app.put("/api/users/:id", validateUserExistence, (req, res) => {
    const { userIndex } = req;
    users[userIndex] = { id: users[userIndex].id, ...req.body};
    return res.sendStatus(204);
})


// updates a resource partially. For example, a single field of a object.
app.patch("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Bad request.");
    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1) return res.status(404).send("Not Found");

    users[userIndex] = { ...users[userIndex], ...req.body };
    return res.sendStatus(204);
})

// deletes a specific resource, given a ID
app.delete("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Bad Request");
    const userIndex = users.findIndex(user => user.id === userId);

    if(userIndex === -1) return res.status(404).send("Not Found");
    users.splice(userIndex, 1);
    return res.sendStatus(200);
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

