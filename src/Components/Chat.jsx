import React, { useEffect, useState } from 'react';
import { Button, Grid, Stack, Typography, TextField } from "@mui/material";
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Message = ({ msg, studentId, handleEdit, handleDelete, handleClick, isClicked }) => {
  const isOwnMessage = msg.senderId === studentId; // Check if the sender is the current student

  return (
    <Grid 
      sx={{
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: isOwnMessage ? 'flex-end' : 'flex-start',  
        textAlign: isOwnMessage ? 'right' : 'left', 
        border: '1px solid', 
        borderRadius: 3, 
        padding: '10px', 
        margin: '5px', 
        maxWidth:'50%', 
        wordBreak: 'break-word', 
        backgroundColor: isOwnMessage ? '#1976d2' : '#333', 
        color: isOwnMessage ? 'white' : 'lightgray', 
        alignSelf: isOwnMessage ? 'flex-end' : 'flex-start',
      }}
      onClick={() => handleClick(msg.messageId)}
    >
      <Typography variant="body1"> 
        {msg.message}
      </Typography>
      {isClicked && (
        <>
          <Typography variant="caption" color="lightgray" sx={{ marginTop: '5px' }}>
            {new Date(msg.timeStamp).toLocaleString('en-US', {
              hour: '2-digit',
              minute: '2-digit',
              hour12: true,
            })}
          </Typography>
          <Stack direction="row" spacing={1} sx={{ marginTop: '5px' }}>
            <Button variant="text" color="primary" size="small" onClick={(e) => { e.stopPropagation(); handleEdit(msg.messageId, msg.message); }}>
              Edit
            </Button>
            <Button variant="text" color="error" size="small" onClick={(e) => { e.stopPropagation(); handleDelete(msg.messageId); }} >
              Delete
            </Button>
          </Stack>
        </>
      )}
    </Grid>
  );
};

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [clickedMessages, setClickedMessages] = useState({});
  const [stompClient, setStompClient] = useState(null);
  const [studentId, setStudentId] = useState(null);
  const [chatId, setChatId] = useState(null);  // Store chat ID for fetching messages

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/wildSkills/message/',
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  useEffect(() => {
    const fetchStudentId = async () => {
      try {
        const response = await axios.get('http://localhost:8080/api/wildSkills/studentId'); 
        setStudentId(response.data.studentId);
      } catch (error) {
        console.error('Error fetching studentId:', error);
      }
    };

    const fetchMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/api/wildSkills/message/getMessages/${chatId}`);
        setMessages(response.data); 
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchStudentId();
    if (chatId) fetchMessages();

    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/public', (messageOutput) => {
          const newMessage = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
          api.post('/saveMessage', newMessage)
            .then(() => console.log('Message saved to backend'))
            .catch((error) => console.error('Error saving message:', error));
        });
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (stompClient?.connected) {
        stompClient.deactivate();
      }
    };
  }, [chatId]);  // Re-run when chatId is updated

  const handleSend = () => {
    if (input.trim() === '') return;

    const newMessage = {
      message: input,
      timeStamp: new Date(),
      senderId: studentId,
      messageId: Date.now(), 
    };

    if (isEditing) {
      // Editing an existing message
      api.put(`/putMessageDetails?id=${currentMessageId}`, { message: input })
        .then(() => {
          setMessages((prev) =>
            prev.map((msg) =>
              msg.messageId === currentMessageId
                ? { ...msg, message: input }
                : msg
            )
          );
          setInput('');
          setIsEditing(false);
          setCurrentMessageId(null);
        })
        .catch((error) => console.error('Error editing message:', error));
    } else {
      if (stompClient) {
        const newMessage = { message: input, timeStamp: new Date(), messageId: Date.now() }; 
        setMessages((prev) => [...prev, newMessage]); 

        stompClient.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify({ message: input }),
        });

        api.post('/saveMessage', newMessage)
          .then(() => {
            setMessages((prev) => [...prev, newMessage]); 
          })
          .catch((error) => console.error('Error saving message:', error));

        setInput('');
      }
    }
  };

  const handleEditMessage = (id, message) => {
    setCurrentMessageId(id);
    setInput(message);
    setIsEditing(true);
  };

  const handleDeleteMessage = (id) => {
    api.delete(`/deleteMessageDetails/${id}`)
      .then(() => {
        setMessages((prev) => prev.filter((msg) => msg.messageId !== id));
      })
      .catch((error) => console.error('Error deleting message:', error));
  };

  const handleClickMessage = (id) => {
    setClickedMessages((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Grid container spacing={2} direction="column" sx={{ minWidth:'1050px', marginLeft: 2, marginRight: 100, maxWidth:'1000px', margin: 'auto', padding: 2, backgroundColor: '#f5f5f5', borderRadius: 5 }}>
      <Grid item sx={{ minHeight: '76vh', maxWidth: '1000px', overflowY: 'auto', padding: 2, backgroundColor: '#fff', borderRadius: 3 }}>
        {messages.map((msg) => (
          <Message 
            key={msg.messageId} 
            msg={msg} 
            studentId={studentId}
            handleEdit={handleEditMessage} 
            handleDelete={handleDeleteMessage} 
            handleClick={handleClickMessage} 
            isClicked={clickedMessages[msg.messageId]}
          />
        ))}
      </Grid>
      <Grid item>
        <Stack direction="row" spacing={2}>
          <TextField 
            fullWidth 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            placeholder="Write a message" 
            onKeyDown={handleKeyDown} 
          />
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSend} 
            sx={{ borderRadius: '20px' }}
          >
            {isEditing ? 'Update' : 'Send'}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Chat;
