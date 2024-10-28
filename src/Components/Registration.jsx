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
            <Grid2 sx={{backgroundColor: "white"}}>
                <Stack direction={"row"}>
                    <Grid2 sx={{minWidth: 1000, minHeight: 100, border: 'solid 1px', borderRadius:5,padding: 5}}>
                        <Stack direction={"row"}>
                            <Grid2 sx={{minWidth: 1000, minHeight: 100}}>
                                <Stack direction={"column"}sx={{alignContent:"center"}}>
                                    <Stack direction={"row"} spacing={3}>
                                        <Grid2 sx={{border:'solid 1px',padding:1, borderRadius:2}}>
                                            <input type="text" id ='studName' ref={nameRef} placeholder="Enter First Name" ></input>
                                        </Grid2>
                                        <Grid2 sx={{border:'solid 1px',padding:1, borderRadius:2}}>
                                            <input type="text" id ='studName' ref={nameRef} placeholder="Enter Last Name" ></input>
                                        </Grid2>
                                    </Stack>

                                <label for="studBirthDate">Birth Date: </label>
                                <input type="text" id ='studName' ref={nameRef} placeholder="Enter Birthdate" ></input>


                                <label for="studEmail">Email: </label>
                                <input type="text" id ='studEmail' ref={emailRef} placeholder="Enter email"></input>

                                <label for="studPassword">Password: </label>
                                <input type="text" id ='studPassword' ref={passwordRef} placeholder="Enter paswword"></input>

                                <label for="studConfirmPassword">Confirm Password: </label>
                                <input type="text" id ='studConfirmPassword' ref={nameRef} placeholder="Confirm password"></input>
                                </Stack>
                            </Grid2>
                        </Stack>
                    </Grid2>
                </Stack>
            </Grid2>
        </>
    )

}