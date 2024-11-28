import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, CardActionArea, Typography, Grid2, Stack } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { blue } from '@mui/material/colors';
import wiski_banner from '../assets/images/HomeAssets/wiski-banner.png';






const Home = ({userId}) => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const [student, setStudent] = useState({});
    const location = useLocation();
    const id = userId; 

    //---------------------------

    const [skillOfferings, setSkillOfferings] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [categories, setCategories] = useState([]);


    useEffect(() => {
        fetchSkillOfferings();
        fetchCategories();
    }, []);

    const fetchSkillOfferings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/skilloffering/getAllSkillOfferingRecord');
            setSkillOfferings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching skill offerings:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/category/getAllCategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    //---------------------------

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    
    const parseDate = (dateString) => {
        if (!dateString) return new Date();
        return new Date(dateString);
    };

    const fetchStudents = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/student/getStudentRecord');
            console.log("API response:", response.data);
            setStudents(response.data);
        } catch (error) {
            console.error("Error fetching students:", error);
            alert('Failed to fetch students.');
        }
    };

    useEffect(() => {
        //fetchStudents();

        const currentUser = async (id) => {
            try {
                const response = await api.get(`/getUserStudentRecord?id=${id}`);
                console.log(response.data);
                const fetchedStudent = response.data;
                fetchedStudent.birthdate = parseDate(fetchedStudent.birthdate);
                setStudent(fetchedStudent);
            } catch (error) {
                console.error('Error fetching student data', error);
            }
        };
        if (id) {
            currentUser(id);
        }
    }, [id]);

    const handleNavigate = (studentId) => {
        navigate(`/skill-offerings/${studentId}`);
    };

    return (
        <>
            <Grid2
                container
                sx={{
                    position: 'relative',
                    backgroundImage: `url(${wiski_banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '20vh',
                    minWidth: '100vw',
                    display: 'flex',
                    //justifyContent: 'center',
                    //alignItems: 'center',
                }}
            >
                {/* Text Overlay */}
                <Typography
                    variant="h4"
                    component="div"
                    sx={{
                        fontWeight:'bold',
                        position: 'absolute',
                        color: '#dd7156',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        padding: '70px 50px',
                        borderRadius: 2,
                        textAlign: 'center',
                        
                    }}
                >
                    「 Welcome back, {student.name}! 」
                </Typography>
                <Typography
                    variant="h5"
                    component="div"
                    sx={{
                        fontWeight:'bold',
                        position: 'absolute',
                        color: '#ffc400',
                        backgroundColor: 'rgba(0, 0, 0, 0)',
                        padding: '120px 120px',
                        borderRadius: 2,
                        textAlign: 'center',
                        
                    }}
                >
                    What service do you need today?
                </Typography>
            </Grid2>


            {/*<h1>What service do you need?</h1>

            <TextField id="outlined-basic" variant="outlined" size="small" style={{width: '500px', marginBottom: '10px'}} />
            <Divider style={{marginBottom: '50px', backgroundColor: 'black'}}/>*/}
            <Grid2
                container
                sx={{
                    backgroundColor: 'white',
                    paddingLeft:20,
                    paddingRight:20
                }}>
                    <Stack direction={'column'}>
                        <Grid2
                            container
                            sx={{
                                backgroundColor: 'white',
                                padding: '20px',
                            }}
                        >
                            <Grid2 item xs={12}>
                                </Grid2>
                                    <Grid container spacing={2}>
                                        {categories.map((category) => (
                                            <Grid item xs={12} sm={6} md={4} key={category.categoryId}>
                                                <Card style={{ border: '1px solid black', borderRadius: '10px' }}>
                                                    <CardContent>
                                                        <Typography variant="h6">{category.name}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
                                </Grid2>
                    <Typography variant='h5'>
                        Popular Services Right Now
                    </Typography>
                    {/*
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
                    */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                            {skillOfferings.map((offering) => (
                                
                                <Card key={offering.skillOfferingId} style={{ width: '250px', margin: '10px' }}>
                                    <CardActionArea
                                        onClick={() => !showCheckboxes && handleNavigate(offering.skillOfferingId)}
                                        style={{ cursor: showCheckboxes ? 'default' : 'pointer' }}
                                    >
                                    <CardContent>
                                        {showCheckboxes && (
                                            <Checkbox
                                                checked={selectedIds.includes(offering.skillOfferingId)}
                                                onChange={() => {
                                                    setSelectedIds((prev) =>
                                                        prev.includes(offering.skillOfferingId)
                                                            ? prev.filter((id) => id !== offering.skillOfferingId)
                                                            : [...prev, offering.skillOfferingId]
                                                    );
                                                }}
                                            />
                                        )}
                                        <Typography variant="h6">
                                            {offering.title}
                                        </Typography>
                                        <Typography variant="body2" color="textSecondary">
                                            {offering.description || "No description available"}
                                        </Typography>
                                    </CardContent>
                                </CardActionArea>
                            </Card>
                        ))}
                    </div>
                    </Stack>
                    
            </Grid2>
        </>
    );
};

export default Home;
