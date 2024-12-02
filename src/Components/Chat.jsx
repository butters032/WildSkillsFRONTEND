import React, { useEffect, useState, useRef } from 'react';
import { Button, Grid2, Stack, Typography } from "@mui/material";
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const messageRef=useRef()
    const [isEditing, setIsEditing] = useState(false);
    const [currentMessageId, setCurrentMessageId] = useState(null);
    const [clickedMessages, setClickedMessages] = useState({});
    const [originalMessage, setOriginalMessage] = useState('');

    const api = axios.create({
      baseURL: 'http://localhost:8080/api/wildSkills/message/',
      timeout: 1000,
      headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
      }
  });


    useEffect(() => {
        fetchMessages();
    }, []);

    const deleteMessage = (id) =>{
      api.delete(`deleteMessageDetails/${id}`)
      .then((response)=>{
        fetchMessages();
        console.log("Deleted Successfully",response);
        })
        .catch ((error) => {
        console.log('Error deleting message:', error);
      })
    };

    const fetchMessages = () => {
       api.get('/getAllMessage') 
       .then((response) => {
        setMessages(response.data);
        console.log(response.data);
       })
        
      .catch ((error)=> {
        console.log('Error fetching messages:', error);
      });
    };

    const sendMessage = () => {
          const message = messageRef.current.value.trim();
          if(message==""){
           console.log('Message is blank');
            return;
          }
          api.post('postMessageRecord',{message})
      .then((response)=>{
          console.log(response.data);
          messageRef.current.value='';
          fetchMessages();
      })
      .catch((error)=>{
        console.log('Error Sending Messages',error)
      })  
    };

    const editMessage = () => {
      const message = messageRef.current.value.trim();
      if (message==""){
        console.log("Message is blank"); 
        return;
    }else if (message==originalMessage){
      console.log("message did not change");
      return;
    }
      api.put(`/putMessageDetails?id=${currentMessageId}`,{message})
      .then((response) => {
        console.log(response.data)
        messageRef.current.value='';
        setIsEditing(false);
        setCurrentMessageId(null);
        fetchMessages();
      })
      .catch((error) => {
        console.log('Error editing Message',error)
      })
    }

    const handleEditMessage =(messageId, message) =>{
      setCurrentMessageId(messageId);
      setOriginalMessage(message);
      messageRef.current.value = message;
      setIsEditing(true);
    }

    const handleClickMessage = (id) =>{
      setClickedMessages(prevState => ({
        ...prevState,
        [id]: !prevState[id]
      }));
    };

    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        event.preventDefault();
        isEditing ? editMessage() : sendMessage();
      }
    };

    return (
      <>{/*ikaw lang niya adjust ani width doy, dapat felxible ni siya*/}
      <Grid2 container spacing={2} direction={"column"} sx={{justifyContent: 'right', marginTop:'0%', backgroundColor: "#f5f5f5", borderRadius: 5}}>
        <Grid2 sx={{ minHeight: '80vh', maxHeight: '100%', minWidth: 500,  maxWidth: 1050, width: 1050, borderRadius: 5, backgroundColor:"#f5f5f5", overflow: "auto" }}>
          {messages.map((msg, index) => (
            <Grid2 key={index} 
              sx={{
                display: 'flex',
                justifyContent: 'flex-start',
                alignItems: 'center',
                textAlign:'left',
                border: '2px solid',
                minWidth:10,
                maxWidth:275, 
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
              onClick={()=>handleClickMessage(msg.messageId)}
            >
              <Typography style={{ color: 'white' }} variant="body1" justifySelf={"left"}>{msg.message} {clickedMessages[msg.messageId] && (
                <>
                  <br/>
                  <span style={{color: 'lightgray',marginLeft: '10px'}}>{new Date(msg.timeStamp).toLocaleDateString([],{ hour: 'numeric', minute: '2-digit', hour12: true })}</span>
                  <br/>
                  <span style={{color: 'lightgray',marginLeft: '10px'}}><Button variant="text" color="error" onClick={()=>{handleEditMessage(msg.messageId,msg.message)}}>Edit</Button> </span>
                  <span style={{color: 'lightgray',marginLeft: '10px'}}><Button variant="text" color="error" onClick={()=>{deleteMessage(msg.messageId)}}>Delete</Button></span>
                </>
                
              )}
              </Typography>
              </Grid2>
          ))}
        </Grid2> {/*width:500px*/}
          <Stack direction={"row"}>
            <input style={{width: '293px', height: '35px', borderRadius: '30px', paddingLeft: '20px', marginRight: '10px',paddingRight:'100px'}}
              ref={messageRef}
              type="text"
              placeholder="Write a message"
              onKeyDown={handleKeyDown}
            />
            <Button variant="contained"  
              onClick={isEditing ? editMessage : sendMessage} 
              style={{backgroundColor: '#333', color: '#fff', '&:hover': { backgroundColor: '#555' }, borderRadius: '20px',alignItems: 'center',}}>
              {isEditing ? 'Update' : 'Send'}
              </Button>
          </Stack>
    </Grid2>
    </>
  );
};

export default Chat;
