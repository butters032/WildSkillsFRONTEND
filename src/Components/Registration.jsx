import { Card, CardContent, Grid2, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";

import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormLabel from '@mui/material/FormLabel';

//ICONS
import '../LoginRegister.css'
import user_icon from '../assets/images/LoginRegistrationAssets/user_icon.png'
import user_password from '../assets/images/LoginRegistrationAssets/user_password.png'
import user_email from '../assets/images/LoginRegistrationAssets/user_email.png'
import user_calendar from '../assets/images/LoginRegistrationAssets/user_calendar.png'
import user_gender from '../assets/images/LoginRegistrationAssets/user_gender.png'
//CALENDAR THINGY
import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';
import { Padding } from "@mui/icons-material";

import { useNavigate } from "react-router-dom";

import RegistrationSuccess from "./RegistrationSuccess.jsx";


export default function Registration({ setIsRegistering }) {
    const nameRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmpasswordRef = useRef();
    const avatarRef = useRef(); // New ref for avatar upload
    const [birthdate, setBirthdate] = useState(new Date());
    const [gender, setGender] = useState('');
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const handleGenderInputChange = (e) => {
        setGender(e.target.value);
    };

    const checkEmailExists = async (email) => {
        try {
            const response = await api.get(`/checkEmailExists?email=${email}`);
            return response.data.exists;
        } catch (error) {
            console.error('Error checking email', error);
            return false;
        }
    };
 /*
        const emailExists = await checkEmailExists(emailRef.current.value);
        if (emailExists) {
            alert("Email has already been used");
            return;
        }
            */
    const newStudent = async () => {
        if (confirmpasswordRef.current.value !== passwordRef.current.value) {
            alert("Passwords Don't Match");
            return;
        }
    
        // Validate email (optional logic)
        // const emailExists = await checkEmailExists(emailRef.current.value);
        // if (emailExists) {
        //     alert("Email has already been used");
        //     return;
        // }
    
        // Encode avatar as Base64
        const avatarFile = avatarRef.current.files[0];
        let avatarBase64 = null;
        
        if (avatarFile) {
            const reader = new FileReader();
            const promise = new Promise((resolve, reject) => {
                reader.onload = () => resolve(reader.result.split(",")[1]); // Strip the `data:image/*;base64,` prefix
                reader.onerror = (err) => reject(err);
            });
            reader.readAsDataURL(avatarFile);
            avatarBase64 = await promise;
            console.log(avatarBase64)
        }
        /*
        let avatarBase64 = null;
        if (avatarFile) {
            // Assume avatarBase64 is your base64-encoded string with the data URL prefix
            //let avatarBase64 = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==";

            // Strip the data URL prefix
            const reader = new FileReader(); 
            reader.readAsDataURL(avatarFile); 
            reader.onloadend = () => {avatarBase64 = (reader.result.split(',')[1]); // This will give you the base64 string without the prefix 
            console.log(avatarBase64);
            };



        }
        if (avatarBase64.startsWith("data:image/")) {
                avatarBase64 = avatarBase64.split(",")[1];
            }
            console.log(avatarBase64);
        */
            
    
        // Create the request payload
        const studentData = {
            name: nameRef.current.value,
            birthdate: birthdate.toISOString().split('T')[0],
            email: emailRef.current.value,
            password: passwordRef.current.value,
            gender: gender,
            avatar: avatarBase64, // Add Base64 encoded avatar
        };
    
        try {
            // Send the data via API
            const req = await api.post('/postStudentRecord', studentData);
    
            alert("Registration Success");
            console.log(req.data);
            navigate('/login');
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Error during registration. Please try again.");
        }
    };
        
        
        

    const redirectToReg = () => {
        setIsRegistering(false);
    };

    return (
        <Card
            sx={{
                maxWidth: 400,
                margin: "auto",
                padding: 3,
                boxShadow: 3,
                borderTopRightRadius: 10,
                borderBottomRightRadius: 10,
                backgroundColor: '#ffe6d1',
                opacity: '90%'
            }}
        >
            <>
                <div className="container">
                    <div className="header">
                        <Typography variant="h5">Sign Up</Typography>
                        <div className="underline"></div>
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input ref={nameRef} type="text" placeholder="Name" />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <Typography variant="body2" sx={{ paddingRight: 1 }}>Date of Birth</Typography>
                        <DatePicker
                            onChange={setBirthdate}
                            value={birthdate}
                            maxDate={new Date()}
                            disableCalendar={true}
                        />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <Typography variant="body2">Gender</Typography>
                        <Grid2>
                            <RadioGroup
                                row
                                value={gender}
                                onChange={handleGenderInputChange}
                                aria-labelledby="gender-radio-group-label"
                                name="gender"
                            >
                                <FormControlLabel value="female" control={<Radio />} label="Female" />
                                <FormControlLabel value="male" control={<Radio />} label="Male" />
                                <FormControlLabel value="other" control={<Radio />} label="Other" />
                            </RadioGroup>
                        </Grid2>
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input ref={emailRef} type="email" placeholder="Email" />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input ref={passwordRef} type="password" placeholder="Password" />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input ref={confirmpasswordRef} type="password" placeholder="Confirm Password" />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <input ref={avatarRef} type="file" accept="image/*" /> {/* File input for avatar */}
                    </div>
                </div>
                <Grid2 sx={{ paddingTop: 1 }}>
                    <button onClick={newStudent}>Submit</button>
                </Grid2>
                <Grid2 sx={{ paddingTop: 1 }}>
                    <button onClick={redirectToReg}>Already Have An Account? Login now</button>
                </Grid2>
            </>
        </Card>
    );
}
