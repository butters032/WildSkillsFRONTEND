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

export default function Registration() {
    const nameRef = useRef();
    //const ageRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    const confirmpasswordRef = useRef();

    const [birthdate, setBirthdate] = useState(new Date());
    const [gender, setGender] = useState('');

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

        try {
            const req = await api.post('/postStudentRecord', {
                name: nameRef.current.value,
                birthdate: birthdate.toISOString().split('T')[0],
                email: emailRef.current.value,
                password: passwordRef.current.value,
                gender: gender,
            });

            console.log(req.data);
            alert("Registration Success");
            nameRef.current.value = null;
            birthdate.value = null;
            emailRef.current.value = null;
            passwordRef.current.value = null;
            confirmpasswordRef.current.value = null;
            setGender(null);
            setBirthdate(null);
        } catch (error) {
            console.log('ENK ENK', error);
        }
    };

    return (
        <Card sx={{minWidth:500, minHeight:500}}>
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
                        <Typography variant="body2" sx={{paddingRight:1}}>Date of Birth</Typography>
                        <DatePicker 
                            placeholder="Birth Date"
                            onChange={setBirthdate} 
                            value={birthdate} 
                            maxDate={new Date()}
                            disableCalendar={true}
                            
                        />
                    </div>
                </div>
                <div className="inputs">
                    <div className="input">
                        <img src={user_gender} alt= "Gender" />
                        <Typography variant="body2">Gender</Typography>
                        <Grid2 size={{ xs: 12, md: 6 }}>
                        <RadioGroup sx={{marginLeft:'2rem'}}
                                    row
                                    value={gender}
                                    onChange={handleGenderInputChange}
                                    aria-labelledby="demo-row-radio-buttons-group-label"
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
                        <input ref={confirmpasswordRef} type="password" placeholder="Confirm Password" />
                    </div>
                </div>
                <Grid2 sx={{paddingTop:1}}>
                    <button onClick={newStudent}>Submit</button>
                </Grid2>
                         
            </>
        </Card>
        

    );
}