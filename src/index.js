const express = require("express");
const app = express();
const PORT = 3333;

app.use(
    express.json(),
    express.urlencoded(),
);

app.get("/", (req, res) => {
    res.send('<h2>welcome user</h2>');
})


var grades = [
    {
        name: 'Churros',
        class: 'A',
        grade: 8
    },
    {
        name: 'Shoyou',
        class: 'B',
        grade: 6
    },
    {
        name: 'Bela',
        class: 'C',
        grade: 9

    }
]


app.get("/grades", (req, res) => {
    res.send(grades)
});

app.post('/grades', (req, res) => {
    grades = [...grades, req.body]
    res.statusCode = 201
    res.send('Postado com sucesso');
})

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
})

