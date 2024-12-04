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

    const newStudent = async () => {
        if (confirmpasswordRef.current.value !== passwordRef.current.value) {
            alert("Passwords Don't Match");
            return;
        }

        const emailExists = await checkEmailExists(emailRef.current.value);

        if (emailExists) {
            alert("Email has already been used");
            return;
        }

        const formData = new FormData();
        formData.append('name', nameRef.current.value);
        formData.append('birthdate', birthdate.toISOString().split('T')[0]);
        formData.append('email', emailRef.current.value);
        formData.append('password', passwordRef.current.value);
        formData.append('gender', gender);

        if (avatarRef.current.files[0]) {
            formData.append('avatar', avatarRef.current.files[0]); // Append avatar file
        }

        try {
            const response = await api.post('/postStudentRecord', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            console.log(response.data);
            alert("Registration Success");
            setTimeout(() => navigate('/login'), 100);
        } catch (error) {
            console.error('Error during registration:', error);
            alert("Registration Failed");
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
