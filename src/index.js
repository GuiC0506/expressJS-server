const express = require("express");
const { router } = require("./routes/index");
const { requestLogger } = require("./middlewares");
const cookieParser = require("cookie-parser");
const session = require("express-session");

const app = express();
const PORT = process.env.PORT || 3333;
app.use(
    express.json(),
    requestLogger, 
    cookieParser("secret"),
    session({
        secret: "churros", // to sign the cookie
        saveUninitialized: false,
        resave: false,
        cookie: {
            maxAge: 60000 * 60
        }
    }),
    router
)

app.get("/", (req, res) => {
    // modifing the session obj, makes express not creating a brand new session obj in every req. Keeps track of the first one
    // basically, sets the cookie with the session ID
    // the req obj always contains the object of the session it was requested.
    res.cookie("data", "hello", { maxAge: 10000, signed: true })
    req.session.test = "x;"
    res.status(200).send("Welcome");
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

