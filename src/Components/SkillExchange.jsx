import { Avatar, Button, Grid2, Stack, Typography, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, TextField, Select, MenuItem, InputLabel, Collapse } from "@mui/material";
import { useState, useEffect } from "react";
import { Check, Delete, Reviews, CalendarMonth, ArrowDropDown, ArrowDropUp } from '@mui/icons-material'
import axios from 'axios'
import Chat from './Chat.jsx'
import { useNavigate } from "react-router-dom";
import wiski_banner from '../assets/images/HomeAssets/wiski-banner-full.png';

export default function SkillExchange({userId}) {
    const [exchange, setExchange] = useState([])
    const [id, setId] = useState('');
    const [status, setStatus] = useState('');
    const [title, setTitle] = useState('');
    const [scheduledStart, setScheduledStart] = useState('');
    const [scheduledEnd, setScheduledEnd] = useState('');

    const [isCompleted, setIsCompleted] = useState(false)
    const [isSelected, setIsSelected] = useState(false)
    const [currentExchange, setCurrentExchange] = useState(null)
    const [openDelete, setOpenDelete] = useState(false)
    const [openEdit, setOpenEdit] = useState(false)
    const [openComplete, setOpenComplete] = useState(false)
    const [dropDown, setDropDown] = useState(false)

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
            status: openComplete ? 'Completed':status,
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
            setOpenComplete(false);
        })
        .catch((error) =>{
            console.log('Error editing Skill Exchange',error);
        })
    }

    const handleExchange = (id, status, title, scheduledStart, scheduledEnd) =>{
        setId(id);
        setStatus(status);
        setTitle(title);
        setScheduledStart(scheduledStart);
        setScheduledEnd(scheduledEnd);
        setCurrentExchange({ id, status, title, scheduledStart, scheduledEnd });
        setIsSelected(true);
    }

    const exchangeReload = () => {
        if (isCompleted){
            api.get('/completed')
            .then((exc) => {
                setExchange(exc.data);
                console.log(exc);
            })
            .catch((error) =>{
                console.log('Error reading Skill Exchange',error);
            });
        } else {
            api.get('/ongoing')
            .then((exc) => {
                setExchange(exc.data);
                console.log(exc);
            })
            .catch((error) =>{
                console.log('Error reading Skill Exchange',error);
            });
        }
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
    }, [isCompleted])

    const handleReviewClick = () => {
        if (currentExchange) {
            navigate(`/reviews`, {
                state: { userId: userId, exchangeId: id },
            });
        } else {
            alert("Please select an exchange before leaving a review.");
        }
    };

    return (
        <>
            <Grid2 container spacing={2} direction="row" sx={{marginTop: 1.5, marginLeft: 2, marginRight: 2, width: '99%', minWidth: 'max-content'}}>
                <Grid2 item sx={{ boxShadow: 3, minHeight: "100%", minWidth: 400, maxWidth: 400, borderRadius: 3, backgroundColor: "#f5f5f5", overflowY: "auto", overflowX: "hidden" }}>
                    <Typography variant="h5" sx={{ justifySelf: "left", paddingLeft: 2, paddingTop: 1 }}>Active Exchange</Typography>
                    <Stack direction={"row"} sx={{ marginLeft: 1, marginRight: 1, marginTop: 1 }}>
                        <Button onClick={() => setIsCompleted(false)} sx={{ backgroundColor: isCompleted ? '#e3e3e3':'#f5f5f5', color: '#000', fontWeight: isCompleted ? 'normal':'bold', '&:focus': {outline: 'none'} }}>Ongoing</Button>
                        <Button onClick={() => setIsCompleted(true)} sx={{ backgroundColor: isCompleted ? "#f5f5f5":'#e3e3e3', color: '#000', fontWeight: isCompleted ? 'bold':'normal', '&:focus': {outline: 'none'} }}>Completed</Button>
                    </Stack>

                    {exchange.map((exc, index) => (
                        <Grid2 key={index}
                            sx={{ //boxShadow: 4,
                                minHeight: 70,
                                margin: "auto",
                                marginTop: 0,
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
                                },
                            }}
                            onClick={() => { handleExchange(exc.skillExchangeID, exc.status, exc.title, exc.scheduledStart, exc.scheduledEnd) }}>
                            <Stack direction={"row"}>
                                <Avatar
                                    alt="profile-pic"
                                    variant="circle"
                                    src={wiski_banner}
                                    sx={{
                                        width: '55px',
                                        height: '55px',
                                        marginRight: 1
                                    }}
                                />
                                <Stack direction={"column"} sx={{overflow: "hidden"}}>
                                    <Typography variant="h5" sx={{whiteSpace: 'nowrap', overflow: "hidden", textOverflow: 'ellipsis', maxWidth: '100%'}}>{exc.title}</Typography>
                                    <Typography variant="body1" justifySelf={"left"}>{/*<strong>Status: </strong>*/}{exc.status}</Typography>
                                </Stack>
                            </Stack>
                            {/*<Typography variant="body2" justifySelf={"left"}>Scheduled Start: {new Date(exc.scheduledStart).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</Typography>
                            <Typography variant="body2" justifySelf={"left"}>Scheduled End: {new Date(exc.scheduledEnd).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" })}</Typography>*/}
                        </Grid2>
                    ))}
                </Grid2>

                <Grid2>
                    <Chat />
                </Grid2>

                <Grid2 item sx={{ boxShadow: 3, minHeight: 700, minWidth: 400, maxWidth: 400, borderRadius: 3, backgroundColor: "#f5f5f5", padding: 2 }}>
                    <Stack direction="column" spacing={2}>
                        <Stack direction="column">
                            <Avatar
                                alt="profile-pic"
                                variant="circle"
                                src={wiski_banner}
                                sx={{
                                    width: '100px',
                                    height: '100px',
                                    margin: 'auto',
                                    marginBottom: 1
                                }}
                            />
                            <Typography variant="h5" sx={{ alignSelf: "center", textAlign: "center", fontWeight: 'bold'}}>
                                {currentExchange ? currentExchange.title : 'Select an Exchange'}
                            </Typography>
                            <Typography variant="body1" sx={{ alignSelf: "center", color: '#555', marginBottom: 2 }}>
                                {currentExchange ? currentExchange.status : ''}
                            </Typography>
                            
                            {isSelected && (
                                <Stack direction="row" alignItems="center" sx={{ alignSelf: "center", color: '#555'}}>
                                    <CalendarMonth sx={{marginRight: 1}}/>
                                    <Typography variant="body1" sx={{ alignSelf: "center", color: '#555' }}>
                                        Scheduled Start:
                                    </Typography>
                                </Stack>
                            )}
                            <Typography variant="body1" sx={{ alignSelf: "center", color: '#555' }}>
                                    {currentExchange ? new Date(currentExchange.scheduledStart).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : ''}
                            </Typography>

                            {isSelected && (
                                <Stack direction="row" alignItems="center" sx={{ alignSelf: "center", color: '#555', marginTop: 2 }}>
                                    <CalendarMonth sx={{marginRight: 1}}/>
                                    <Typography variant="body1" sx={{ alignSelf: "center", color: '#555' }}>
                                        Scheduled End:
                                    </Typography>
                                </Stack>
                            )}
                            <Typography variant="body1" sx={{ alignSelf: "center", color: '#555', marginBottom: 2 }}>
                                {currentExchange ? new Date(currentExchange.scheduledEnd).toLocaleString("en-US", { dateStyle: "medium", timeStyle: "short" }) : ''}
                            </Typography>
                        </Stack>

                        {isSelected && currentExchange.status !== 'Completed' && (
                            <>
                                <Button
                                    variant="text"
                                    onClick={() => setDropDown(!dropDown)}
                                    endIcon={dropDown ? <ArrowDropUp/> : <ArrowDropDown/>}
                                    sx={{ maxWidth: '100%', minWidth: 250, alignSelf: 'left', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", '&:focus': {outline: 'none'}}}
                                >
                                    Exchange Actions
                                </Button>
                                <Collapse in={dropDown}>
                                    <Stack direction="column" spacing={0}>
                                        <Button
                                            variant="text"
                                            onClick={() => setOpenEdit(true)}
                                            startIcon={<CalendarMonth/>}
                                            sx={{ maxWidth: '100%', minWidth: 250, alignSelf: 'left', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", '&:focus': {outline: 'none'}}}>
                                            Set Schedule
                                        </Button>
                                        <Dialog open={openEdit} onClose={() => setOpenEdit(false)}>
                                            <DialogTitle>Set Schedule</DialogTitle>
                                            <DialogContent>
                                                <Stack alignItems={"center"}> 
                                                    <FormControl fullWidth margin="normal">
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
                                                <Button onClick={() => setOpenEdit(false)} sx={{color: "#b03d3d", '&:focus': {outline: 'none'}}}>Cancel</Button>
                                                <Button onClick={() => {editExchange()}} sx={{color: "#b03d3d", '&:focus': {outline: 'none'}}}>Submit</Button>
                                            </DialogActions>
                                        </Dialog>
                                        
                                        <Button
                                            variant="text"
                                            onClick={() => setOpenComplete(true)}
                                            startIcon={<Check/>}
                                            sx={{ maxWidth: '100%', minWidth: 250, alignSelf: 'left', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", '&:focus': {outline: 'none'}}}>
                                            Complete Exchange
                                        </Button>
                                        <Dialog open={openComplete} onClose={() => setOpenComplete(false)}>
                                            <DialogTitle>Complete Exchange?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>The exchange will be marked as completed.</DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpenComplete(false)} sx={{color: "#b03d3d", '&:focus': {outline: 'none'}}}>Cancel</Button>
                                                <Button onClick={() => {editExchange()}} sx={{color: "#b03d3d", '&:focus': {outline: 'none'}}}>Complete</Button>
                                            </DialogActions>
                                        </Dialog>

                                        <Button
                                            variant="text"
                                            onClick={() => setOpenDelete(true)}
                                            startIcon={<Delete/>}
                                            sx={{ maxWidth: '100%', minWidth: 250, alignSelf: 'left', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", '&:focus': {outline: 'none'}}}>
                                            Cancel Exchange
                                        </Button>
                                        <Dialog open={openDelete} onClose={() => setOpenDelete(false)}>
                                            <DialogTitle>Cancel Exchange?</DialogTitle>
                                            <DialogContent>
                                                <DialogContentText>Are you sure you want to cancel the exchange?</DialogContentText>
                                            </DialogContent>
                                            <DialogActions>
                                                <Button onClick={() => setOpenDelete(false)} sx={{color: "#b03d3d", '&:focus': {outline: 'none'}}}>Cancel</Button>
                                                <Button onClick={() => { deleteExchange(id) }} sx={{color: "#b03d3d", '&:focus': {outline: 'none'}}}>Delete</Button>
                                            </DialogActions>
                                        </Dialog>
                                        
                                        <Button
                                            variant="text"
                                            onClick={() => { handleReviewClick() }}
                                            startIcon={<Reviews/>}
                                            sx={{ maxWidth: '100%', minWidth: 250, alignSelf: 'left', fontWeight: 'bold', color: "#b03d3d", borderColor: "#b03d3d", '&:focus': {outline: 'none'}}}
                                        >
                                            Review User
                                        </Button>
                                    </Stack>
                                </Collapse>
                            </>
                        )}
                    </Stack>
                </Grid2>
            </Grid2>
        </>
    )    
}