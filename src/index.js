const express = require("express");
const app = express();
const PORT = 3333;

app.use(
    express.json(),
    express.urlencoded(),
);

app.get("/", (req, res) => {
    res.status(200).send('Welcome');
})


var grades = [
    {
        item: "milk",
        quantity: 1
    },
    {
        item: "cereal",
        quantity: 2
    },
    {
        item: 'lettuce',
        quantity: 1
    }
]


app.get("/groceries", (req, res) => {
    res.status(200).send(grades)
});

app.post('/groceries', (req, res) => {
    grades = [...grades, req.body]
    res.status(201).send('Postado com sucesso');
})

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
})

