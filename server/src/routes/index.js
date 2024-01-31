const { Router } = require("express");
const { userRoutes } = require("../routes/users");
const { auth } = require("../routes/auth");
const deparmentRoutes = require("../routes/departments");

const router = Router();

router.use(userRoutes);
router.use(auth);
router.use(deparmentRoutes);

module.exports = { router };
