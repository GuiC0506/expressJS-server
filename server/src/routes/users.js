const { Router } = require('express');
const { validateUserExistence, requestLogger, checkAuthentication, authenticateToken } = require("../middlewares");
const passport = require('passport');
const pool = require("../database/db");
const UserController = require('../controllers/UserController');

// mini router aplication to group endpoints of a domain
const router = Router();

router.get("/api/users", authenticateToken, UserController.index);
router.get("/api/users/:id", authenticateToken, UserController.getById);
router.patch("/api/users/:id", authenticateToken, UserController.edit);
router.delete("/api/users/:id", authenticateToken, UserController.delete);
router.post("/api/register", UserController.store);

module.exports.userRoutes = router;
