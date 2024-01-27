const { Router } = require("express");
const { userRoutes } = require("../routes/users");

const router = Router();

router.use(userRoutes);

module.exports = { router };
