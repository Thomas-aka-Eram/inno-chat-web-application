const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
    chatID: { type: String, required: true },
    senderID: { type: String, required: true },
    text: { type: String, required: false },
    imageUrl: { type: String, required: false },
    fileUrl: { type: String, required: false },
    videoUrl: { type: String, required: false }
}, {
    timestamps: true
});

const MessageModel = mongoose.model("Message", messageSchema);
module.exports = MessageModel;
