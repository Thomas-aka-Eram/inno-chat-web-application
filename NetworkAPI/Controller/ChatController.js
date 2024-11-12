const chatModel = require("../Model/ChatModel");

// Create or retrieve a one-on-one chat
const createChat = async (req, res) => {
    const { firstID, secondID } = req.body;

    try {
        const chat = await chatModel.findOne({
            members: { $all: [firstID, secondID] },
            isGroupChat: false
        });

        if (chat) return res.status(200).json(chat);

        const newChat = new chatModel({
            members: [firstID, secondID],
            isGroupChat: false
        });

        const response = await newChat.save();
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Create a new group chat
const createGroupChat = async (req, res) => {
    const { memberIDs, groupName, adminIDs } = req.body;
    console.log({ memberIDs, groupName, adminIDs })

    if (!Array.isArray(memberIDs) || memberIDs.length < 2) {
        return res.status(400).json({ message: "memberIDs should be an array with at least two members." });
    }

    try {
        const newChat = new chatModel({
            members: memberIDs,
            isGroupChat: true,
            groupName: groupName || "Unnamed Group",
            admins: adminIDs || []
        });

        const response = await newChat.save();
        res.status(200).json(response);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Add members to an existing group chat
const addMembersToChat = async (req, res) => {
    const { chatId, newMembers } = req.body;

    if (!Array.isArray(newMembers) || newMembers.length === 0) {
        return res.status(400).json({ message: "newMembers should be a non-empty array." });
    }

    try {
        const chat = await chatModel.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat not found." });

        // Ensure it's a group chat
        if (!chat.isGroupChat) {
            return res.status(400).json({ message: "Cannot add members to a one-on-one chat." });
        }

        // Add new members to the chat
        chat.members = [...new Set([...chat.members, ...newMembers])]; // Avoid duplicates
        const updatedChat = await chat.save();

        res.status(200).json(updatedChat);

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", error });
    }
};

// Find all chats for a user (one-on-one and group chats)
const findUserChats = async (req, res) => {
    const userId = req.params.userId;

    try {
        const chats = await chatModel.find({
            members: {
                $in: [userId]
            }
        });

        res.status(200).json(chats);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Find a specific chat
const findChat = async (req, res) => {
    const { firstID, secondID } = req.params;

    try {
        const chat = await chatModel.findOne({
            members: {
                $all: [firstID, secondID]
            }
        });

        res.status(200).json(chat);
    } catch (error) {
        console.log(error);
        res.status(500).json(error);
    }
};

// Function to delete a chat
const deleteChat = async (req, res) => {
    const { chatID } = req.params;

    try {
        // Find the chat by its ID and delete it
        const chat = await chatModel.findByIdAndDelete(chatID);

        if (!chat) {
            return res.status(404).json({ message: 'Chat not found' });
        }

        res.status(200).json({ message: 'Chat deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createChat, createGroupChat, addMembersToChat, findUserChats, findChat, deleteChat };
