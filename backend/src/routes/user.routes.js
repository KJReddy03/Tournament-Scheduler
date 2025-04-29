const express = require("express");
const router = express.Router();
const { auth } = require("../middleware/auth.middleware");
const { getAllUsers } = require("../controllers/admin.controller");

router.get("/", auth, getAllUsers);

module.exports = router;
