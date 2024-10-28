import React, { useEffect, useState } from 'react';
import { Button, Grid2, Stack, Typography } from "@mui/material";
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');

    useEffect(() => {
        fetchMessages();
    }, []);

    const deleteMessage = async (id) =>{
      try {
        const response = await axios.delete(`http://localhost:8080/api/message/deleteMessageDetails/${id}`);
        console.log('Message deleted:', response.data);
    } catch (error) {
        console.error('Error deleting message:', error);
    }
    }
  
    const fetchMessages = async () => {
      try{
        const response = await axios.get('http://localhost:8080/api/message/getAllMessage');
        setMessages(response.data);
      }catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
          const newMessage = {
            message: input,
            timeStamp: new Date().toISOString(), 
            };
            try{
              const response = await axios.post('http://localhost:8080/api/message/postMessageRecord', newMessage);
              setMessages((prevMessages) => [...prevMessages, response.data]);
              setInput('');
            }catch (error) {
              console.error('Error posting message:', error);
            }
        };
    };

    return (
      <>
      <Typography variant="h4">Chat</Typography>
      <Grid2 container spacing={2} direction={"row"} sx={{justifyContent: 'Center'}}>
        <Grid2 sx={{border: "2px solid", minWidth: 700, minHeight: 700, maxHeight: 700, maxWidth: 700, borderRadius: 5, backgroundColor:"#E7BC40", overflow: "auto" }}>
          {messages.map((msg, index) => (
            <Grid2 key={index} 
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textAlign:'left',
                border: '2px solid',
                minWidth:10,
                maxWidth:10000, 
                minHeight: 20, 
                maxHeight: 10000, 
                marginLeft:'60%', 
                marginTop:.5,
                borderRadius: 3,
                backgroundColor:"#333",
                paddingLeft:1,
                paddingTop: .5,
                paddingBottom:.5
              }}
            >
              <Typography style={{ color: 'white' }} variant="body1" justifySelf={"left"}>{msg.message} ({msg.timeStamp})</Typography>
              <Button variant="text" color="error" 
              onClick={deleteMessage}>
              Delete
              </Button>    
              </Grid2>
          ))}
        </Grid2>
        <form onSubmit={sendMessage}>
          <input style={{width: '500px', height: '35px', borderRadius: '30px', paddingLeft: '20px', marginRight: '10px',paddingRight:'100px'}}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message"
            
          />
          <Button variant="contained"  
            style={{backgroundColor: '#333', color: '#fff', '&:hover': { backgroundColor: '#555' }, borderRadius: '20px',alignItems: 'center',}}
            type="submit" 
            onClick={sendMessage}>
            Send
            </Button>
        </form>
    </Grid2>
    </>
  );
};

export default Chat;
