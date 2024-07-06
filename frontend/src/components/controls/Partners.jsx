import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../axios';
import './partners.css';
import IconButton from '@mui/material/IconButton';
import MessageIcon from '@mui/icons-material/Message';
import CommentIcon from '@mui/icons-material/Comment';
import io from 'socket.io-client';
import ScrollToBottom from 'react-scroll-to-bottom';

function Partners() {
  const [partners, setPartners] = useState([]);
  const [socket, setSocket] = useState(null);
  const [showChat, setShowChat] = useState({});
  const [messages, setMessages] = useState({});
  const [messageInput, setMessageInput] = useState('');
  const [myId, setMyId] = useState('');
  const [showCommentInput, setShowCommentInput] = useState({});
  const [commentInput, setCommentInput] = useState('');

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const token = localStorage.getItem('user-token');
        const response = await axios.get('/get-partners', {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        setPartners(response.data.partnerData);
        setMyId(response.data.myId);
      } catch (error) {
        console.error('Error fetching partners:', error);
      }
    };
    fetchPartners();

    const socket = io.connect('http://localhost:9000');
    setSocket(socket);
    socket.on('connect', () => console.log(socket))
    socket.on('connect_error', () => {
      setTimeout(() => socket.connect(), 900)
    })
    socket.on('receive_message', ({ senderId, message }) => {
      const roomId = [message.receiverId, senderId].sort().join('-');
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        const roomEntry = updatedMessages[roomId];
        if (roomEntry) {
          roomEntry.messages.push(message);
        } else {
          updatedMessages[roomId] = { ...message, messages: [message] };
        }
        return updatedMessages;
      });
    });

    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (receiverUserId) => {
    if (messageInput.trim() === '') {
      return;
    }

    const message = {
      senderId: myId,
      receiverId: receiverUserId,
      content: messageInput,
      createdAt: new Date()
    };

    const roomId = [myId, receiverUserId].sort().join('-');

    socket.emit('send_message', { senderId: myId, receiverId: receiverUserId, message, room: roomId });

    setMessages((prevMessages) => {
      const updatedMessages = { ...prevMessages };
      const roomEntry = updatedMessages[roomId];
      if (roomEntry) {
        roomEntry.messages.push(message);
      } else {
        updatedMessages[roomId] = { ...message, messages: [message] };
      }
      return updatedMessages;
    });

    setMessageInput('');
  };

  const MessagesContainer = useRef(null);

  useEffect(() => {
    if (MessagesContainer.current) {
      MessagesContainer.current.scrollTop = MessagesContainer.current.scrollHeight;
    }
  }, [messages]);

  const toggleChat = async (partnerId) => {
    const roomId = [myId, partnerId].sort().join('-');

    socket.emit('join_room', roomId);
    setShowChat((prevShowChat) => ({
      ...prevShowChat,
      [partnerId]: !prevShowChat[partnerId]
    }));
    if (!showChat[partnerId]) {
      const token = localStorage.getItem('user-token');
      try {
        const response = await axios.get(`/get-messages/${roomId}`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        const messageCollection = response.data.messageCollection;
        console.log("toggle",messageCollection);
        setMessages(messageCollection);
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    }
  };

  const handleCommentIconClick = (partnerId) => {
    setShowCommentInput((prevShowCommentInput) => ({
      ...prevShowCommentInput,
      [partnerId]: true
    }));
  };

  const handleCommentSubmit = async(partnerId, commentInput) => {
    console.log('Comment submitted:', commentInput);
    await submitComment(partnerId, commentInput);
    setCommentInput('');
  };

  const submitComment = async (partnerId, commentContent) => {
    try {
      const token = localStorage.getItem('user-token');
      const response = await axios.post('/submit-comment', {
        partnerId,
        content: commentContent
      }, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      console.log('Comment submitted successfully:', response.data);
    } catch (error) {
      console.error('Error submitting comment:', error);
    }
  };
  
  return (
    <div className="partners-container">
      <h1>Partners</h1>
      <div className="partners-grid">
        {partners.map((partner) => (
          <div className="partner-card" key={partner._id}>
            <img className="avatar" alt={partner.partnerProfile.username} src={`http://localhost:9000/skillsync/uploads/${partner.partnerProfile.filename}`} />
            <div className='prtn'>
              <h3 className="username">{partner.partnerProfile.username}</h3>
              <p className="skills">Skill: {partner.partnerProfile.skills.join(', ')}</p>
            <Link to={`/update/${partner.postId}`} state={{ data: partner.postId }} className="post-title">{partner.postTitle}</Link>
            </div>
            <div className="icons">
              <IconButton
                aria-label="message"
                onClick={() => toggleChat(partner.partnerProfile.userId)}
              >
                <MessageIcon style={{ color: 'green' }} />
              </IconButton>
              <IconButton aria-label="comment" onClick={() => handleCommentIconClick(partner.partnerProfile.userId)}>
                <CommentIcon style={{ color: '#e68203' }} />
              </IconButton>
            </div>
            {showCommentInput[partner.partnerProfile.userId] && (
              <div className="comment-input-container">
                <textarea
                  type="text"
                  placeholder="Type your comment"
                  value={commentInput}
                  onChange={(e) => setCommentInput(e.target.value)}
                />
                <button onClick={() => handleCommentSubmit(partner.partnerProfile.userId, commentInput)}>Submit</button>
              </div>
            )}
            {showChat[partner.partnerProfile.userId] && (
              <div className="chat-interface">
                <div className="messages-container" ref={MessagesContainer}>
                  <ScrollToBottom>
                    {Object.values(messages).map((room, roomIndex) => (
                      <div key={roomIndex} className="room-container" >
                        {room.messages && room.messages.map((message, messageIndex) => (
                          <div key={messageIndex} className={`message ${message.senderId === myId ? 'sent' : 'received'}`}>
                            <div className="message-header">
                              <span className="sender">{message.senderId === myId ? 'You' : partner.partnerProfile.username}</span>
                              <span className="timestamp">{new Date(message.createdAt).toLocaleTimeString()}</span>
                            </div>
                            <div className="message-content">
                              {message.content}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </ScrollToBottom>
                </div>
                <div className="input-container">
                  <input
                    type="text"
                    placeholder="Type your message"
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                  />
                  <button onClick={() => sendMessage(partner.partnerProfile.userId)}>Send</button>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Partners;
