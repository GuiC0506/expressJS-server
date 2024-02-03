const { Router } = require("express");
const ProjectController = require("../controllers/ProjectController");

const router = Router();

router.post("/api/:owner_id/projects/", ProjectController.store);
router.get("/api/projects/:id", ProjectController.index);
router.delete("/api/users/:owner_id/projects", ProjectController.delete);

module.exports = router;
