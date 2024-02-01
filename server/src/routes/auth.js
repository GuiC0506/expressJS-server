const { Router } = require("express")
const { authenticateToken } = require("../middlewares");
const AuthController = require("../controllers/AuthController");

const router = Router();

// authorization via session: information about user is stored in the server, in the session store.
// subsequent requests, sends a session ID to the server, and then the server checks if that ID is in the session store

// authorization via jwt: information about user is stored in the client, together with the token.
router.post("/api/login", AuthController.login);
router.post("/api/auth/logout", authenticateToken, AuthController.logout);

module.exports.auth = router;
