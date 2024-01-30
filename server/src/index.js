const express = require("express");
const { router } = require("./routes/index");
const { requestLogger, checkAuthentication } = require("./middlewares");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const passport = require("passport");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3333;
app.use(
    cors({
        origin: "http://localhost:5173",
        credentials: true
    }),
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
    passport.initialize(),
    passport.session(),
    router
)

app.get("/", checkAuthentication, (req, res) => {
    // modifing the session obj, makes express not creating a brand new session obj in every req. Keeps track of the first one
    // basically, sets the cookie with the session ID
    // the req obj always contains the object of the session it was requested.
    res.cookie("data", "hello", { maxAge: 10000, signed: true })
    res.status(200).send("Welcome");
})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

