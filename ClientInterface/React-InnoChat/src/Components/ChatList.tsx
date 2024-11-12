import React, { useCallback, useEffect, useState } from "react";
import { useFetchRecipient } from "../hooks/useFetchRecipient";
import { useChatContext } from "../context/ChatContext";
import defaultIcon from "../assets/undraw_male_avatar_g98d.svg";
import { baseUrl, getRequest } from "../utils/services";
import { formatMessageDate } from "../utils/formdata";

interface ChatListProps {
  chat: any;
  user: any;
  onNotificationReceived: (chatId: string) => void; // Add callback prop
}

export const ChatList: React.FC<ChatListProps> = ({
  chat,
  user,
  onNotificationReceived,
}) => {
  const { recipientUser, error } = useFetchRecipient(chat, user);
  const { onlineUsers, notification } = useChatContext();
  const [latest, setLatest] = useState<any[]>([]);
  const [isHighlighted, setIsHighlighted] = useState<boolean>(false);
  console.log(notification);

  const isUserOnline = (userId: any) => {
    return onlineUsers.some((onlineUser) => onlineUser.userId === userId);
  };

  const fetchMessage = useCallback(async () => {
    try {
      if (chat?._id) {
        const response = await getRequest(`${baseUrl}/messages/${chat?._id}`);
        setLatest(response);
      }
    } catch (error) {
      console.log("Failed to fetch message");
    }
  }, [chat]);

  useEffect(() => {
    fetchMessage();
  }, [chat]);

  useEffect(() => {
    const newNotification = notification.find(
      (notif) => notif.senderId === recipientUser?._id
    );
    if (newNotification) {
      setIsHighlighted(true);
      onNotificationReceived(chat._id); // Notify parent component
    }
  }, [notification, recipientUser, chat._id, onNotificationReceived]);

  const isOnline = onlineUsers.some(
    (onlineUser) => onlineUser.userId === recipientUser?._id
  );

  if (error) {
    return <li>Error loading recipient</li>;
  }

  const ltMessage = latest.reduce((prev, current) => {
    return new Date(current.createdAt) > new Date(prev.createdAt)
      ? current
      : prev;
  }, latest[0]);

  return (
    <button
      className={`User container d-flex justify-content-between align-items-center ${
        isHighlighted ? "highlighted" : ""
      }`}
      onClick={() => setIsHighlighted(false)} // Clear highlight on click
    >
      <div
        className="User-Icon"
        style={
          isUserOnline(recipientUser?._id)
            ? { border: "3px solid #3fb950" }
            : { border: "2px solid white" }
        }
      >
        <img src={defaultIcon} alt="User Icon" className="user-img" />
      </div>
      <div className="User-name-preview">
        <h4>
          {recipientUser?.name || "Unknown"}
          {isOnline && <span className="online-indicator"></span>}
        </h4>
        <h5>{ltMessage?.text || "No messages yet"}</h5>
      </div>
      <div className="send-time text-end">
        <span>
          {ltMessage?.createdAt
            ? formatMessageDate(ltMessage.createdAt)
            : "No time"}
        </span>
      </div>
    </button>
  );
};
