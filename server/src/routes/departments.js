const { Router } = require("express");
const { authenticateToken } = require("../middlewares");
const Department = require("../models/Department");

const router = Router();

router.get("/api/departments",
    authenticateToken,
    async (req, res) => {
        const departments = await Department.findAll();
        return res.status(200).json(departments);
    }
)

module.exports = router;
