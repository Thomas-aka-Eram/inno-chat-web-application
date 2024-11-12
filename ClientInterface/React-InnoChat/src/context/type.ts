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
    updateCurrentChat: (chat: Chat) => Promise<void>;
    fetchMessage: () => Promise<void>;
    sendMessage: (formData: FormData, isFile?: boolean) => Promise<void>;
    deleteChat: (chatId: any) => Promise<void>;
    onlineUsers: any[];
    notification: Notification[];
  }
  