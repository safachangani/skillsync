import React, { useEffect, useRef, useState } from "react";
import { FaMoon, FaSun, FaPlus, FaPhone, FaVideo, FaSmile, FaPaperclip, FaPaperPlane } from "react-icons/fa";
import "./messages.css"
import axios from "../../axios";
import { io } from 'socket.io-client'
import noChat from '../../assets/no-chat.svg'

const socket = io("http://localhost:9000")
const Messages = () => {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [selectedPartner, setSelectedPartner] = useState(null)
  const [partners, setPartners] = useState([]);
  const [myId, setMyId] = useState('');
  const [messageHistory, setMessageHistory] = useState([])
  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };
  console.log(selectedPartner);

  useEffect(() => {

    const fetchPartners = async () => {
      try {

        const token = localStorage.getItem('user-token');
        const response = await axios.get('/get-partners', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        console.log("partners", response);
        setPartners(response.data.partnerData);
        setMyId(response.data.myId);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();


    const handleReceiveMessage = (data) => {
      console.log("i am listening you idiot", data);

      const newMsg = {
        senderId: data.from,
        receiverId: myId,
        content: data.message,
        fileUrl: data.fileUrl || null,
        fileType: data.fileType || null,
        createdAt: data.createdAt
      };

      setMessageHistory((prev) => [...prev, newMsg]);
    };
    const handleDisconnect = () => {
      console.log("disconnected from server");
    }
    // socket.on("connect",handleConnect)
    socket.on('receive_message', handleReceiveMessage)
    socket.on("disconnect", handleDisconnect)
    return () => {
      // socket.off("connect",handleConnect);
      socket.off("disconnect", handleDisconnect)
      socket.off("receive_message", handleReceiveMessage)
    }


  }, [])

  // Second useEffect: wait for myId and emit join
  useEffect(() => {
    if (myId) {
      socket.emit("join", myId);
      console.log("joined", myId);
    }
  }, [myId]);

  return (
    <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        {isDarkTheme ? <FaSun /> : <FaMoon />}
      </button>

      <div className="chat-container">
        {/* User List */}
        <UserList partners={partners} onSelect={setSelectedPartner} setMessageHistory={setMessageHistory} />

        {/* Chat Section */}
        <ChatSection selectedPartner={selectedPartner} myId={myId} messageHistory={messageHistory} setMessageHistory={setMessageHistory} />
      </div>
    </div>
  );
};


const UserList = ({ partners, onSelect, setMessageHistory }) => {

  async function handleSelectPartner(partner) {
    onSelect(partner)
    try {
      const token = localStorage.getItem('user-token');
      const response = await axios.get(`/get-message-history/${partner.partnerProfile.userId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log("message history ", response);
      setMessageHistory(response.data)

    } catch (err) {
      console.log(err);

    }
  }

  return (
    <div className="user-list">
      <div className="user-header">
        <h1>Messages</h1>
        <button className="new-chat-btn">
          <FaPlus />
        </button>
      </div>
      <div className="users">
        {partners.map((partner) => {
          return (


            <div className="user-item active" key={partner._id} onClick={() => {
              handleSelectPartner(partner)

            }}>
              <img alt={partner.partnerProfile.username} src={`http://localhost:9000/skillsync/uploads/${partner.partnerProfile.filename}`} className="user-avatar" />
              <div className="user-info">
                <div className="user-name">{partner.partnerProfile.username}</div>
   <p className="skills">
  {partner.partnerProfile.skills && partner.partnerProfile.skills.length > 0
    ? partner.partnerProfile.skills
        .map(skill => `${skill.name} (${skill.level})`)
        .join(', ')
    : 'No skills listed'}
</p>



                <div className="user-post-title">{partner.postTitle}</div>
              </div>
            </div>

          )
        })}
      </div>
      {/* Add more users here */}
    </div>
  );
};

