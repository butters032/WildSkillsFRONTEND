import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, IconButton } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Chat from '@mui/icons-material/Chat';
import axios from 'axios';

const Gig = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { title, description, skills = [], status, studentId, categoryId } = location.state || {};
    const [studentName, setStudentName] = useState('');
    const [categoryName, setCategoryName] = useState('');

    useEffect(() => {
        const fetchStudentName = async (id) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/wildSkills/student/getUserStudentRecord?id=${id}`);
                setStudentName(response.data.name);
            } catch (error) {
                console.error('Error fetching student name', error);
            }
        };

        if (studentId) {
            fetchStudentName(studentId);
        }
    }, [studentId]);

    useEffect(() => {
        const fetchCategoryName = async (id) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/wildSkills/category/getAllCategory?id=${id}`);
                setCategoryName(response.data.name);
            } catch (error) {
                console.error('Error fetching category name', error);
            }
        };

        if (categoryId) {
            fetchCategoryName(categoryId);
        }
    }, [categoryId]);

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
                    {studentName || '(Name)'}
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
                <br />
                <Typography variant="body1" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    {description}
                </Typography>
                <br />
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>Skills</Typography>
                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    {skillArray.slice(0, 10).map((skill, index) => (
                        <Chip key={index} label={skill.trim()} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                    ))}
                </Typography>

                <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                    <Chip label={`Category: ${categoryId}`} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                </Typography>
            </CardContent>
        </Card>
    );
};

export default Gig;
