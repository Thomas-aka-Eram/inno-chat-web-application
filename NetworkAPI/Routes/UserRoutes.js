const express = require("express");
const router = express.Router();
const { registerUser, loginUser, findUser, getUsers, searchUsers, updateUser } = require("../Controller/UserController");

router.post("/register", registerUser);
router.post("/loginUser", loginUser);
router.get("/find/:userId", findUser);
router.get("/getUsers", getUsers);
router.get("/search-users", searchUsers)
router.put("/update/:userId", updateUser)

module.exports = router;