const ChatSection = ({ selectedPartner, myId, messageHistory, setMessageHistory }) => {
  // console.log("sele",selectedPartner);

  const [newMessage, setNewMessage] = useState("")
  const [messages, setMessages] = useState([])
  const [selectFile, setSelectFile] = useState(null)
  const fileRef = useRef(null)
  let lastDate = null
  // console.log(newMessage);
  const handleMessage = async () => {
    const now = new Date()
    if (!newMessage.trim() && !selectFile) return;

    let fileUrl = null;
    let fileType = null;
    if (selectFile) {
      const formData = new FormData();
      formData.append("file", selectFile);
      // console.log("file",selectFile,formData);

      for (let pair of formData.entries()) {
        console.log("meee", pair[0], pair[1]);
      }
      try {
        const res = await axios.post("/upload", formData, {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        });
        console.log(res);

        fileUrl = res.data.fileUrl;
        fileType = selectFile.type.startsWith("image/") ? "image" : "file";
      } catch (err) {
        console.error("File upload failed", err);
        return;
      }
    }
    socket.emit('private_message', {
      recipientId: selectedPartner.partnerProfile.userId,
      senderId: myId,
      message: newMessage,
      fileUrl,
      fileType,
      createdAt: now
    });
    setNewMessage('');
    setSelectFile(null);
    
  }
  const handleFile = (e) => {
    console.log("hello", e.target.files[0]);
    const file = e.target.files[0]
    setSelectFile(file)
  }
  const openFileDialog = () => {
    fileRef.current.click()
  }
  
 if (!selectedPartner) {
  return (
    <div className="chat-empty-state">
      <img src={noChat} alt="Start chatting" className="empty-illustration" />
      <h2>No Conversation Selected</h2>
      <p>Select a user from the list to start chatting.</p>
    </div>
  );
}


  return (

    <div className="chat-section">
      <div className="chat-header">
        <img src={`http://localhost:9000/skillsync/uploads/${selectedPartner.partnerProfile.filename}`} alt="User" className="user-avatar" />
        <div className="chat-header-info">
          <div className="chat-user-name">{selectedPartner.partnerProfile.username}</div>
          <span>{selectedPartner.postTitle}</span>
          <div className="user-status">
            <div className="status-dot"></div>
            Active now
          </div>
        </div>
        <div className="header-actions">
          <button className="action-btn">
            <FaPhone />
          </button>
          <button className="action-btn">
            <FaVideo />
          </button>
        </div>
      </div>

      <div className="chat-messages">
        {messageHistory.map((msg, index) => {
          const isSent = msg.senderId === myId;
          return (
            <div
              key={msg._id}
              className={isSent ? "message sent" : "message received"}
              >
              <p>{msg.content}</p>
            <span>{new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
              {msg.fileUrl && msg.fileType === "image" && (
                <img src={msg.fileUrl} alt="sent" width="150" />

              )}
              {console.log("Image load error for:", msg.fileUrl)}
              {msg.fileUrl && msg.fileType === "file" && (
                <a href={msg.fileUrl} target="_blank" rel="noopener noreferrer">
                  {decodeURIComponent(msg.fileUrl.split("/").pop())}
                </a>
              )}

            </div>
          );
        })}
      </div>


      <div className="message-input-container">
        <button className="tool-btn">
          <FaSmile />
        </button>
        <button className="tool-btn" onClick={openFileDialog}>
          <FaPaperclip></FaPaperclip>
          <input type="file" name="" id="" ref={fileRef} style={{ display: 'none' }} onChange={handleFile} />
          {selectFile && (
            <div style={{
              width: '300px',
              position: 'absolute',
              bottom: '8rem',
              left: '1rem',
              background: 'lavender',
              padding: '3rem'
            }}>
              <p> {selectFile.name}</p>

              {/* Show preview if it's an image */}
              {selectFile.type.startsWith("image/") && (
                <img src={URL.createObjectURL(selectFile)} alt="Preview" width="100" />
              )}
            </div>
          )}
        </button>
        <textarea className="message-input" value={newMessage} onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleMessage()} placeholder="Write a message..." />
        <button className="tool-btn" onClick={handleMessage}>
          <FaPaperPlane />
        </button>
      </div>

    </div>
  );
};

const Message = ({ received, text, time }) => {
  return (
    <div className={`message ${received ? "received" : "sent"}`}>
      <div className="message-bubble">
        <div className="message-text">{text}</div>
        <div className="message-time">{time}</div>
      </div>
    </div>
  );
};

export default Messages;