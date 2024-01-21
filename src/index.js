const express = require("express");
const app = express();
const PORT = process.env.PORT || 3333;

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
        const filteredusers = users.filter(user => user[filter].includes(value));
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
    req.body = {...req.body, id: users.at(users.length - 1).id + 1}
    users.push(req.body);
    res.status(201).send(users.at(users.length - 1));
})

// updates the whole resource, given a specific ID. Overwrites the resource
app.put("/api/users/:id", (req, res) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Bad Request");

    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1) return res.status(404).send("Not Found");
    users[userIndex] = { id: userId, ...req.body};
    return res.sendStatus(204);
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

