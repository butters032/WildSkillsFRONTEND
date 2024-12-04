import React, { useEffect, useState } from "react";
import {Card,CardContent,Stack,Typography,Button,TextField,Box,Avatar,Grid2,} from "@mui/material";
import axios from "axios";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import DatePicker from "react-date-picker";
import userIcon from "../assets/images/LoginRegistrationAssets/user_icon.png";
import wiskiBanner from "../assets/images/HomeAssets/wiski-banner-full.png";

import { useLocation } from 'react-router-dom';

//const parseDate = (dateString) => (dateString ? new Date(dateString) : new Date());

const parseDate = (dateString) => {
    if (!dateString) return new Date();
    return new Date(dateString);
};

export default function Profile({userId}) {
    const [student, setStudent] = useState({});
    const [isEditing, setIsEditing] = useState(false);
    const location = useLocation();
    const [profilePic,setProfilePic]= useState('');
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
                setProfilePic("data:image/png;base64,"+fetchedStudent.avatar);
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
                    reader.onload = () => resolve(reader.result.split(",")[1]);
                    reader.onerror = (err) => reject(err);
                });
    
                reader.readAsDataURL(avatarFile);
                avatarBase64 = await promise;
    
                console.log('Avatar in base64:', avatarBase64);
                setProfilePic("data:image/png;base64,"+avatarBase64);
    
               
                setStudent(prevState => ({
                    ...prevState,
                    avatar: avatarBase64
                }));
            } else {
                alert('Please upload a PNG image');
                return; 
            }
        }
    
        if (name !== 'avatar') {
            setStudent(prevState => ({
                ...prevState,
                [name]: updatedValue
            }));
        }
    };
    

    useEffect(() => {
        console.log('Updated student state:', student);
    }, [student]); 
    
    
    
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
            const response = await api.delete(/deleteStudentRecord?id=${22});
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
        backgroundImage: `url(${wiskiBanner})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        minHeight: "100vh",
        minWidth:'99vw',
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        }}
        >
        <Card
        sx={{
        maxWidth: 500,
        padding: 4,
        boxShadow: 6,
        borderRadius: 4,
        background: "linear-gradient(135deg, #ffe6d1, #ffc0cb)",
        alignItems:"center"
        }}
        >
            <CardContent>
                <Stack spacing={3}>
                    <Typography variant="h4" align="center" fontWeight="bold" gutterBottom>
                        {isEditing ? "Edit Profile" : "Profile"}
                    </Typography>
                <Box
                    sx={{
                    width: 50,
                    height: 4,
                    backgroundColor: "#ffc400",
                    margin: "0 auto",
                    alignSelf:"center"

                    }}
                />
                <Box textAlign="center">
                <Avatar
                    alt="profile-pic"
                    variant="circle"
                    src={profilePic || userIcon}
                    //src={student.avatar}
                    //alt="User Avatar"
                    sx={{ width: 100, height: 100, margin: "0 auto", mb: 2 }}
                    />
                    {isEditing && (
                <Button
                    variant="outlined"
                    component="label"
                    sx={{ width: "100%" }}
                    >
                    Upload Avatar
                    <input
                        type="file"
                        accept="image/*"
                        name="avatar"
                        hidden
                        onChange={handleChange}
                    />
                </Button>
                )}
                </Box>
                <TextField
                    label="Name"
                    name="name"
                    value={student.name || ""}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                    variant="outlined"
                />
                <Box>
                <Typography>Date of Birth</Typography>
                <DatePicker
                    name="birthdate"
                    onChange={(date) =>
                    handleChange({ target: { name: "birthdate", value: date } })
                    }
                    value={student.birthdate || new Date()}
                    disabled={!isEditing}
                    />
                </Box>
                <Box>
                    <Typography>Gender</Typography>
                    <RadioGroup
                        row
                        name="gender"
                        value={student.gender || ""}
                        onChange={handleChange}
                    >
                    <FormControlLabel 
                        value="male" 
                        control={<Radio />} 
                        label="Male" 
                        disabled={!isEditing}
                    />
                    <FormControlLabel 
                        value="female" 
                        control={<Radio />} 
                        label="Female" 
                        disabled={!isEditing}
                    />
                    <FormControlLabel 
                        value="other" 
                        control={<Radio />} 
                        label="Other" 
                        disabled={!isEditing}
                    />
                    </RadioGroup>
                </Box>

                    <TextField
                    label="Email"
                    name="email"
                    value={student.email || ""}
                    onChange={handleChange}
                    fullWidth
                    disabled={!isEditing}
                    variant="outlined"
                />
                {isEditing && (
                    <TextField
                        label="Password"
                        name="password"
                        type="password"
                        value={student.password || ""}
                        onChange={handleChange}
                        fullWidth
                        variant="outlined"
                    />
                )}
                <Stack direction="row" justifyContent="space-between">
                    {isEditing ? (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={handleSaveClick}

                        >
                        Save
                        </Button>
                        ) : (
                        <Button
                            variant="contained"
                            color="error"
                            onClick={handleDeleteClick}

                        >
                    Delete Account
                    </Button>
                    )}
                    {!isEditing && (
                        <Button
                            variant="contained"
                            color="primary"
                            onClick={() => setIsEditing(true)}

                        >
                    Edit Profile
                    </Button>
                    )}
                    </Stack>
                </Stack>
            </CardContent>
        </Card>
    </Grid2>
);
}
