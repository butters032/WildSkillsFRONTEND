import React, { useRef } from "react";
import { Card, CardContent, Typography, TextField, Button, Box, Grid, Grid2 } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import '../LoginRegister.css'

export default function Login({ setUserId, setAuthId }) {
    const emailRef = useRef();
    const passwordRef = useRef();
    const navigate = useNavigate();

    const api = axios.create({
        baseURL: "http://localhost:8080/api/wildSkills/student",
        timeout: 1000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const apiAuth = axios.create({
        baseURL: "http://localhost:8080/api/wildSkills/authentication",
        timeout: 1000,
        headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
        },
    });

    const handleLogin = async () => {
        try {
            const response = await api.post("/login", {
                email: emailRef.current.value,
                password: passwordRef.current.value,
            });

            if (response.data.status === "Login Successful") {
                const { studentId, authId } = response.data;
                if (studentId) {
                    await apiAuth.put(`/putIncrementAuthenticationDetails?authId=${authId.authId}`);
                    await apiAuth.put(`/putUpdateAuthenticationStatus?authId=${authId.authId}`);

                    setUserId(studentId);
                    setAuthId(authId.authId);

                    setTimeout(() => {
                        navigate("/");
                    }, 100);
                } else {
                    alert("Login failed, no studentId received.");
                }
            } else {
                alert("Login Failed: " + response.data.message);
            }
        } catch (error) {
            console.error("Error during login", error);
            alert("Error during login: " + error.message);
        }
    };

    const redirectToReg = () => {
        navigate("/registration");
    };

    return (
        <Card
            sx={{
                maxWidth: 400,
                margin: "auto",
                mt: 8,
                p: 3,
                boxShadow: 3,
                borderRadius: 3,
            }}
        >
            <CardContent>
                <Box textAlign="center" mb={3}>
                    <Typography variant="h4" gutterBottom>
                        Login
                    </Typography>
                    <Box
                        sx={{
                            width: 50,
                            height: 4,
                            backgroundColor: "#ffc400",
                            margin: "0 auto",
                        }}
                    />
                </Box>
                <Box mb={3}>
                    <TextField
                        fullWidth
                        label="Email"
                        type="email"
                        inputRef={emailRef}
                        variant="outlined"
                        margin="normal"
                    />
                    <TextField
                        fullWidth
                        label="Password"
                        type="password"
                        inputRef={passwordRef}
                        variant="outlined"
                        margin="normal"
                    />
                </Box>
                <Grid2 container spacing={2}>
                    <Grid2 item xs={12}>
                        <Button
                            fullWidth
                            variant="contained"
                            color="primary"
                            size="large"
                            onClick={handleLogin}
                        >
                            Submit
                        </Button>
                    </Grid2>
                    <Grid2 item xs={12}>
                        <Button
                            fullWidth
                            variant="outlined"
                            color="secondary"
                            size="large"
                            onClick={redirectToReg}
                        >
                            No Account Yet? Register Now
                        </Button>
                    </Grid2>
                </Grid2>
            </CardContent>
        </Card>
    );
}
