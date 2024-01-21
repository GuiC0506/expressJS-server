const express = require("express");
const app = express();
const PORT = process.env.PORT || 3333;

const validataUserExistence = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Bad Request");

    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1) return res.status(404).send("Not Found");
    req.userIndex = userIndex;
    next();
}

app.use(
    express.json()
)

var users = [
    { id: 1, username: "Churros", displayName: "Churros" },
    { id: 2, username: "Shoyou", displayName: "Shoyou" },
    { id: 3, username: "Guilherme", displayName: "Guilherme" }
]

app.get("/", (req, res) => {
    res.status(200).send("Welcome");
})

// get a specific resource
app.get("/api/users", (req, res) => {
    const { query: { filter, value } } = req;
    if(!filter && !value) return res.send(users);
    if(filter && value) {
        const filteredusers = users.filter(user => user[filter].toLowerCase().includes(value.toLowerCase()));
        res.send(filteredusers)
    }

    return res.send(users);
})

app.get("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    const userInfo = users.find(user => user.id == userId);
    if(isNaN(userId)) return res.status(400).send( { msg: "Bad request. Invalid ID" });
    res.status(200).send(userInfo);
})

// creates a new resource
app.post("/api/users", (req, res) => {
    req.body = { id: users.at(users.length - 1).id + 1, ...req.body }
    users.push(req.body);
    res.status(201).send(users.at(users.length - 1));
})

// updates the whole resource, given a specific ID. Overwrites the resource
app.put("/api/users/:id", validataUserExistence, (req, res) => {
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

