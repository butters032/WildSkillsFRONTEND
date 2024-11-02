import React from 'react';
import { Card, CardContent, Typography, IconButton, Chip } from '@mui/material';
import { Chat } from '@mui/icons-material';
import { useLocation, useNavigate } from 'react-router-dom';

const Gig = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { title, description, category, skills = [], status } = location.state || {};

    console.log('Gig Data:', location.state); 

    const handleChatClick = () => {
        navigate('/chat');
    };
    const skillArray = skills ? skills.split(',') : [];
    return (
        <Card style={{ height: '670px', width: '900px', margin: '20px', padding: '10px', borderRadius: '8px' }}>
            <CardContent>
                <Typography variant="h5" style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'flex-start', fontSize: '25px' }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ display: 'flex', justifyContent: 'flex-start', fontSize: '30px' }} gutterBottom>
                    (Name)
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Chip label={status === true ? "Online" : "Offline"} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                </Typography>
                <IconButton 
                    color="primary" 
                    style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start', color: 'gray' }} 
                    onClick={handleChatClick} 
                >
                    <Chat style={{ textAlign: 'left' }} />
                </IconButton>
                <br></br>
                <br></br>
                <Typography variant="body1" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    {description}
                </Typography>
                <br></br>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>Skills</Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    {skillArray.slice(0, 10).map((skill, index) => (
                        <Chip key={index} label={skill.trim()} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    ))}
                </Typography>

                {category && (
                    <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                        <Chip label={`Category: ${category}`} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    </Typography>
                )}

            </CardContent>
        </Card>
    );
};

export default Gig;
