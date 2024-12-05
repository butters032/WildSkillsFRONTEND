import React, { useEffect, useState, useRef } from 'react';
import { Button, Grid2, Stack, Typography } from '@mui/material';
import axios from 'axios';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const Chat = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const messageRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [clickedMessages, setClickedMessages] = useState({});
  const [originalMessage, setOriginalMessage] = useState('');
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
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('Connected to WebSocket');
        client.subscribe('/topic/chat', (messageOutput) => {
          const newMessage = JSON.parse(messageOutput.body);
          setMessages((prevMessages) => [...prevMessages, newMessage]);
        });
      },
      onWebSocketError: (error) => {
        console.error('WebSocket error:', error);
      },
      debug: (str) => console.log(str),
    });

    client.activate();
    setStompClient(client);

    // Fetch initial messages
    fetchMessages();

    return () => {
      if (client.active) {
        client.deactivate();
      }
    };
  }, []);

  const sendMessage = () => {
    const message = messageRef.current.value.trim();
    if (message === '') {
      console.log('Message is blank');
      return;
    }

    if (stompClient && stompClient.connected) {
      stompClient.publish({
        destination: '/app/sendMessage', // Destination in your backend
        body: JSON.stringify({ message }),
      });
      messageRef.current.value = ''; // Clear input field
    } else {
      console.error('STOMP client is not connected');
    }
  };

  const editMessage = () => {
    const message = messageRef.current.value.trim();

    if (message === '') {
      console.log('Message is blank');
      return;
    } else if (message === originalMessage) {
      console.log('Message did not change');
      return;
    }

    const updatedMessage = {
      messageId: currentMessageId,
      message: message,
    };

    api
      .put(`/putMessageDetails/${currentMessageId}`, updatedMessage)
      .then((response) => {
        setMessages((prevMessages) =>
          prevMessages.map((msg) =>
            msg.messageId === currentMessageId ? { ...msg, message } : msg
          )
        );
        messageRef.current.value = '';
        setIsEditing(false);
        setCurrentMessageId(null);
      })
      .catch((error) => {
        console.error('Error editing Message', error);
      });
  };

  const handleEditMessage = (messageId, message) => {
    setCurrentMessageId(messageId);
    setOriginalMessage(message);
    messageRef.current.value = message;
    setIsEditing(true);
  };

  const handleClickMessage = (id) => {
    setClickedMessages((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      isEditing ? editMessage() : sendMessage();
    }
  };

  const fetchMessages = () => {
    api
      .get('/getAllMessage')
      .then((response) => {
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  };

  const deleteMessage = (id) => {
    api
      .delete(`/deleteMessageDetails/${id}`)
      .then(() => {
        fetchMessages();
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
      });
  };

  return (
    <>
      <Grid2
        container
        spacing={2}
        direction="column"
        sx={{ justifyContent: 'right', marginTop: '0%', backgroundColor: '#FFFFFF', borderRadius: 5 }}
      >
        <Grid2
          sx={{
            minHeight: '80vh',
            maxHeight: '100%',
            minWidth: 500,
            maxWidth: 1050,
            width: 1050,
            borderRadius: 5,
            backgroundColor: '#FFFFFF',
            overflow: 'auto',
          }}
        >
          {messages.map((msg, index) => (
            <Grid2
              key={index}
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textAlign: 'left',
                border: '2px solid',
                minWidth: 10,
                maxWidth: 275,
                minHeight: 20,
                maxHeight: 10000,
                marginLeft: '60%',
                marginTop: 0.5,
                borderRadius: 3,
                backgroundColor: '#333',
                paddingLeft: 1,
                paddingTop: 0.5,
                paddingBottom: 0.5,
              }}
              onClick={() => handleClickMessage(msg.messageId)}
            >
              <Typography style={{ color: 'white' }} variant="body1" justifySelf="left">
                {msg.message}{' '}
                {clickedMessages[msg.messageId] && (
                  <>
                    <br />
                    <span style={{ color: 'lightgray', marginLeft: '10px' }}>
                      {new Date(msg.timeStamp).toLocaleString('en-US', {
                        hour: 'numeric',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </span>
                    <br />
                    <span style={{ color: 'lightgray', marginLeft: '10px' }}>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => handleEditMessage(msg.messageId, msg.message)}
                      >
                        Edit
                      </Button>
                    </span>
                    <span style={{ color: 'lightgray', marginLeft: '10px' }}>
                      <Button
                        variant="text"
                        color="error"
                        onClick={() => deleteMessage(msg.messageId)}
                      >
                        Delete
                      </Button>
                    </span>
                  </>
                )}
              </Typography>
            </Grid2>
          ))}
        </Grid2>
        <Stack direction="row">
          <input
            style={{
              marginLeft: 10,
              width: '800px',
              height: '35px',
              borderRadius: '30px',
              paddingLeft: '20px',
              marginRight: '10px',
              paddingRight: '100px',
            }}
            ref={messageRef}
            type="text"
            placeholder="Write a message"
            onKeyDown={handleKeyDown}
          />
          <Button
            variant="contained"
            onClick={isEditing ? editMessage : sendMessage}
            style={{
              marginBottom: 15,
              backgroundColor: '#333',
              color: '#ffff',
              '&:hover': { backgroundColor: '#555' },
              borderRadius: '20px',
              alignItems: 'center',
            }}
          >
            {isEditing ? 'Update' : 'Send'}
          </Button>
        </Stack>
      </Grid2>
    </>
  );
};

export default Chat;
