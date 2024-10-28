import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    

    useEffect(() => {
        fetchMessages();
    }, []);

    const fetchMessages = async () => {
        const response = await axios.get('http://localhost:8080/api/chat/getAllChat');
        setMessages(response.data);
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (input.trim()) {
          const newMessage = {
            message: input,
            timeStamp: new Date().toISOString(), 
            };
            const response = await axios.post('/api/chat/postChatRecord', newMessage);
            setMessages([...messages, response.data]);
            setInput('');
        }
    };

    return (
        <div>
      <h1>Chat</h1>
      <div>
        <div>
          {messages.map((msg, index) => (
            <div key={index}>{msg.message} ({msg.timeStamp})</div>
          ))}
        </div>
        <form onSubmit={sendMessage}>
          <input style={{width: '500px', height: '35px', borderRadius: '30px', paddingLeft: '20px', marginRight: '10px',paddingRight:'100px'}}
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Write a message"
            
          />
          <button style={{borderRadius: '20px'}}type="submit">Send</button>
        </form>
      </div>
    </div>
  );
};

export default Chat;
