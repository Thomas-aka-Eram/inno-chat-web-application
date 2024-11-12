import React from "react";
import { useFetchRecipient } from "../hooks/useFetchRecipient";

interface AddUserProps {
  chat: any;
  user: any;
  onAddUser: (userId: string, action: "add" | "remove") => void; // Update type definition
  selectedMembers: any; // New prop to receive selected members
}

export const AddUser: React.FC<AddUserProps> = ({
  chat,
  user,
  onAddUser,
  selectedMembers,
}) => {
  const { recipientUser } = useFetchRecipient(chat, user);

  const handleClick = () => {
    if (recipientUser) {
      if (selectedMembers.includes(recipientUser._id)) {
        // Remove the user from the selected members
        onAddUser(recipientUser._id, "remove");
      } else {
        // Add the user to the selected members
        onAddUser(recipientUser._id, "add");
      }
    }
  };

  if (chat?.isGroupChat) {
    return null; // Don't render anything if it's a group chat
  }

  const isSelected = selectedMembers.includes(recipientUser?._id);

  return (
    <div
      className={`userlist ${isSelected ? "selected" : ""}`}
      onClick={handleClick}
    >
      <div className="user">{recipientUser?.name}</div>
    </div>
  );
};
