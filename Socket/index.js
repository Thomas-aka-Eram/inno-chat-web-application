const { Server } = require("socket.io");

const io = new Server({ cors: "http://localhost:5173" });

let onLineUser = [];

io.on("connection", (socket) => {
    console.log("New_connection..", socket.id);

    // Listen for the addNewUser event
    socket.on("addNewUser", (userId) => {
        if (!onLineUser.some((user) => user.userId === userId)) {
            onLineUser.push({ userId, socketId: socket.id });
            console.log("onlineuser", onLineUser);
            io.emit("getOnlineUsers", onLineUser);
        }
    });

    socket.on("sendMessage", (message) => {

        // Access `isGroupChat` from `currentChats`
        const isGroupChat = message.currentChats.isGroupChat;

        if (isGroupChat) {
            console.log("GPCHAT");

            // Access `groupMembers` from `currentChats`
            const groupMembers = message.currentChats.members;

            // Filter online users who are part of the group chat
            console.log(onLineUser)
            const group = onLineUser.filter((user) => groupMembers.includes(user.userId));
            console.log(onLineUser, "online user");
            group.forEach((user) => {
                if (user.userId !== message.senderID) {
                    io.to(user.socketId).emit("getMessage", message);
                    io.to(user.socketId).emit("getNotification", {
                        senderId: message.senderID,
                        isRead: false,
                        date: new Date(),
                    });
                }
            });
        } else {
            // Handle private messages
            const user = onLineUser.find((user) => user.userId === message.recipientUserID);
            if (user) {
                io.to(user.socketId).emit("getMessage", message);
                io.to(user.socketId).emit("getNotification", {
                    senderId: message.senderID,
                    isRead: false,
                    date: new Date(),
                });
            } else {
                console.log("User is offline");
            }
        }
    });


    // Handle disconnection
    socket.on("disconnect", () => {
        console.log("User disconnected", socket.id);
        onLineUser = onLineUser.filter((user) => user.socketId !== socket.id);
        io.emit("getOnlineUsers", onLineUser);
    });
});

io.listen(8000);
