const  { users } = require('./utils/constants');

const validateUserExistence = (req, res, next) => {
    const userId = parseInt(req.params.id);
    if(isNaN(userId)) return res.status(400).send("Invalid ID");

    const userIndex = users.findIndex(user => user.id === userId);
    if(userIndex === -1) return res.status(404).send("User not found");
    req.userIndex = userIndex;
    req.userId = userId;
    next();
}

module.exports = { validateUserExistence };
