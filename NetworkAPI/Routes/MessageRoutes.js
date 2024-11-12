const express = require('express');
const router = express.Router();
const { createMessage, getMessages } = require("../Controller/MessageController");
const multer = require('multer');
const path = require('path');

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const upload = multer({ storage });

// Use multer middleware for handling file uploads
router.post("/", upload.single('file'), createMessage);
router.get("/:chatID", getMessages);

module.exports = router;
