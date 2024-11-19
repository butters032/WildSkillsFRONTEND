import { Button, Grid2, Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'
import Chat from './Chat.jsx'

export default function SkillExchange({userId}) {
    const [exchange, setExchange] = useState([])
    const nexctitleRef = useRef()
    const exctitleRef = useRef()
    const excstatRef = useRef()
    const excidRef = useRef()
    const excscstartRef = useRef()
    const excscendRef = useRef()
    const [isEditing, setIsEditing] = useState(false)

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
        api.put(`/putSkillExchangeDetails?id=${excidRef.current.value}`, {
            status: excstatRef.current.value,
            title: nexctitleRef.current.value,
            scheduledStart: excscstartRef.current.value,
            scheduledEnd: excscendRef.current.value,
        })
        .then(() =>{
            exchangeReload();
            excstatRef.current.value = '';
            nexctitleRef.current.value = '';
            excscstartRef.current.value = '';
            excscendRef.current.value = '';
        })
        .catch((error) =>{
            console.log('Error editing Skill Exchange',error);
        })
    }

    const handleEditExchange = (id, status, title, scheduledStart, scheduledEnd) =>{
        if (excidRef.current){
            excidRef.current.value = id;
            excstatRef.current.value = status;
            nexctitleRef.current.value = title;
            excscstartRef.current.value = scheduledStart;
            excscendRef.current.value = scheduledEnd;
            setIsEditing(true);
            console.log(isEditing)
        }
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
            title: exctitleRef.current.value,
            scheduledStart: excscstartRef.current.value,
            scheduledEnd: excscendRef.current.value,
        })
        .then((exc) =>{
            console.log(exc.data);
            exchangeReload();
            exctitleRef.current.value = '';
        })
        .catch((error) =>{
            console.log('Error creating Skill Exchange',error)
        })
    }

    //skill exchange display/get
    useEffect(() =>{
        exchangeReload();
    }, [])

    return(
        <>
            <Grid2 container spacing={2} direction={"row"} marginTop={15}>
                <Grid2 sx={{ boxShadow: 3, minWidth: 500, minHeight: 700, maxHeight: 700,borderRadius: 5, /*backgroundColor:"#E7BC40",*/ overflow: "auto"  }}>
                    <Typography variant="h4" justifySelf={"left"} >Active Exchange</Typography>
                    
                    {exchange.map((exc, index) =>(
                        <Grid2 key={index} 
                            sx={{ //border: "2px solid", 
                            boxShadow: 4,
                            minWidth: 480, 
                            maxWidth:480, 
                            minHeight: 100, 
                            maxHeight: 150, 
                            margin: "auto", 
                            marginTop:1,
                            borderRadius: 3,
                            //backgroundColor:"#D2B450",
                            //backgroundColor:"#ff7f7f",
                            padding:1 }}>
                            <Typography variant="h5">{exc.title}</Typography>
                            <Typography variant="body1" justifySelf={"left"}>Status: {exc.status}</Typography>
                            <Typography variant="body2" justifySelf={"left"}>Scheduled Start: {new Date(exc.scheduledStart).toLocaleString("en-US", {dateStyle: "medium", timeStyle: "short"})}</Typography>
                            <Typography variant="body2" justifySelf={"left"}>Scheduled End: {new Date(exc.scheduledEnd).toLocaleString("en-US", {dateStyle: "medium", timeStyle: "short"})}</Typography>
                            <Button variant="contained" color="success" onClick={() =>{handleEditExchange(exc.skillExchangeID, exc.status, exc.title, exc.scheduledStart, exc.scheduledEnd)}}>Edit</Button>
                            <Button variant="contained" color="error" onClick={() => {deleteExchange(exc.skillExchangeID)}}>Delete</Button>
                        </Grid2>
                    ))}

                </Grid2>
                
                
                <Grid2>
                    <Stack direction={"column"} spacing={2}>
                        <Stack direction={"column"} spacing={1}>
                            <Typography variant="h6">Create Exchange</Typography>
                            <input type="text" id="description" ref={exctitleRef} placeholder="Title"/>
                            <Button variant="contained" color="success" onClick={newExchange}>Initialize Exchange</Button>
                        </Stack>
                        <Stack direction={"column"} spacing={1}>
                        <Typography variant="h6">Edit Exchange</Typography>
                            <input type="hidden" id="id" ref={excidRef}/>
                            <label htmlFor="estatus">Update Status:</label>
                            <select id="estatus" ref={excstatRef} defaultValue="Ongoing">
                                <option value={"Ongoing"}>Ongoing</option>
                                <option value={"Cancelled"}>Cancelled</option>
                                <option value={"Completed"}>Completed</option>
                            </select>
                            <label htmlFor="edescription">Update Title:</label>
                            <input type="text" id="edescription" ref={nexctitleRef} placeholder="Title"/>
                            <label>Update Schedule Start:</label>
                            <input type="datetime-local" ref={excscstartRef} placeholder="Schedule Start"/>
                            <label>Update Schedule End:</label>
                            <input type="datetime-local" ref={excscendRef} placeholder="Schedule End"/>
                            <Button variant="contained" color="success" onClick={editExchange}>Edit Exchange</Button>
                        </Stack>
                    </Stack>
                </Grid2>        
                <Chat/>
            </Grid2>
        </>
    )
}