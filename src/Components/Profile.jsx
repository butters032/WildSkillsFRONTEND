import { Card, Typography } from "@mui/material";
import axios from "axios";
import '../LoginRegister.css'

export default function Profile(){

    const api=axios.create({
        baseURL:"http://localhost:8080/api/wildSkills/student",
        timeout:1000,
        headers:{
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    return (
        <Card sx={{maxHeight:600, minWidth: 1000, padding: 4}}>
            <>
                <div class="container">
                    <div class="header">
                        <Typography> Profile</Typography>
                    </div>

                </div>
            </>

        </Card>
    )
}