const mongoose = require("mongoose");
const MessageModel = require('./MessageModel'); // Adjust the path as necessary

const chatSchema = new mongoose.Schema(
    {
        members: {
            type: [mongoose.Schema.Types.ObjectId],
            ref: 'User',
            required: true
        },
        isGroupChat: {
            type: Boolean,
            default: false
        },
        groupName: {
            type: String,
            trim: true
        },
        admins: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }]
    },
    {
        timestamps: true,
    }
);

// Middleware to delete messages associated with the chat
chatSchema.pre('findOneAndDelete', async function (next) {
    const chatID = this.getQuery()._id;

    try {
        await MessageModel.deleteMany({ chatID });
        next();
    } catch (error) {
        next(error);
    }
});

const chatModel = mongoose.model("Chat", chatSchema);
module.exports = chatModel;
