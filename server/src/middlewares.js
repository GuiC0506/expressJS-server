const  { users } = require('./utils/constants');
const jwt = require("jsonwebtoken");

const validateUserExistence = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Invalid ID");

    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1) return res.status(404).send("User not found");
    req.userIndex = userIndex;
    req.userId = userId;
    next();
}

const requestLogger = (req, res, next) => {
    const requestMsg = {
        method: req.method,
        url: req.url
    };
    console.log(`${requestMsg.method} - ${requestMsg.url} ${req.user?? ""}`);
    next();
}

const checkAuthentication = (req, res, next) => {
    return req.isAuthenticated() ? next() : res.sendStatus(401);
}

const authenticateToken = (req, res, next) => {
    const token = req.cookies && req.cookies.jwt;
    if(token==null) return res.sendStatus(401).send("Invalid token");

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET,
        (err, user) => {
            if(err) return res.sendStatus(403);
            next();
        }
    );
}

module.exports = { validateUserExistence, requestLogger, checkAuthentication, authenticateToken };
