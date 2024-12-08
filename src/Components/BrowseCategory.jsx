import React,{useRef} from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { Card,Button, CardContent, CardActionArea, Typography, Grid2, Stack, Avatar, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { blue } from '@mui/material/colors';
//import wiski_banner from '../assets/images/HomeAssets/wiski-banner.png';
import wiski_banner from '../assets/images/HomeAssets/wiski-banner-full.png';
import wiski_cat from '../assets/images/HomeAssets/wiski-cat.png';
import wiski_card_small from '../assets/images/HomeAssets/wiski-small-card.png';


//for the font
import '../Home.css';


const BrowseCategory = ({userId}) => {
    const [students, setStudents] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    const [student, setStudent] = useState({});
    const location = useLocation();
    const id = userId; 

    //---------------------------

    const [skillOfferings, setSkillOfferings] = useState([]);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [categories, setCategories] = useState([]);

    const scrollRef = useRef(null);

    const scroll = (direction) => {
      if (direction === 'left') {
        scrollRef.current.scrollBy({ left: -300, behavior: 'smooth' });
      } else {
        scrollRef.current.scrollBy({ left: 300, behavior: 'smooth' });
      }
    };


    useEffect(() => {
        fetchSkillOfferings();
        fetchCategories();
    }, []);

    const fetchSkillOfferings = async (query) => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/skilloffering/searchByCategory',{
                params:{query},
                headers: {
                    'Content-Type': 'application/json', 
                    Accept: 'application/json', 
                },
            });
            console.log('Fetched Skill Offerings:', response.data);
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

    const handleNavigateToGigHome = (offering) => {
        navigate(`/gig-home/${offering.skillOfferingId}`, { state: offering });
    };

    const shuffleArray = (array) => { 
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]]; }
            return array;
        };

    const randomCategories = shuffleArray([...categories]).slice(0, 5);

    return (
        <>
            <Grid2
                container
                sx={{
                    backgroundColor: 'black',
                    paddingLeft:15,
                    minWidth:'100vw',
                    minHeight:'90vh'
                }}>
                    <Stack direction={'column'}>
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: 'white',
                                textAlign: 'left',
                                fontFamily: 'Proxima Nova',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                fontSize: 30,
                                paddingTop:'30px',
                                paddingBottom:'20px',
                                paddingLeft: '50px',
                                lineHeight: 1
                            }}>
                                Browse Categories
                        </Typography>
                        <Box
                            container
                            sx={{
                                //backgroundColor: 'white',
                                paddingTop: '20px',
                                paddingBottom: '20px',
                                paddingLeft: '20px',
                                overflowX: 'scroll',
                                display: 'flex',
                                height: "100%",
                                '&::-webkit-scrollbar': {
                                    width: '0.4em'
                                },
                                '&::-webkit-scrollbar-track': {
                                    boxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)',
                                    webkitBoxShadow: 'inset 0 0 6px rgba(0,0,0,0.00)'
                                },
                                '&::-webkit-scrollbar-thumb': {
                                    backgroundColor: 'rgba(0,0,0,.1)',
                                    outline: '1px solid slategrey'
                                }

                                
                            }}
                        >
                             <div style={{ display: 'flex', alignItems: 'center' }}>
                        <Button onClick={() => scroll('left')}>&lt;</Button>
                        <Grid container spacing={1} sx={{ flexWrap: 'nowrap', maxWidth: '78vw', overflowX: 'hidden',margin:'auto' }} ref={scrollRef}>
                            {categories.map((category) => (
                            <Grid item xs={12} sm={6} md={4} key={category.categoryId}
                                onClick={() => fetchSkillOfferings(category.name)}
                                sx={{ cursor: "pointer", flex: '0 0 auto', marginBottom: '10px' }}>
                                <Card style={{ 
                                margin: '10px', 
                                borderRadius: '15px', 
                                minWidth: 200, 
                                justifyItems: 'center', 
                                backgroundColor: '#333333', 
                                boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)' 
                                }}>
                                <CardContent sx={{ padding: '16px' }}>
                                    <Typography variant="h6" sx={{
                                    color: 'white',
                                    textAlign: 'center'
                                    }}>{category.name}</Typography>
                                </CardContent>
                                </Card>
                            </Grid>
                            ))}
                        </Grid>
                        <Button onClick={() => scroll('right')}>&gt;</Button>
                        </div>


                            </Box>
                        <Typography
                            sx={{
                                fontWeight: 'bold',
                                color: 'white',
                                textAlign: 'left',
                                fontFamily: 'Proxima Nova',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                fontSize: 30,
                                paddingTop:'30px',
                                paddingBottom:'20px',
                                paddingLeft: '50px',
                                lineHeight: 1
                            }}>
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
                    <Grid
                        container
                        sx={{
                            paddingTop: '20px',
                            paddingBottom: '20px',
                            paddingLeft: '20px',
                            display: 'flex',
                            height: '100%',
                        }}
                    >
                        <Grid container spacing={0} justifyContent="center" style={{ overflowY: skillOfferings.length > 0 ? 'scroll' : 'hidden', maxHeight: '60vh', padding: '20px' }}>
                            {skillOfferings.filter((offering) => userId !== offering.studentId).map((offering) => (
                                <Grid item key={offering.skillOfferingId} xs={12} sm={6} md={6} lg={4} style={{ display: 'flex', justifyContent: 'center', marginRight: '5px', marginLeft: '5px' }}>
                                    <Card
                                        style={{
                                            boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                            transition: '0.3s',
                                            width: '500px',
                                            height: '350px',
                                            margin: '20px',
                                            borderRadius: '10px',
                                        }}
                                    >
                            <CardActionArea
                                onClick={() => !showCheckboxes && handleNavigateToGigHome(offering)}
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
                                    <Typography variant="h6" style={{ fontWeight: 'bold' }}>
                                        {offering.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {offering.description || "No description available"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Grid>
                </Stack>
                </Grid2>
            
        </>
    );
};

export default BrowseCategory;
