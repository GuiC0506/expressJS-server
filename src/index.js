const express = require("express");
const { router } = require("./routes/index");
const { requestLogger } = require("./middlewares");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const { users } = require("./utils/constants");

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

app.post("/api/auth", (req, res) => {
    const { body: { username, password } } = req;
    const findUser = users.find(user => (user.password === password) && (user.username === username));
    if(!findUser) {
        return res.status(401).send({msg: "Bad Credentials"})
    }
    req.session.user = findUser;
    res.status(200).send(findUser);
})

app.get("/api/auth/status", (req, res) => {
    req.sessionStore.get(req.sessionID, (err, session) => {
        console.log(session);
        console.log(req.sessionID);
    });
    if(!req.session.user) {
        return res.status(401).send("Not authenticated")
    }
    res.status(200).send(req.session.user);
})

app.post("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    const { body: item } = req;

    const { cart } = req.session;
    if(cart) {
        cart.push(item)
    } else {
        req.session.cart = [item];
    }

    return res.status(200).send(item);

})

app.get("/api/cart", (req, res) => {
    if(!req.session.user) return res.sendStatus(401);
    return res.status(200).send(req.session.cart ?? []);

})

app.listen(PORT, () => {
    console.log(`server running on port ${PORT}`);
})

