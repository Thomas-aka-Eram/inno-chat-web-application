import React, {
  createContext,
  useState,
  useContext,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import { io, Socket } from "socket.io-client";
import {
  baseUrl,
  getRequest,
  postRequest,
  deleteRequest,
} from "../utils/services";
import { useFetchRecipient } from "../hooks/useFetchRecipient";

// types.ts
export interface Message {
  id: string;
  chatId: string;
  senderID: string;
  senderName: string;
  text: string;
  fileUrl: string;
  imageUrl: string;
  videoUrl: string;
  createdAt: Date;
}

export interface Notification {
  senderId: string;
  message: string;
  isRead: boolean;
}

export interface Chat {
  _id: string;
  members: string[];
  messages: Message[];
  isGroupChat: boolean;
  groupName?: string;
  admins?: string[];
}

export interface ChatContextType {
  chats: Chat[];
  message: Message[];
  fetchChats: () => Promise<void>;
  latestMessage: Message | null;
  createGroupChat: (
    memberIDs: string[],
    groupName: string,
    adminIDs?: string[]
  ) => Promise<void>;
  addMembersToChat: (chatId: string, newMembers: string[]) => Promise<void>;
  createChat: (secondID: string) => Promise<void>;
  updateCurrentChat: (chat: Chat) => void;
  fetchMessage: () => Promise<void>;
  sendMessage: (formData: FormData, isFile?: boolean) => Promise<void>;
  deleteChat: (chatId: string) => Promise<void>;
  onlineUsers: any[];
  notification: Notification[];
  currentChats: Chat | null;
}

export const defaultChatContext: ChatContextType = {
  chats: [],
  message: [],
  fetchChats: async () => {},
  latestMessage: null,
  createGroupChat: async () => {},
  addMembersToChat: async () => {},
  createChat: async () => {},
  updateCurrentChat: () => {},
  fetchMessage: async () => {},
  deleteChat: async () => {},
  sendMessage: async () => {},
  currentChats: null,
  onlineUsers: [],
  notification: [],
};

// Define the type for the props of ChatProvider
interface ChatProviderProps {
  children: ReactNode;
  user: any;
}

export const ChatContext = createContext<ChatContextType>(defaultChatContext);

export const ChatProvider: React.FC<ChatProviderProps> = ({
  children,
  user,
}) => {
  const [chats, setChats] = useState<Chat[]>([]);
  const [currentChats, setCurrentChat] = useState<Chat | null>(null);
  const [message, setMessage] = useState<Message[]>([]);
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<any[]>([]);
  const [newMessage, setNewMessage] = useState<Message | []>([]);
  const [latestMessage, setLatestMessage] = useState<Message | null>(null);
  const { recipientUser } = useFetchRecipient(currentChats, user);
  const [notification, setNotification] = useState<Notification[]>([]);

  useEffect(() => {
    const newSocket: Socket = io("http://localhost:8000");
    setSocket(newSocket);

    return () => {
      newSocket.close(); // Clean up the socket connection when the component unmounts
    };
  }, [user]);

  //adding user
  useEffect(() => {
    if (!socket) return;

    socket.emit("addNewUser", user?._id);

    socket.on("getOnlineUsers", (res) => {
      setOnlineUsers(res);
    });

    return () => {
      socket.off("getOnlineUsers"); // Clean up the event listener
    };
  }, [socket, user]);

  //realtime chat
  useEffect(() => {
    if (!socket) return;
    const recipientUserID = recipientUser?._id;

    socket.emit("sendMessage", {
      ...newMessage,
      recipientUserID,
      currentChats,
    });
  }, [newMessage]);

  //recieve message
  useEffect(() => {
    if (!socket) return;

    socket.on("getMessage", (res) => {
      if (currentChats?._id !== res.chatID) return;

      setMessage((prevMessages) => {
        if (Array.isArray(res)) {
          return [...prevMessages, ...res];
        } else {
          return [...prevMessages, res];
        }
      });
    });

    socket.on("getNotification", (res: Notification) => {
      const isChatOpen = currentChats?.members.some(
        (id) => id === res.senderId
      );

      if (isChatOpen) {
        setNotification((prev: Notification[]) => [
          { ...res, isRead: true },
          ...prev,
        ]);
      } else {
        setNotification((prev) => [res, ...prev]);
      }
    });

    return () => {
      socket.off("getMessage");
      socket.off("getNotification");
    };
  }, [socket, currentChats, newMessage]);

  //update deleted chats
  useEffect(() => {
    if (!socket) return;

    socket.on("chatDeleted", (deletedChatId: string) => {
      setChats((prevChats) =>
        prevChats.filter((chat) => chat._id !== deletedChatId)
      );
    });

    return () => {
      socket.off("chatDeleted");
    };
  }, [chats]);

  const fetchChats = useCallback(async () => {
    try {
      if (user?._id) {
        const response = await getRequest(`${baseUrl}/chats/${user?._id}`);
        setChats(response);
      }
    } catch (error) {
      console.log("Failed to fetch chats:", error);
    }
  }, [user]);

  const fetchMessage = useCallback(async () => {
    try {
      if (currentChats?._id) {
        const response = await getRequest(
          `${baseUrl}/messages/${currentChats?._id}`
        );
        setMessage(response);
      } else {
      }
    } catch (error) {
      console.log("Failed to fetch message");
    }
  }, [currentChats]);

  const updateCurrentChat = useCallback(async (chat: Chat) => {
    setCurrentChat(chat);
  }, []);

  const createChat = useCallback(
    async (secondID: string) => {
      // Check if the chat already exists
      if (chats.some((chat) => chat.members.includes(secondID))) {
        console.log("Chat already exists with this user.");
        return;
      }

      const url = `${baseUrl}/chats`;
      const body = {
        firstID: user?._id,
        secondID: secondID,
      };

      try {
        const response = await postRequest(url, body);

        if (response.error) {
          console.error("Error creating chat:", response.error);
        } else {
          const newChat: any = response;
          setChats((prevChats) => [...prevChats, newChat]);
        }
      } catch (error) {
        console.error("Failed to create chat:", error);
      }
    },
    [user, chats]
  );

  const createGroupChat = useCallback(
    async (memberIDs: string[], groupName: string, adminIDs: string[] = []) => {
      try {
        await postRequest(`${baseUrl}/chats/gpchat`, {
          memberIDs,
          groupName,
          adminIDs,
        });
        await fetchChats();
      } catch (error) {
        console.log("Failed to create group chat:", error);
      }
    },
    [fetchChats]
  );

  const addMembersToChat = useCallback(
    async (chatId: string, newMembers: string[]): Promise<void> => {
      try {
        await postRequest(`${baseUrl}/chats/add-members`, {
          chatId,
          newMembers,
        });
        await fetchChats();
      } catch (error) {
        console.log("Failed to add members to chat:", error);
      }
    },
    [fetchChats]
  );

  const sendMessage = useCallback(
    async (formData: FormData, isFile = false) => {
      try {
        const response = await postRequest(
          `${baseUrl}/messages`,
          formData,
          isFile
        );
        await fetchMessage(); // Fetch messages again after sending one
        setNewMessage(response);
      } catch (error) {
        console.log("Failed to send message:", error);
      }
    },
    [fetchMessage]
  );

  const deleteChat = async (chatId: string) => {
    const url = `${baseUrl}/chats/chat/deletechat/${chatId}`;
    const response = await deleteRequest(url, {});

    if (response.error) {
      console.error("Failed to delete chat:", response.message);
    } else {
      // Notify other clients via WebSocket that the chat is deleted
      if (socket) {
        socket.emit("chatDeleted", chatId);
        console.log("rel");
      }
      console.log("Chat deleted successfully");
    }
  };

  return (
    <ChatContext.Provider
      value={{
        chats,
        message,
        currentChats,
        fetchMessage,
        latestMessage,
        fetchChats,
        createGroupChat,
        addMembersToChat,
        createChat,
        updateCurrentChat,
        sendMessage,
        deleteChat,
        onlineUsers,
        notification,
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChatContext = () => useContext(ChatContext);
