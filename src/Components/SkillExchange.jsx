import { Button, Grid2, Stack, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { Edit, Delete, Reviews, Save } from '@mui/icons-material'
import axios from 'axios'
import Chat from './Chat.jsx'
import { useNavigate } from "react-router-dom";

export default function SkillExchange({userId}) {
    const [exchange, setExchange] = useState([])
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [title, setTitle] = useState('');
    const [scheduledStart, setScheduledStart] = useState('');
    const [scheduledEnd, setScheduledEnd] = useState('');

    const [isEditing, setIsEditing] = useState(false)
    const [currentExchange, setCurrentExchange] = useState(null)

    const navigate = useNavigate();

    const api = axios.create({
        baseURL: `http://localhost:8080/api/wildSkills/skillExchange/student/${userId}`,
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const deleteExchange = (id) =>{
        api.delete(`/deleteSkillExchange/${id}`)
        .then(() =>{
            exchangeReload();
        })
        .catch((error) =>{
            console.log('Error deleting Skill Exchange',error)
        })
    }

    const editExchange = () => {
        api.put(`/putSkillExchangeDetails?id=${id}`, {
            status,
            title,
            scheduledStart,
            scheduledEnd,
        })
        .then(() =>{
            exchangeReload();
            setId('');
            setStatus('');
            setTitle('');
            setScheduledStart('');
            setScheduledEnd('');
            setIsEditing(false);
            setCurrentExchange(null)
        })
        .catch((error) =>{
            console.log('Error editing Skill Exchange',error);
        })
    }

    const edit = () => { 
        if (!isEditing){
            setIsEditing(true); 
        } else {
            setIsEditing(false);
        }
    };

    const handleEditExchange = (id, status, title, scheduledStart, scheduledEnd) =>{
        setId(id);
        setStatus(status);
        setTitle(title);
        setScheduledStart(scheduledStart);
        setScheduledEnd(scheduledEnd);
        setCurrentExchange({ id, status, title, scheduledStart, scheduledEnd });
        console.log(isEditing)
    }

    const exchangeReload = () => {
        api.get('')
        .then((exc) => {
            setExchange(exc.data);
            console.log(exc);
        })
        .catch((error) =>{
            console.log('Error reading Skill Exchange',error);
        });
    }

    const newExchange = () =>{
        api.post('/postSkillExchange', {
            status: 'Ongoing',
            title,
            scheduledStart,
            scheduledEnd,
        })
        .then((exc) =>{
            console.log(exc.data);
            exchangeReload();
            setTitle('');
            setScheduledStart('');
            setScheduledEnd('');
        })
        .catch((error) =>{
            console.log('Error creating Skill Exchange',error)
        })
    }

    //skill exchange display/get
    useEffect(() =>{
        exchangeReload();
    }, [])

    const handleReviewClick = () => {
        navigate(`/reviews`);
    };

    return (
        <>
            <Grid2 container spacing={2} direction="row" marginTop={2} marginLeft={5} marginRight={5}>
                <Grid2 item xs={3} sx={{ boxShadow: 3, minHeight: "100%", minWidth: 400, borderRadius: 3, backgroundColor: "#f5f5f5", overflowY: "auto", overflowX: "hidden" }}>
                    <Typography variant="h5" sx={{ justifySelf: "left", paddingLeft: 2 }}>Active Exchange</Typography>
                    {exchange.map((exc, index) => (
                        <Grid2 key={index}
                            sx={{ boxShadow: 4,
                                minHeight: 70,
                                margin: "auto",
                                marginTop: 1,
                                borderRadius: 3,
                                padding: 1,
                                marginLeft: 1,
                                marginRight: 1,
                                cursor: "pointer",
                                backgroundColor: "#f5f5f5",
                                transition: "background-color 0.3s, box-shadow 0.3s",
                                "&:hover": {
                                    backgroundColor: "#e3e3e3",
                                    boxShadow: 6,
                                }
                            }}
                            onClick={() => { handleEditExchange(exc.skillExchangeID, exc.status, exc.title, exc.scheduledStart, exc.scheduledEnd) }}>
                            <Typography variant="h5">{exc.title}</Typography>
                            <Typography variant="body1" justifySelf={"left"}><strong>Status: </strong>{exc.status}</Typography>
                            {/*<Typography variant="body2" justifySelf={"left"}>Scheduled Start: {new Date(exc.scheduledStart).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</Typography>
                            <Typography variant="body2" justifySelf={"left"}>Scheduled End: {new Date(exc.scheduledEnd).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</Typography>*/}
                        </Grid2>
                    ))}
                </Grid2>

                <Grid2 item xs={6}>
                    <Chat />
                </Grid2>

                <Grid2 item xs={3} sx={{ boxShadow: 3, minHeight: 700, minWidth: 400, borderRadius: 3, backgroundColor: "#f5f5f5", padding: 2 }}>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="column">
                            <Typography variant="h5" sx={{ alignSelf: "center", fontWeight: 'bold'}}>
                                {currentExchange ? currentExchange.title : 'Select an Exchange'}
                            </Typography>
                            <Typography variant="body1" sx={{ alignSelf: "center", color: '#555'}}>
                                {currentExchange ? currentExchange.status : ''}
                            </Typography>
                            <Typography variant="body1" sx={{ alignSelf: "center", color: '#555' }}>
                                {currentExchange ? new Date(currentExchange.scheduledStart).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : ''} -
                            </Typography>
                            <Typography variant="body1" sx={{ alignSelf: "center", color: '#555', marginBottom: 5 }}>
                                {currentExchange ? new Date(currentExchange.scheduledEnd).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : ''}
                            </Typography>
                        </Stack>

                        <Stack direction="column" spacing={0}>
                            <Button
                                variant="text"
                                onClick={edit}
                                startIcon={<Edit/>}
                                sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", justifyContent: 'flex-start'}}>
                                Edit
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => { deleteExchange(excidRef.current.value) }}
                                startIcon={<Delete/>}
                                sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", justifyContent: 'flex-start'}}>
                                Delete
                            </Button>
                            <Button
                                variant="text"
                                onClick={() => { handleReviewClick() }}
                                startIcon={<Reviews/>}
                                sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", justifyContent: 'flex-start'}}>
                                Review
                            </Button>
                        </Stack>
                        {isEditing && ( 
                                <Stack alignItems={"center"}> 
                                    <label htmlFor="estatus" style={{ marginTop: '16px' }}>Update Status:</label> 
                                    <select id="estatus" value={status} defaultValue="Ongoing" onChange={(e) => setStatus(e.target.value)} style={{ padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px', minWidth: 220 }}> 
                                        <option value="Ongoing">Ongoing</option> 
                                        <option value="Cancelled">Cancelled</option> 
                                        <option value="Completed">Completed</option> 
                                    </select> 
                                    
                                    <label>Update Schedule Start:</label> 
                                    <input type="datetime-local" value={scheduledStart} onChange={(e) => setScheduledStart(e.target.value)} placeholder="Schedule Start" style={{ padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }} /> 
                                    
                                    <label>Update Schedule End:</label> 
                                    <input type="datetime-local" value={scheduledEnd} onChange={(e) => setScheduledEnd(e.target.value)} placeholder="Schedule End" style={{ padding: '8px', borderRadius: '4px', marginBottom: '12px', fontSize: '14px' }} /> 
                                    
                                    <Button variant="outlined" onClick={editExchange} startIcon={<Save/>} sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", marginTop: 2 }} > Submit </Button> 
                                </Stack> 
                            )}
                    </Stack>
                </Grid2>
            </Grid2>
        </>
    )    
}