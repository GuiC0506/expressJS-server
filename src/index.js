const express = require("express");
const { router } = require("./routes/index");
const { requestLogger } = require("./middlewares");
const cookieParser = require("cookie-parser");

const app = express();
const PORT = process.env.PORT || 3333;
app.use(
    express.json(),
    requestLogger, 
    cookieParser("secret"),
    router
)

app.get("/", (req, res) => {
    // piece of data send to the client from the server in this request
    res.cookie("data", "hello", { maxAge: 10000, signed: true })
    res.status(200).send("Welcome");
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

