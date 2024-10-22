const express = require("express");
const userController = require("../controllers/userController");

const router = express.Router();

router.post("/", userController.createUser);
router.get("/:id", userController.getUserById);
router.put("/:id", userController.updateUser);
router.post("/delete", userController.deleteUser);
router.get("/", userController.getAllUsers);

module.exports = router;
