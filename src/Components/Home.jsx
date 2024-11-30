import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate, useLocation } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, CardActionArea, Typography, Grid2, Stack, Avatar, Box } from '@mui/material';
import { useState, useEffect } from 'react';
import axios from 'axios';
import { blue } from '@mui/material/colors';
//import wiski_banner from '../assets/images/HomeAssets/wiski-banner.png';
import wiski_banner from '../assets/images/HomeAssets/wiski-banner-full.png';
import wiski_cat from '../assets/images/HomeAssets/wiski-cat.png';
import wiski_card_small from '../assets/images/HomeAssets/wiski-small-card.png';


//for the font
import '../Home.css';






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
                    position: 'relative',
                    backgroundImage: `url(${wiski_banner})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    minHeight: '78vh',
                    minWidth: '100vw',
                    display: 'flex',
                }}
            >
                <Stack direction={'column'}>
                    <Box
                        sx={{
                            display: 'flex',
                            //padding: '170px 80px',
                            paddingTop:'170px',
                            paddingLeft:'80px',
                            paddingBottom:'-5px',
                            gap: 2, 
                            position: 'relative',
                        }}
                    >
                        <Avatar
                            alt="profile-pic"
                            variant="circle"
                            src={wiski_banner}
                            sx={{
                                width: '18vh',
                                height: '8vw',
                            }}
                        />

                        <Box
                        >
                            <Typography
                                //variant="h1"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: '#ffde59',
                                    textAlign: 'left',
                                    fontFamily: 'Proxima Nova Bold',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    fontSize: 80,
                                    lineHeight: 1
                                }}
                            >
                                Hello
                            </Typography>

                            <Typography
                                //variant="h2"
                                component="div"
                                sx={{
                                    fontWeight: 'bold',
                                    color: 'white',
                                    textAlign: 'left',
                                    fontFamily: 'Proxima Nova Bold',
                                    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                    fontSize: 50,
                                    lineHeight: 1
                                }}
                            >
                                {student.name}!
                            </Typography>
                            
                        </Box>
                    </Box>
                    
                    <Box
                        sx={{
                            paddingLeft: 10,
                            maxWidth:600,
                            justifyContent:'center'
                        }}
                    >
                        <Typography
                        sx={{
                            fontWeight: 'bold',
                            color: 'white',
                            textAlign: 'center',
                            fontFamily: 'Proxima Nova',
                            textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                            fontSize: 30,
                            paddingTop:'30px',
                            paddingBottom:'20px',
                            paddingLeft: '50px',
                            lineHeight: 1
                        }}>
                            Explore New Categories
                        </Typography>
                        <Grid container spacing={2} sx={{ justifyContent: 'center', paddingLeft: '50px' }}>
                            {randomCategories.map((category) => ( <Grid item xs={2} sm={2} md={2} key={category.categoryId}> 
                                <Card style={{ border: '1px solid black', borderRadius: '10px', minWidth: 250 , backgroundImage: `url(${wiski_card_small})`}}> 
                                    <CardContent> 
                                        <Typography variant="h6" sx={{ textAlign: 'center', }} > 
                                            {category.name} 
                                        </Typography> 
                                    </CardContent> 
                                </Card> 
                            </Grid> ))} 
                        </Grid>
                    </Box>
                </Stack>
                
                <Box sx={{ 
                    display: 'flex',
                    flexGrow: 1,
                    justifyContent: 'flex-end',
                    paddingRight: '120px',
                    

                    }}> 
                    <Box sx={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'center',
                        paddingTop: '250px'
                        
                        }} >
                    
                        <img 
                        src={wiski_cat}
                        style={{
                            alignItems:'center',
                            width:240,
                            height:120,
                        }}
                        />
                        <Typography 
                            variant="h1" 
                            component="div" 
                            sx={{ fontWeight: 'bold',
                                color: 'white',
                                textAlign: 'center',
                                fontFamily: 'Etna',
                                letterSpacing: 10,
                                textTransform: 'uppercase',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                lineHeight: 0.5
                                
                            }} 
                            > Welcome to 
                        </Typography> 
                        <Typography 
                            variant="h1" 
                            component="div" 
                            sx={{ fontWeight: 'bold',
                                color: 'white',
                                textAlign: 'center',
                                fontFamily: 'Etna',
                                letterSpacing: 10,
                                textTransform: 'uppercase',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                lineHeight: 1.3
                            }} 
                            > Wildskills
                        </Typography>
                        <Typography 
                            
                            component="div" 
                            sx={{ fontWeight: 'bold',
                                color: '#f6bb21',
                                textAlign: 'center',
                                fontFamily: 'Etna',
                                letterSpacing: 10,
                                //textTransform: 'uppercase',
                                textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                lineHeight: 2,
                                fontSize:20
                            }} 
                            > A skill exchange site
                        </Typography> 
                    </Box>

                </Box>
                
                                
            </Grid2>



            {/*<h1>What service do you need?</h1>

            <TextField id="outlined-basic" variant="outlined" size="small" style={{width: '500px', marginBottom: '10px'}} />
            <Divider style={{marginBottom: '50px', backgroundColor: 'black'}}/>*/}
            <Grid2
                container
                sx={{
                    backgroundColor: '#222222',
                    paddingTop:20,
                    paddingLeft:10,
                    minWidth:'100vw'
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
                            <Grid2 item xs={12}>
                                </Grid2>
                                    <Grid container spacing={27} sx={{flexWrap: 'nowrap', maxWidth:'90vw'}}>
                                        {categories.map((category) => (
                                            <Grid item xs={12} sm={6} md={4} key={category.categoryId}>
                                                <Card style={{ 
                                                    //border: '1px solid black', 
                                                    //borderRadius: '10px',
                                                    
                                                    minWidth: 200, 
                                                    justifyItems:'center', 
                                                    backgroundColor:'#222222' }}>
                                                    <CardContent>
                                                        <Typography variant="h6" sx={{
                                                            color: 'white',
                                                            textAlign: 'center'
                                                        }}>{category.name}</Typography>
                                                    </CardContent>
                                                </Card>
                                            </Grid>
                                        ))}
                                    </Grid>
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
                    <div style={{justifyContent: 'center', marginTop: '20px' }}>
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
