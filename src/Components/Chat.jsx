import React, { useEffect, useState, useRef } from 'react';
import { Button, Grid2, Stack, Typography } from '@mui/material';
import axios from 'axios';

export default function Chat({ userId }) {
  const [messages, setMessages] = useState([]);
  const messageRef = useRef();
  const [isEditing, setIsEditing] = useState(false);
  const [currentMessageId, setCurrentMessageId] = useState(null);
  const [clickedMessages, setClickedMessages] = useState({});
  const [originalMessage, setOriginalMessage] = useState('');

  const api = axios.create({
    baseURL: 'http://localhost:8080/api/wildSkills/',
    timeout: 1000,
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Fetch all messages
  const fetchMessages = () => {
    api
      .get('message/getAllMessage') // Fetch all messages
      .then((response) => {
        console.log('Fetched messages:', response.data);
        setMessages(response.data);
      })
      .catch((error) => {
        console.error('Error fetching messages:', error);
      });
  };

  // Send a new message
  const sendMessage = () => {
    const message = messageRef.current.value.trim();

    if (message === '') {
      console.log('Message is blank');
      return;
    }

    // Send the message to the backend
    api
      .post('message/postMessageRecord', { message }) // Save the message
      .then(() => {
        fetchMessages(); // Refresh messages after sending
        messageRef.current.value = ''; // Clear the input field
      })
      .catch((error) => {
        console.error('Error sending message:', error.response?.data || error.message);
      });
  };

  // Edit an existing message
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
      message: message,
    };

    api
      .put(`message/putMessageDetails/${currentMessageId}`, updatedMessage) // Update the message
      .then(() => {
        fetchMessages(); // Refresh messages after editing
        messageRef.current.value = ''; // Clear the input field
        setIsEditing(false);
        setCurrentMessageId(null);
      })
      .catch((error) => {
        console.error('Error editing message:', error);
      });
  };

  // Delete a message
  const deleteMessage = (id) => {
    api
      .delete(`message/deleteMessageDetails/${id}`) // Delete the message
      .then(() => {
        fetchMessages(); // Refresh messages after deletion
      })
      .catch((error) => {
        console.error('Error deleting message:', error);
      });
  };

  // Handle editing a message
  const handleEditMessage = (messageId, message) => {
    setCurrentMessageId(messageId);
    setOriginalMessage(message);
    messageRef.current.value = message;
    setIsEditing(true);
  };

  // Handle toggling message options
  const handleClickMessage = (id) => {
    setClickedMessages((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  // Handle Enter key for sending or editing messages
  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      isEditing ? editMessage() : sendMessage();
    }
  };

  // Fetch messages when the component mounts
  useEffect(() => {
    fetchMessages();
  }, []);

  return (
    <>
      <Grid2
        container
        spacing={2}
        direction="column"
        sx={{ justifyContent: 'right', marginTop: '0%', backgroundColor: '#1e1e1e', borderRadius: 5 }}
      >
        <Grid2
          sx={{
            minHeight: '80vh',
            maxHeight: '100%',
            minWidth: 500,
            maxWidth: 1050,
            width: 1050,
            borderRadius: 5,
            backgroundColor: '#1e1e1e',
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
                {msg.message || 'No message content'}{' '}
                {clickedMessages[msg.messageId] && (
                  <>
                    <br />
                    <span style={{ color: 'lightgray', marginLeft: '10px' }}>
                      {msg.timeStamp
                        ? new Date(msg.timeStamp).toLocaleString('en-US', {
                            hour: 'numeric',
                            minute: '2-digit',
                            hour12: true,
                          })
                        : 'No timestamp'}
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
}
