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

app.get("/api/users", (req, res) => {
    res.status(200).send(users);
})

app.get("api/users/:id", (req, res) => {
    console.log(req.params);
    res.send(200);
})

app.get('/api/products', (req, res, next) => {
    res.status(200).send("Products");
    next();
}, (req, res) => {
    console.log("After returning the products to the client side");
});

app.post('/api/users', (req, res, next) => {
    console.log("Before handling the request");
    next();
}, (req, res, next) => {
    console.log(req.body);
    users = [...users, req.body]
    res.status(201).send('Postado com sucesso');
    next();
});

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

