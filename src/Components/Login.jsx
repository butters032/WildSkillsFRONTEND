import { Card, CardContent, Grid2, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";
import { useNavigate } from 'react-router-dom';

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

import RegistrationSuccess from "./RegistrationSuccess";

export default function Login({ setAuthenticated, setUserId, setAuthId}) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const apiAuth = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/authentication',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    const handleLogin = async () => {
        try {
            const response = await api.post('/login', {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            });
            //const authResponse = await apiAuth.post('/getAuthenticationDetails');

            //const authResponse = await apiAuth.put(`/putAuthenticationDetails?authId=${response.data.authId.authId}`);
            //console.log(authResponse.data);

            if (response.data.status === "Login Successful") {
                const studentId = response.data.studentId;
                const authId = response.data.authId.authId;
                if (studentId) {
                    alert("Login Successful");
                    setAuthenticated(true);
                    const authResponse = await apiAuth.put(`/putIncrementAuthenticationDetails?authId=${authId}`);
                    console.log('Sud sa authResponse: ',authResponse);

                    navigate('/', { state: { studentId: studentId } });
                    setUserId(studentId);
                    setAuthId(authId);



                    
                } else {
                    alert("Login failed, no studentId received.");
                }
            } else {
                alert("Login Failed: " + response.data.message);
            }
        } catch (error) {
            console.error('Error during login', error);
            alert('Error during login: ' + error.message);
        }
    };
    
    return (
        <Card sx={{minWidth:500, minHeight:500}}>
            <>
                <div className="container">
                    <div className="header">
                        <Typography variant="h5">Login</Typography>
                        <div className="underline"></div>
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_email} alt="Email Icon" />
                        <input ref={emailRef} type="email" placeholder="Email" />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_password} alt="Password Icon" />
                        <input ref={passwordRef} type="password" placeholder="Password" />
                    </div>
                </div>
                <Grid2 sx={{paddingTop:1}}>
                    <button onClick={handleLogin}>Submit</button>
                </Grid2>
            </>
        </Card>
    );
}
