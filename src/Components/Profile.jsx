import { Card, CardContent, Grid2, Stack, Typography, Button, TextField } from "@mui/material";
import axios from "axios";
import { useEffect, useState,Box } from "react";
import { useLocation } from 'react-router-dom';

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import DatePicker from 'react-date-picker';

import '../LoginRegister.css';
import user_icon from '../assets/images/LoginRegistrationAssets/user_icon.png';
import user_password from '../assets/images/LoginRegistrationAssets/user_password.png';
import user_email from '../assets/images/LoginRegistrationAssets/user_email.png';
import user_calendar from '../assets/images/LoginRegistrationAssets/user_calendar.png';
import user_gender from '../assets/images/LoginRegistrationAssets/user_gender.png';


import wiski_banner from '../assets/images/HomeAssets/wiski-banner-full.png';


const parseDate = (dateString) => {
    if (!dateString) return new Date();
    return new Date(dateString);
};

export default function Profile({userId}) {
    const [student, setStudent] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation();
    //const id = location.state?.studentId; 

    const id = userId;

    

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    useEffect(() => {
        
        const fetchStudent = async (id) => {
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
            fetchStudent(id);
        }
    }, [id]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        try {
            const response = await api.put(`/putStudentRecord?id=${id}`, student);
            setStudent(response.data);
            setIsEditing(false);
        } catch (error) {
            console.error('Error updating student data', error);
        }
    };

    const handleChange = async (e) => {
        const { name, value, files } = e.target;
        let updatedValue = value;
    
        let avatarBase64 = null;
        if (name === 'avatar' && files && files[0]) {
            const avatarFile = files[0];
    
            if (avatarFile.type === 'image/png') {
                const reader = new FileReader();
                const promise = new Promise((resolve, reject) => {
                    reader.onload = () => resolve(reader.result.split(",")[1]); // Strip the `data:image/png;base64,` prefix
                    reader.onerror = (err) => reject(err);
                });
    
                reader.readAsDataURL(avatarFile);
                avatarBase64 = await promise;  // Get the base64 string
    
                console.log('Avatar in base64:', avatarBase64);
    
                // Update state with the base64 value
                setStudent(prevState => ({
                    ...prevState,
                    avatar: avatarBase64
                }));
            } else {
                alert('Please upload a PNG image');
                return; // Stop further processing if the file type is incorrect
            }
        }
    
        // Update other fields
        if (name !== 'avatar') {
            setStudent(prevState => ({
                ...prevState,
                [name]: updatedValue
            }));
        }
    };
    
    // To check the updated state after it's been set, you can use useEffect:
    useEffect(() => {
        console.log('Updated student state:', student);
    }, [student]);  // This will log the updated state whenever 'student' changes
    
    
    
    /*
    const handleChange = (e) => {
        const { name, value } = e.target;
        setStudent(prevState => ({
            ...prevState,
            [name]: value
        }));
    };*/

    const handleDeleteClick = async () => {
        /*
        try {
            { 
            const response = await api.delete(`/deleteStudentRecord?id=${22}`);
            if (response.data === "Student Record Succesfully Deleted") {
                alert("Account Successfully Deleted");
                console.log('Student record deleted');
            } else {
                console.error('Error:', response.data);
                alert('Error deleting student record: ' + response.data);
            }
        } catch (error) {
            console.error('Error deleting student record', error);
            alert('Error deleting student record: ' + error.message);
        }   
        */
        api.delete(`/deleteStudentRecord/${id}`)
        .then(() => {
            alert("Account Successfully Deleted");
            console.log("Student record deleted");
        })
        .catch((error) => {
            console.error("Error deleting student record", error);
            alert("Error deleting student record: " + error.message);
        });
    };

return (
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
        <Card sx={{
                    maxWidth: 400,
                    minWidth: '28vw',
                    margin: "auto",
                    mt: 8,
                    p: 3,
                    boxShadow: 3,
                    borderRadius: 3,
                    backgroundColor: '#ffe6d1'
                }}>
            {!isEditing && (
                <CardContent>
                    
                    <Stack spacing={4}>
                        <div className="container">
                            <div className="header">
                            <Typography variant="h4" gutterBottom 
                                sx={{
                                    fontFamily: 'Proxima Nova Bold',
                                }}>
                                    Profile Page
                                </Typography>
                                <div className="underline"></div>
                            </div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={user_icon} alt="User Icon" />
                                <Typography
                                    sx={{
                                        //fontWeight: 'bold',
                                        color: 'black',
                                        textAlign: 'left',
                                        fontFamily: 'Proxima Nova',
                                        //textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        fontSize: 17,
                                        lineHeight: 1
                                    }}>
                                        {student.name}
                                </Typography>
                                
                            </div>
                            
                        </div>
                        
                        <div className="inputs">
                            <div className="input">
                                <img src={user_calendar} alt="Calendar Icon" />
                                <DatePicker
                                    name="birthdate"
                                    onChange={date => handleChange({ target: { name: 'birthdate', value: date } })}
                                    value={student.birthdate || new Date()}
                                    maxDate={new Date()}
                                    disableCalendar={true}
                                    disabled
                                />
                            </div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={user_gender} alt="Gender" />
                                <Typography
                                    sx={{
                                        //fontWeight: 'bold',
                                        color: 'black',
                                        textAlign: 'left',
                                        fontFamily: 'Proxima Nova',
                                        //textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        fontSize: 17,
                                        lineHeight: 1
                                    }}>
                                        {student.gender}
                                </Typography>
                            </div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={user_email} alt="Email Icon" />
                                <Typography
                                    sx={{
                                        //fontWeight: 'bold',
                                        color: 'black',
                                        textAlign: 'left',
                                        fontFamily: 'Proxima Nova',
                                        //textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        fontSize: 17,
                                        lineHeight: 1
                                    }}>
                                        {student.email}
                                </Typography>
                            </div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <img src={user_password} alt="Password Icon" />
                                <Typography
                                    sx={{
                                        //fontWeight: 'bold',
                                        color: 'black',
                                        textAlign: 'left',
                                        fontFamily: 'Proxima Nova',
                                        //textShadow: '2px 2px 4px rgba(0, 0, 0, 0.5)',
                                        fontSize: 17,
                                        lineHeight: 1
                                    }}>
                                        {'********'}
                                </Typography>
                            </div>
                        </div>
                        <Grid2 container justifyContent="flex-end" sx={{justifyContent:"center", columnGap:20}}>
                            <Button variant="contained" color="error" onClick={handleDeleteClick}>Delete Account</Button>
                            <Button variant="contained" onClick={handleEditClick}>Edit Details</Button>
                        </Grid2>
                    </Stack>
                </CardContent>
            )}     
            {isEditing && (
                <CardContent>
                    <Stack spacing={4}>
                        <div className="container">
                            <div className="header">
                            <Typography variant="h4" gutterBottom 
                                sx={{
                                    fontFamily: 'Proxima Nova Bold',
                                }}>
                                    Login
                                </Typography>
                                <div className="underline"></div>
                            </div>
                        </div>

                        <div className="inputs">
                            <div className="input">
                                <img src={user_icon} alt="User Icon" />
                                <TextField
                                    label="Name"
                                    name="name"
                                    type="text"
                                    value={student.name || ''}
                                    onChange={handleChange}

                                />
                                {/*<input value={student.name || ''} type="text" placeholder="Name" label="Name"
                                    name="name"onChange={handleChange} /> */}
                            </div>
                        </div>

                        <div className="inputs">
                            <div className="input">
                                <img src={user_calendar} alt="Calendar Icon" />
                                <Typography variant="body2" sx={{ paddingRight: 1 }}>Date of Birth</Typography>
                                <DatePicker
                                    name="birthdate"
                                    onChange={date => handleChange({ target: { name: 'birthdate', value: date } })}
                                    value={student.birthdate || new Date()}
                                    maxDate={new Date()}
                                    disableCalendar={true}
                                />
                            </div>
                        </div>

                        <div className="inputs">
                            <div className="input">
                                <img src={user_gender} alt="Gender" />
                                <Typography variant="body2">Gender :</Typography>
                                <RadioGroup
                                    row
                                    name="gender"
                                    value={student.gender || ''}
                                    onChange={handleChange}
                                >
                                    <FormControlLabel value="female" control={<Radio />} label="Female" />
                                    <FormControlLabel value="male" control={<Radio />} label="Male" />
                                    <FormControlLabel value="other" control={<Radio />} label="Other" />
                                </RadioGroup>
                            </div>
                        </div>

                        <div className="inputs">
                            <div className="input">
                                <img src={user_email} alt="Email Icon" />
                                {/* Ill beautify this thing later with this for now kani sa*/}
                                    <TextField
                                    label="Email"
                                    name="email"
                                    type="email"
                                    value={student.email || ''}
                                    onChange={handleChange}

                                    />
                                
                                {/* <input value={student.email || ''} type="email" placeholder="Email" label="Email" name="email" onChange={handleChange} />*/}
                            </div>
                        </div>
                        <div className="inputs">
                            <div className="input">
                                <input 
                                    type="file" 
                                    accept="image/*" 
                                    name="avatar" 
                                    onChange={handleChange} 
                                />
                            </div>
                        </div>


                        <div className="inputs">
                            <div className="input">
                                <img src={user_password} alt="Password Icon" />
                                <TextField
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={student.password || ''}
                                    onChange={handleChange}

                                    />
                                {/*<input value={student.password || ''} type="text" placeholder="Password" label="Password" name="password"onChange={handleChange} /> */}
                            </div>
                        </div>

                        <Grid2 container justifyContent="flex-end">
                            <Button variant="contained" onClick={handleSaveClick}>Save Details</Button>
                        </Grid2>
                    </Stack>
                </CardContent>
            )}
        </Card>
    </Grid2>
    );
}