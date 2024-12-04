import React, { useEffect, useState } from 'react';
import { Button, Grid, Stack, Typography, TextField } from "@mui/material";
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';


const Message = ({ msg, handleEdit, handleDelete, handleClick, isClicked }) => {
  return (
    <Grid sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', textAlign: 'left', border: '1px solid', borderRadius: 3, padding: '10px', 
        margin: '5px 0', 
        backgroundColor: '#333', 
        color: 'white', }}
        onClick={() => handleClick(msg.messageId)}>
      <Typography variant="body1">{msg.message}</Typography>
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

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/wildSkills/message/',
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  useEffect(() => {
    const socket = new SockJS('http://localhost:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/public', (messageOutput) => {
          const newMessage = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
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
  }, []);

  const handleSend = () => {
    if (input.trim() === '') return;

    if (isEditing) {
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
        stompClient.publish({
          destination: '/app/chat.sendMessage',
          body: JSON.stringify({ message: input }),
        });
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
    <Grid container spacing={2} direction="column" sx={{ minWidth:'1080px', marginLeft: 2, marginRight: 100,maxWidth:'2000px', margin: 'auto', padding: 2, backgroundColor: '#f5f5f5', borderRadius: 5,}}>
      <Grid item sx={{ minHeight: '80vh', maxWidth: '1000px', overflowY: 'auto', padding: 2, backgroundColor: '#fff', borderRadius: 3, }}>
        {messages.map((msg) => ( 
          <Message 
            key={msg.messageId} 
            msg={msg} 
            handleEdit={handleEditMessage} 
            handleDelete={handleDeleteMessage} 
            handleClick={handleClickMessage} 
            isClicked={clickedMessages[msg.messageId]}/>
        ))}
      </Grid>
      <Grid item>
        <Stack direction="row" spacing={2}>
          <TextField fullWidth value={input} onChange={(e) => setInput(e.target.value)} placeholder="Write a message" onKeyDown={handleKeyDown}/>
          <Button variant="contained" color="primary" onClick={handleSend} sx={{ borderRadius: '20px' }} >
            {isEditing ? 'Update' : 'Send'}
          </Button>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Chat;
