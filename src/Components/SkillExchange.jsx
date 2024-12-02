import { Button, Grid2, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, TextField, Select, MenuItem, InputLabel } from "@mui/material";
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

    const [isSelected, setIsSelected] = useState(false)
    const [currentExchange, setCurrentExchange] = useState(null)
    const [openDelete, setOpenDelete] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)

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
            setId('');
            setStatus('');
            setTitle('');
            setScheduledStart('');
            setScheduledEnd('');
            setIsSelected(false);
            setCurrentExchange(null);
            setOpenDelete(false);
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
            setIsSelected(false);
            setCurrentExchange(null);
            setOpenEdit(false);
        })
        .catch((error) =>{
            console.log('Error editing Skill Exchange',error);
        })
    }

    /*const edit = () => { 
        if (!isEditing){
            setIsEditing(true); 
        } else {
            setIsEditing(false);
        }
    };*/

    const handleExchange = (id, status, title, scheduledStart, scheduledEnd) =>{
        setId(id);
        setStatus(status);
        setTitle(title);
        setScheduledStart(scheduledStart);
        setScheduledEnd(scheduledEnd);
        setCurrentExchange({ id, status, title, scheduledStart, scheduledEnd });
        setIsSelected(true);
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

    /*const newExchange = (userId) =>{
        api.post(`/postSkillExchange/${creatorId}`, {
            status: 'Ongoing',
            title: '',
            scheduledStart: '',
            scheduledEnd: '',
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
    }*/

    //skill exchange display/get
    useEffect(() =>{
        exchangeReload();
    }, [])

    const handleReviewClick = () => {
        navigate(`/reviews`);
    };

    return (
        <>
            <Grid2 container spacing={2} direction="row" sx={{marginTop: 1.5, marginLeft: 2, marginRight: 2, width: '99%', minWidth: 'max-content'}}>
                <Grid2 item xs={12} sm={4} md={3} lg={3} xl={3} sx={{ boxShadow: 3, minHeight: "100%", minWidth: 400, borderRadius: 3, backgroundColor: "#f5f5f5", overflowY: "auto", overflowX: "hidden" }}>
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
                            onClick={() => { handleExchange(exc.skillExchangeID, exc.status, exc.title, exc.scheduledStart, exc.scheduledEnd) }}>
                            <Typography variant="h5">{exc.title}</Typography>
                            <Typography variant="body1" justifySelf={"left"}>{/*<strong>Status: </strong>*/}{exc.status}</Typography>
                            {/*<Typography variant="body2" justifySelf={"left"}>Scheduled Start: {new Date(exc.scheduledStart).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</Typography>
                            <Typography variant="body2" justifySelf={"left"}>Scheduled End: {new Date(exc.scheduledEnd).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</Typography>*/}
                        </Grid2>
                    ))}
                </Grid2>

                <Grid2 xs={12} sm={8} md={6} lg={6} xl={6}>
                    <Chat />
                </Grid2>

                <Grid2 item xs={12} sm={4} md={3} lg={3} xl={3} sx={{ boxShadow: 3, minHeight: 700, minWidth: 400, borderRadius: 3, backgroundColor: "#f5f5f5", padding: 2 }}>
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

                        {isSelected && (
                            <Stack direction="column" spacing={0}>
                                <Button
                                    variant="text"
                                    onClick={() => setOpenEdit(true)}
                                    startIcon={<Edit/>}
                                    sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", justifyContent: 'flex-start'}}>
                                    Edit
                                </Button>
                                <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                                    <DialogTitle>Edit Exchange</DialogTitle>
                                    <DialogContent>
                                        <Stack alignItems={"center"}> 
                                            <FormControl fullWidth margin="normal">
                                                <InputLabel id="estatus-label">Update Status</InputLabel>
                                                <Select
                                                    labelId="estatus-label"
                                                    id="estatus"
                                                    value={status}
                                                    onChange={(e) => setStatus(e.target.value)}
                                                    label="Update Status"
                                                    sx={{marginBottom: 2}}
                                                    >
                                                    <MenuItem value="Ongoing">Ongoing</MenuItem>
                                                    <MenuItem value="Cancelled">Cancelled</MenuItem>
                                                    <MenuItem value="Completed">Completed</MenuItem>
                                                </Select>
                                                <TextField
                                                    id="scheduledStart"
                                                    label="Update Schedule Start"
                                                    type="datetime-local"
                                                    value={scheduledStart}
                                                    onChange={(e) => setScheduledStart(e.target.value)}
                                                    sx={{marginBottom: 2}}
                                                />
                                                <TextField
                                                    id="scheduledEnd"
                                                    label="Update Schedule End"
                                                    type="datetime-local"
                                                    value={scheduledEnd}
                                                    onChange={(e) => setScheduledEnd(e.target.value)}
                                                />
                                            </FormControl>
                                        </Stack>
                                    </DialogContent> 
                                    <DialogActions>
                                        <Button onClick={() => setOpenEdit(false)}>Cancel</Button>
                                        <Button onClick={() => {editExchange()}}>Edit</Button>
                                    </DialogActions>
                                </Dialog>

                                <Button
                                    variant="text"
                                    onClick={() => setOpenDelete(true)}
                                    startIcon={<Delete/>}
                                    sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", justifyContent: 'flex-start'}}>
                                    Delete
                                </Button>
                                <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                                    <DialogTitle>Delete the Exchange?</DialogTitle>
                                    <DialogContent>
                                        <DialogContentText>Are you sure you want to delete the exchange?</DialogContentText>
                                    </DialogContent>
                                    <DialogActions>
                                        <Button onClick={() => setOpenDelete(false)}>Cancel</Button>
                                        <Button onClick={() => { deleteExchange(id) }} autoFocus>Delete</Button>
                                    </DialogActions>
                                </Dialog>

                                <Button
                                    variant="text"
                                    onClick={() => { handleReviewClick() }}
                                    startIcon={<Reviews/>}
                                    sx={{ maxWidth: 200, minWidth: 200, alignSelf: 'center', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", justifyContent: 'flex-start'}}>
                                    Review
                                </Button>
                            </Stack>
                        )}
                    </Stack>
                </Grid2>
            </Grid2>
        </>
    )    
}