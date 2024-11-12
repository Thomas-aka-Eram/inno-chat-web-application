import React, { useState, useEffect } from "react";
import { useFetchRecipient } from "../hooks/useFetchRecipient";
import { useChatContext } from "../context/ChatContext";
import "./UserDetails.css"; // Import the CSS file
import defaultIcon from "../assets/undraw_male_avatar_g98d.svg";
import { AddUser } from "./addUser";

interface UserDetailsProps {
  chat: any;
  user: any;
}

export const UserDetails: React.FC<UserDetailsProps> = ({ chat, user }) => {
  const { recipientUser, recipientGroupMembers } = useFetchRecipient(
    chat,
    user
  );
  const { onlineUsers, createGroupChat, chats, deleteChat } = useChatContext();
  const [creategp, setCreategp] = useState(false);
  const [gpName, setGpName] = useState<string>("");
  const [selectedMembers, setSelectedMembers] = useState<string[]>([user?._id]);

  useEffect(() => {
    if (recipientUser?._id && !selectedMembers.includes(recipientUser._id)) {
      setSelectedMembers((prevMembers) => [...prevMembers, recipientUser._id]);
    }
  }, [recipientUser]);

  const isUserOnline = (userId: string) => {
    return onlineUsers.some((onlineUser) => onlineUser.userId === userId);
  };

  const handleCreateGroupChat = () => {
    if (selectedMembers.length >= 2) {
      createGroupChat(selectedMembers, gpName, [user?._id]);
      setGpName("");
      setCreategp(false);
    }
  };

  useEffect(() => {
    setSelectedMembers([user?._id]);
  }, [chat]);

  const addUserToGroup = (userId: string, action: "add" | "remove") => {
    if (action === "add" && !selectedMembers.includes(userId)) {
      setSelectedMembers([...selectedMembers, userId]);
    } else if (action === "remove") {
      setSelectedMembers(selectedMembers.filter((id) => id !== userId));
    }
  };

  const handleGpCreationClick = () => {
    setCreategp((prevState) => !prevState);
  };

  const handleDelete = async () => {
    const response = await deleteChat(chat._id);
  };

  return (
    <div className="UserDetails">
      <div className="userInformation">
        {recipientUser ? (
          <>
            {chat?.isGroupChat ? (
              <div className="groupMembers">
                <ul>
                  {recipientGroupMembers?.members.map((member) => (
                    <li key={member._id}>
                      <div className="memberDetails">
                        <div
                          className="gpimg"
                          style={
                            isUserOnline(member._id)
                              ? { border: "3px solid #3fb950" }
                              : { border: "2px solid white" }
                          }
                        >
                          <img
                            src={defaultIcon}
                            alt={`${member.name}'s profile`}
                          />
                        </div>
                        <span>{member.name}</span>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="user-info">
                <div
                  className="user_img"
                  style={
                    isUserOnline(recipientUser._id)
                      ? { border: "3px solid #3fb950" }
                      : { border: "2px solid white" }
                  }
                >
                  <img className="userimg" src={defaultIcon} alt="" />
                </div>
                <h4 className="user_name">@{recipientUser.name}</h4>
                <h5 className="user_email">{recipientUser.email}</h5>
              </div>
            )}
          </>
        ) : (
          ""
        )}

        <div className="createGPdiv">
          {chat?.isGroupChat ? (
            ""
          ) : (
            <button className="createGP" onClick={handleGpCreationClick}>
              Create Group Chat{creategp ? "⏬" : "🔽"}
            </button>
          )}

          {creategp && (
            <div className="mkdirgp">
              <input
                type="text"
                name="gpname"
                id="gpname"
                value={gpName}
                placeholder="Group Name"
                required
                autoComplete="off"
                onChange={(e) => setGpName(e.target.value)}
              />
              <div className="addUsers">
                <ul>
                  {chats.length > 0 ? (
                    chats.map((chat, index) => (
                      <li key={index}>
                        <AddUser
                          chat={chat}
                          user={user}
                          selectedMembers={selectedMembers}
                          onAddUser={addUserToGroup}
                        />
                      </li>
                    ))
                  ) : (
                    <li>No chats available</li>
                  )}
                </ul>
              </div>
              <button className="creategpbtn" onClick={handleCreateGroupChat}>
                Create
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="interactInformation">
        <button className="deletebtn" onClick={handleDelete}>
          Delete
        </button>
        <button className="blockbtn">Block</button>
      </div>
    </div>
  );
};
