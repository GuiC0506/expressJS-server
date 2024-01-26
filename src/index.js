const express = require("express");
const { userRoutes } = require('./routes/users');
const { requestLogger } = require("./middlewares");

const app = express();
const PORT = process.env.PORT || 3333;
app.use(
    express.json(),
    requestLogger, 
    userRoutes 
)

app.get("/", (req, res) => {
    res.status(200).send("Welcome");
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

