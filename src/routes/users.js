const { Router } = require('express');
const  { query, validationResult } = require('express-validator');
const { users } = require("../utils/constants");

// mini application to group endpoints of a domain
const router = Router();

// get a specific resource
router.get("/api/users", 
    query(["filter", "value"]).
    isString()
    .notEmpty().withMessage("Field cannot be empty.")
    .isLength({ min: 3, max: 15}).withMessage("Field bust be at least 3-10"),
    (req, res) => {
        const result = validationResult(req);
        console.log(result);
        const { query: { filter, value } } = req;
        if(!filter && !value) return res.send(users);
        if(filter && value) {
            const filteredusers = users.filter(user => user[filter].toLowerCase().includes(value.toLowerCase()));
            return res.send(filteredusers)
    }
    return res.send(users);
})

module.exports.userRoutes = router;
