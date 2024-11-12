const express = require("express")
const { createChat, createGroupChat, findUserChats, findChat, deleteChat } = require("../Controller/ChatController")
const router = express.Router();

router.post("/", createChat);
router.post("/gpchat", createGroupChat)
router.get("/:userId", findUserChats);
router.get("/find/:firstID/:secondID", findChat);
router.delete("/chat/deletechat/:chatID", deleteChat)


module.exports = router;