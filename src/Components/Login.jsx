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

import RegistrationSuccess from "./RegistrationSuccess";

export default function Login() {

    const emailRef = useRef();
    const passwordRef = useRef();

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
        console.log(gender);
    };

    const validateDetails = () => {
        if(confirmpasswordRef.current.value === passwordRef.current.value){
            api.post('/postStudentRecord', {
                name: nameRef.current.value,
                birthdate: birthdate.toISOString().split('T')[0],
                email: emailRef.current.value,
                password: passwordRef.current.value,
                gender: gender,
            })
            .then((req) => {
                console.log(req.data);
                nameRef.current.value=null;
                birthdate.value=null;
                emailRef.current.value=null;
                passwordRef.current.value=null;
                confirmpasswordRef.current.value=null;
                setGender(null);
                setBirthdate(null);

                
            })
            .catch((error) => {
                console.log('ENK ENK', error);
            });
        }
        else{
            alert("Passwords Don't Match")
        }
    };

    return (
        <Card c>
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
                    <button onClick={validateDetails}>Submit</button>
                </Grid2>
                         
            </>
        </Card>
        

    );
}