
import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Typography, Chip, Button, Avatar, Box, Paper, Divider, Rating, Stack } from '@mui/material';
import { Person, CheckCircle, Cancel } from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import axios from 'axios';

const GigHome = ({userId}) => {
    const { id } = useParams(); 
    const location = useLocation();
    const [gigData, setGigData] = useState(location.state || null); 
    const [studentName, setStudentName] = useState('');
    const [showFullDescription, setShowFullDescription] = useState(false);
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: `http://localhost:8080/api/wildSkills/skillExchange/student/${userId}`,
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const postExchange = (offeringId) => {
        api.post(`/postSkillExchange/${offeringId}`, {
            status: 'Ongoing'
        })
        .then((response) =>{
            console.log(response);
            navigate('/skill-exchange');
        })
        .catch((error) =>{
            console.log('Error creating Skill Exchange',error);
        })
    }

    useEffect(() => {
        const fetchGigData = async () => {
            try {
                const response = await axios.get(
                    `http://localhost:8080/api/wildSkills/skilloffering/getSkillOfferingById/${id}`
                );
                const data = response.data;
                setGigData(data);

                if (data.studentId) {
                    const studentResponse = await axios.get(
                        `http://localhost:8080/api/wildSkills/student/getUserStudentRecord?id=${data.studentId}`
                    );
                    setStudentName(studentResponse.data.name);
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchGigData();
    }, [id]);

    if (!gigData) {
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                height="100vh"
                bgcolor="linear-gradient(120deg, #000000, #434343)"
            >
                <Typography variant="h6" color="white">
                    Loading...
                </Typography>
            </Box>
        );
    }
        return (
            <Box
                display="flex"
                justifyContent="center"
                alignItems="center"
                minHeight="83vh"
                minWidth="99vw"
                sx={{
                    background: 'linear-gradient(120deg, #000000, #434343)', 
                    padding: 2, 
                    margin: '0 auto', 
                }}
            >
                <Paper
                    elevation={4}
                    sx={{
                        padding: 3,
                        borderRadius: 3,
                        maxWidth: '700px',
                        width: '100%',
                    }}
                >
                    <Box display="flex" alignItems="center" mb={3}>
                        <Avatar sx={{ width: 56, height: 56, bgcolor: '#f68084', marginRight: 2 }}>
                            <Person />
                        </Avatar>
                        <Box>
                            <Typography variant="h5" fontWeight="bold">
                                {gigData.title}
                            </Typography>
                            <Typography variant="subtitle1" color="textSecondary">
                                {studentName || 'Loading...'}
                            </Typography>
                            <Stack direction={'row'}>
                                <Rating precision={0.5} value='3.5' readOnly /> <Typography>(3.5)</Typography>
                            </Stack>
                        </Box>
                    </Box>
                    <Divider sx={{ marginBottom: 2 }} />
                    <Typography
                        variant="body1"
                        color="textSecondary"
                        sx={{ marginBottom: 3, lineHeight: 1.8 }}
                    >
                        {gigData.description || 'No description provided'}
                    </Typography>
        
                    <Box display="flex" flexWrap="wrap" gap={1} mb={3}>
                        {gigData.skills
                            ? gigData.skills.split(',').map((skill, index) => (
                                  <Chip
                                      key={index}
                                      label={skill.trim()}
                                      sx={{
                                          bgcolor: '#e0f7fa',
                                          color: '#006064',
                                          fontWeight: 'bold',
                                      }}
                                  />
                              ))
                            : 'No skills provided'}
                    </Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Typography variant="body2" color="textSecondary">
                            <Box display="flex" alignItems="center">
                                {gigData.isActive ? (
                                    <>
                                        <CheckCircle sx={{ color: 'green', marginRight: 1 }} />
                                        Online
                                    </>
                                ) : (
                                    <>
                                        <Cancel sx={{ color: 'red', marginRight: 1 }} />
                                        Offline
                                    </>
                                )}
                            </Box>
                        </Typography>

                        <Button>
                            View All Reviews
                        </Button>


                        <Button
                            variant="contained"
                            color="primary"
                            sx={{
                                background: 'linear-gradient(45deg, #cf2d2d 30%, #ff762e 90%)', 
                                border: 0,
                                borderRadius: 3,
                                boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)', 
                                color: 'white',
                                height: 48,
                                padding: '0 30px',
                                '&:hover': {
                                    background: 'linear-gradient(45deg, #cf2d2d 30%, #ff762e 90%)', 
                                },
                            }}
                            onClick={() => {postExchange(gigData.skillOfferingId)}}
                        >
                            Initialize Exchange
                        </Button>
                    </Box>
                </Paper>
            </Box>
        );
    }
        

export default GigHome;

