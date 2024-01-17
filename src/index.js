const express = require("express");
const app = express();
const PORT = 3333;

app.get("/grades", (req, res) => {
    res.send([
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
    ])
});

app.listen(PORT, () => {
    console.log(`Express server running on port ${PORT}`);
})

