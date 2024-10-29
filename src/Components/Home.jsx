import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';


const Home = () => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/student/getStudentRecord'); // Use full URL
            console.log("API response:", response.data); // Check structure
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
            alert('Failed to fetch students.');
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    const handleClick = (studentId) => {
        navigate(`/skill-offerings/${studentId}`);
    };

    return (
        <>
            <h1>What Service do you Need?</h1>
            <TextField id="outlined-basic" variant="outlined" size="small" style={{width: '500px', marginBottom: '10px'}} />
            <Divider style={{marginBottom: '50px', backgroundColor: 'black'}}/>

            <Grid container spacing={2}>
                {students.map((student) => (
                    <Grid item size={4} key={student.studentId}>
                        <CardActionArea style={{borderRadius: '10px'}} onClick={() => handleClick(student.studentId)}>
                            <Card style={{border: '1px solid black', borderRadius: '10px'}}>
                                <CardContent>
                                    <Typography variant="h5">{student.name}</Typography>
                                    <Divider style={{marginBottom: '15px', marginTop: '5px', backgroundColor: 'black'}}/>
                                    <Typography variant="body2">Sample content for student</Typography>
                                </CardContent>
                            </Card>
                        </CardActionArea>
                        
                    </Grid>
                ))}
            </Grid>
        </>
    );
};

export default Home;
