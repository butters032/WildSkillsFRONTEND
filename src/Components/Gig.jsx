import React from 'react';
import { Card, CardContent, Typography, IconButton } from '@mui/material';
import { Email, LocationOn, Language, BusinessCenter, Star } from '@mui/icons-material';
import { useLocation } from 'react-router-dom';

const Gig = () => {
    const location = useLocation();
    const { title, description, category, skills = [], status } = location.state || {};

    return (
        <Card style={{ width: '300px', margin: '20px', padding: '10px', borderRadius: '8px' }}>
            <CardContent>
                <Typography variant="h5" style={{ fontWeight: 'bold' }}>
                    {title}
                </Typography>
                <Typography variant="body2" color="textSecondary" gutterBottom>
                    Name: __________
                </Typography>
                <Typography variant="body1" style={{ marginTop: '10px' }}>
                    {description}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    <Language style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Skills: {skills.join(', ')}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    <BusinessCenter style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Status: {status}
                </Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px' }}>
                    <LocationOn style={{ verticalAlign: 'middle', marginRight: '5px' }} /> Category: {category}
                </Typography>
                <IconButton color="primary" style={{ marginTop: '10px' }}>
                    <Email />
                </IconButton>
            </CardContent>
        </Card>
    );
};

export default Gig;
