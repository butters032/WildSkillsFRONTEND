import { Card, Grid2, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRef, useState } from "react";

//ICONS
import '../LoginRegister.css'
import user_icon from '../assets/images/LoginRegistrationAssets/user_icon.png'
import user_password from '../assets/images/LoginRegistrationAssets/user_password.png'
import user_email from '../assets/images/LoginRegistrationAssets/user_email.png'
import user_calendar from '../assets/images/LoginRegistrationAssets/user_calendar.png'

//CALENDAR THINGY
import 'react-date-picker/dist/DatePicker.css';
import DatePicker from 'react-date-picker';
import { Padding } from "@mui/icons-material";

export default function Registration() {
    const nameRef = useRef();
    const ageRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmpasswordRef = useRef();

    const [birthdate, setBirthdate] = useState(new Date());

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const newStudent = () => {
        if(confirmpasswordRef.current.value === passwordRef.current.value){
            api.post('/postStudentRecord', {
                name: nameRef.current.value,
                birthdate: birthdate.toISOString().split('T')[0], // Format to 'YYYY-MM-DD'
                email: emailRef.current.value,
                password: passwordRef.current.value
            })
            .then((req) => {
                console.log(req.data);
            })
            .catch((error) => {
                console.log('ENK ENK', error);
            });
        }
        else{
            alert("Password Dont Match")
        }
    };

    return (
        <Card sx={{maxHeight:600, maxWidth: 400, padding: 4}}>
            <>
                <div className="container">
                    <div className="header">
                        <Typography variant="h5">Sign Up</Typography>
                        <div className="underline"></div>
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_icon} alt="User Icon" />
                        <input ref={nameRef} type="text" placeholder="Name" />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_calendar} alt="Calendar Icon" />
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
                <div className="inputs">
                    <div className="input">
                        <img src={user_password} alt="Password Icon" />
                        <input ref={confirmpasswordRef} type="confirmpassword" placeholder="Confirm Password" />
                    </div>
                </div>
                <Grid2 sx={{paddingTop:1}}>
                    <button onClick={newStudent}>Submit</button>
                </Grid2>            
            </>
        </Card>

    );
}