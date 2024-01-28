const { Router } = require("express");
const { userRoutes } = require("../routes/users");
const { auth } = require("../routes/auth");

const router = Router();

router.use(userRoutes);
router.use(auth);

module.exports = { router };
