const MessageModel = require("../Model/MessageModel");
const UserModel = require("../Model/UserModel")

const createMessage = async (req, res) => {
    // Logging the request body and file to ensure data is received correctly

    const { chatID, senderID, text } = req.body;
    let fileUrl = null;
    let imageUrl = null;
    let videoUrl = null;

    if (req.file) {
        const mimeType = req.file.mimetype.split('/')[0];
        const fileName = req.file.filename; // Use the filename for URL

        // Construct URLs for the file types
        if (mimeType === 'image') {
            imageUrl = `/uploads/${fileName}`;
        } else if (mimeType === 'video') {
            videoUrl = `/uploads/${fileName}`;
        } else {
            fileUrl = `/uploads/${fileName}`;
        }
    }

    const message = new MessageModel({
        chatID,
        senderID,
        text,
        fileUrl, // Store the file URL
        imageUrl, // Store the image URL
        videoUrl, // Store the video URL
    });

    try {
        const response = await message.save();
        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// const getMessages = async (req, res) => {
//     const { chatID } = req.params;

//     try {
//         const messages = await MessageModel.find({ chatID });
//         res.status(200).json(messages);
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// };

const getMessages = async (req, res) => {
    const { chatID } = req.params;

    try {
        // Fetch messages for the given chatID
        const messages = await MessageModel.find({ chatID }).lean();

        // Fetch sender names for each message
        const populatedMessages = await Promise.all(
            messages.map(async (message) => {
                const sender = await UserModel.findById(message.senderID).select('name').lean();
                return { ...message, senderName: sender.name };
            })
        );

        res.status(200).json(populatedMessages);
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};

module.exports = { createMessage, getMessages };
