import React, { useContext, useEffect, useState, useRef } from "react";
import { useChatContext } from "../context/ChatContext";
import { UserDetails } from "../Components/UserDetails";
import { ChatList } from "../Components/ChatList";
import { UserContext } from "../context/AuthContext";
import { SearchUsers } from "../Components/SearchUsers";
import PlayOnce from "../Components/ButtPlay";
import ICON from "../assets/system-solid-49-upload-file.json";
import { formatMessageDate } from "../utils/formdata";
import { Player } from "@lordicon/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faSearch,
  faFile,
  faClose,
} from "@fortawesome/free-solid-svg-icons";
import {
  ImperativePanelHandle,
  Panel,
  PanelGroup,
  PanelResizeHandle,
} from "react-resizable-panels";

const Message: React.FC = () => {
  const {
    chats,
    fetchChats,
    updateCurrentChat,
    fetchMessage,
    message,
    currentChats,
    sendMessage,
  } = useChatContext();
  const { user } = useContext(UserContext);
  const [newMessage, setNewMessage] = useState("");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filename, setFilename] = useState("");
  const [currentChat, setCurrentChat] = useState<string>("");
  const [detailschat, setDetailschat] = useState<any | null>(null);
  const userListRef = useRef<ImperativePanelHandle>(null);
  const userDetailsRef = useRef<ImperativePanelHandle>(null);
  const [showuserdetailhandle, setShowuserdetailhandle] = useState(false);
  const [showSearchIcon, setShowSearchIcon] = useState(false);

  useEffect(() => {
    const file = selectedFile?.name || "Undefined";
    setFilename(file);
  }, [selectedFile]);

  const removeSelectedFile = () => {
    setSelectedFile(null);
  };

  const handleCollapseUserList = () => {
    setShowSearchIcon((prevState) => !prevState);
  };
  const userlistexpand = () => {
    const panel = userListRef.current;
    if (panel) {
      panel.expand();
      setShowSearchIcon(false);
    }
  };

  const handleCollapseUserDetails = () => {
    setShowuserdetailhandle((prevState) => !prevState);
  };
  const showUserDetail = () => {
    const panel = userDetailsRef.current;
    if (panel) {
      panel.expand();
      setShowuserdetailhandle(false);
    }
  };

  const handleEnter = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

  // const handleSendMessage = async () => {
  //   if (selectedFile || newMessage) {
  //     const formData = new FormData();
  //     formData.append("chatID", currentChat);
  //     formData.append("senderID", user?._id || "");
  //     formData.append("text", newMessage);

  //     if (selectedFile) {
  //       formData.append("file", selectedFile);
  //     }

  //     await sendMessage(formData, true);
  //     setNewMessage(""); // Clear the input after sending the message
  //     setSelectedFile(null); // Clear the file input
  //   }
  // };

  const handleSendMessage = async () => {
    if (selectedFile || newMessage) {
      const formData = new FormData();
      formData.append("chatID", currentChats?._id || "");
      formData.append("senderID", user?._id || "");
      formData.append("text", newMessage);

      if (selectedFile) {
        formData.append("file", selectedFile);
      }

      console.log(currentChats?.isGroupChat);

      const groupMembers = currentChats?.members || [];
      formData.append("groupMembers", JSON.stringify(groupMembers));
      formData.append(
        "isGroupChat",
        currentChats?.isGroupChat?.toString() || "false"
      );

      await sendMessage(formData, true);
      setNewMessage(""); // Clear the input after sending the message
      setSelectedFile(null); // Clear the file input
    }
  };

  const playerRef = useRef<Player>(null);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  const onhover = () => {
    if (playerRef.current) {
      setTimeout(() => {
        playerRef.current?.playFromBeginning();
      }, 500);
    }
  };

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    fetchChats();
  }, [fetchChats]);

  useEffect(() => {
    fetchMessage();
  }, [fetchMessage]);

  useEffect(() => {
    scrollToBottom();
  }, [message]);

  const handleNotificationReceived = (chatId: string) => {
    // Logic to handle chat highlight or focus based on chatId
    console.log(chatId);
  };

  return (
    <div className="d-flex justify-content-between align-items-center Message-big-container">
      <PanelGroup direction="horizontal">
        <Panel
          maxSize={25}
          minSize={15}
          defaultSize={25}
          collapsible={true}
          collapsedSize={5}
          ref={userListRef}
          id="userlist"
          onCollapse={handleCollapseUserList}
          onExpand={handleCollapseUserList}
        >
          <div className="UserList d-flex-column justify-content-between align-items-center">
            {showSearchIcon ? (
              <div className="searchdivicon">
                <FontAwesomeIcon
                  icon={faSearch}
                  className="searchIcon"
                  onClick={userlistexpand}
                />
              </div>
            ) : (
              <SearchUsers />
            )}

            <ul>
              {chats.length > 0 ? (
                chats.map((chat, index) => (
                  <li
                    key={index}
                    onClick={() => {
                      updateCurrentChat(chat);
                      setCurrentChat(chat._id);
                      setDetailschat(chat);
                    }}
                  >
                    <ChatList
                      chat={chat}
                      user={user}
                      onNotificationReceived={handleNotificationReceived}
                    />
                  </li>
                ))
              ) : (
                <li>No chats available</li>
              )}
            </ul>
          </div>
        </Panel>
        <div className="handlediv">
          <PanelResizeHandle className="resizeHandle" />
        </div>

        <Panel minSize={30}>
          <div className="message-container">
            {currentChat ? (
              <div className="display-message" ref={chatContainerRef}>
                {Array.isArray(message) ? (
                  message.map((msg, index) => (
                    <div
                      key={index}
                      className={
                        showuserdetailhandle || showSearchIcon
                          ? `message ${
                              msg.senderID === user?._id
                                ? "same-side-sender-message"
                                : "same-side-receiver-message"
                            }`
                          : `message ${
                              msg.senderID === user?._id
                                ? "sender-message"
                                : "receiver-message"
                            }`
                      }
                    >
                      <p>{msg.text}</p>
                      {msg.fileUrl &&
                        // Render iframe only if it's a PDF file
                        (msg.fileUrl.toLowerCase().endsWith(".pdf") ||
                        msg.fileUrl.toLowerCase().endsWith(".txt") ? (
                          <iframe
                            src={`http://localhost:5000${msg.fileUrl}`}
                            title="PDF Preview"
                          />
                        ) : (
                          // Otherwise, render a link to view the file
                          <a
                            href={`http://localhost:5000${msg.fileUrl}`}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Download
                          </a>
                        ))}
                      {msg.imageUrl && (
                        <div className="messageImg">
                          <img
                            src={`http://localhost:5000${msg.imageUrl}`}
                            alt="image"
                          />
                        </div>
                      )}
                      {msg.videoUrl && (
                        <video
                          src={`http://localhost:5000${msg.videoUrl}`}
                          controls
                        />
                      )}
                      <div className="messageinfo">
                        <span className="messagedate">
                          {formatMessageDate(msg.createdAt)}
                        </span>
                        <span id="sendername">{msg?.senderName}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>No messages available</p>
                )}
              </div>
            ) : (
              <div className="Nochatselected">
                <h1>Pick a Chat to Chat</h1>
              </div>
            )}

            {currentChat ? (
              <div className="message-input-container">
                {selectedFile ? (
                  <div className="fileSelectedBig">
                    <FontAwesomeIcon icon={faFile} className="fileselected" />
                    <div>{filename}</div>
                    <FontAwesomeIcon
                      icon={faClose}
                      className="fileclose"
                      onClick={removeSelectedFile}
                    />
                  </div>
                ) : (
                  ""
                )}
                <label htmlFor="file" className="file-input-label">
                  <PlayOnce
                    imglink={ICON} // Replace with your actual icon path
                    tsize={50}
                    color="#58a6ff"
                    onComplete={onhover}
                  />
                </label>
                <input
                  type="file"
                  id="file" // Matching the htmlFor attribute of the label
                  name="file"
                  className="file-input"
                  onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                />

                <input
                  type="text"
                  className="message-input"
                  placeholder="Type your message here..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyPress={handleEnter}
                />
                <button className="send-button" onClick={handleSendMessage}>
                  Send
                </button>
              </div>
            ) : (
              ""
            )}
          </div>
        </Panel>
        <div className="handlediv">
          <PanelResizeHandle className="resizeHandle" />
          {showuserdetailhandle ? (
            <button className="handle" onClick={showUserDetail}>
              <FontAwesomeIcon icon={faBars} className="reshowbar" />
            </button>
          ) : (
            ""
          )}
        </div>

        <Panel
          maxSize={25}
          defaultSize={25}
          minSize={15}
          collapsible={true}
          collapsedSize={0}
          ref={userDetailsRef}
          id="userdetails"
          onCollapse={handleCollapseUserDetails}
        >
          <UserDetails chat={detailschat} user={user} />
        </Panel>
      </PanelGroup>
    </div>
  );
};

export default Message;
