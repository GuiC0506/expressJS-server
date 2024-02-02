const { Router } = require("express");
const { authenticateToken } = require("../middlewares");
const Department = require("../models/Department");
const DepartmentController = require("../controllers/DepartmentController");

const router = Router();

router.get("/api/departments", DepartmentController.index);
router.post("/api/departments", DepartmentController.store);
router.delete("/api/departments/:id", DepartmentController.delete);


module.exports = router;
