const { Router } = require("express");
const ProjectController = require("../controllers/ProjectController");

const router = Router();

router.post("/api/:owner_id/projects/", ProjectController.store);
router.get("/api/projects/:id", ProjectController.index);

module.exports = router;
