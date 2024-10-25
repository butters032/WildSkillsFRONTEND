import { Grid2, Stack, Typography } from "@mui/material";
import axios from "axios";
import { useRef } from "react";

export default function Registration(){
    const nameRef = useRef();
    const birthdayRef = useRef();
    const ageRef = useRef();
    const emailRef = useRef();
    const passwordRef = useRef();
    
    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    })

    const newStudent = () =>{
        api.post('/postStudentRecord',{
            name: nameRef.current.value,
            birthdate: birthdayRef.current.value,  
            age: ageRef.current.value,
            email: emailRef.current.value,
            password: passwordRef.current.value       
        })
        .then((req) => {
            console.log(req.data);
        })
        .catch((error) =>{
            console.log('ENK ENK',error)
        })
    }

    return (
        <>
            <Typography variant="h1">REGISTER</Typography>
            <Grid2>
                <Stack direction={"column"}>
                    <Grid2 sx={{minWidth: 1000, minHeight: 100, border: 'solid 1px', borderRadius:5,padding: 5}}>
                        <Stack direction={"column"}>
                            <Grid2 sx={{minWidth: 1000, minHeight: 100}}>
                                <Stack direction={"column"}>
                                <label for="studName">Name: </label>
                                <input type="text" id ='studName' ref={nameRef} placeholder="Enter name"></input>

                                <label for="studBirthDate">Birth Date: </label>
                                <input type="text" id ='studName' ref={nameRef} placeholder="Enter name" ></input>

                                <label for="studName">Age: </label>
                                <input type="text" id ='studName' ref={nameRef} placeholder="Enter name"></input>

                                <label for="studEmail">Email: </label>
                                <input type="text" id ='studEmail' ref={emailRef} placeholder="Enter name"></input>

                                <label for="studPassword">Password: </label>
                                <input type="text" id ='studPassword' ref={passwordRef} placeholder="Enter name"></input>

                                <label for="studConfirmPassword">Confirm Password: </label>
                                <input type="text" id ='studConfirmPassword' ref={nameRef} placeholder="Enter name"></input>
                                </Stack>
                            </Grid2>
                        </Stack>
                    </Grid2>
                </Stack>
            </Grid2>
        </>
    )

}