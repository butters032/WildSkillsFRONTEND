import { Button, Grid2, Stack, Typography } from "@mui/material";
import { useState, useEffect, useRef } from "react";
import axios from 'axios'

export default function SkillExchange() {
    const [exchange, setExchange] = useState([])
    const nexcdescRef = useRef()
    const excdescRef = useRef()
    const excstatRef = useRef()
    const excidRef = useRef()

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/skillExchange/',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    const deleteExchange = (id) =>{
        api.delete(`deleteSkillExchange/${id}`)
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
            description: excdescRef.current.value,
        })
        .then(() =>{
            exchangeReload();
        })
        .catch((error) =>{
            console.log('Error editing Skill Exchange',error);
        })
    }

    const handleEditExchange = (id, status, description) =>{
        if (excidRef.current){
            excidRef.current.value = id;
            excstatRef.current.value = status;
            excdescRef.current.value = description;
        }
    }

    const exchangeReload = () => {
        api.get('/getAllSkillExchange')
        .then((exc) => {
            setExchange(exc.data);
            console.log(exc);
        })
        .catch((error) =>{
            console.log('Error reading Skill Exchange',error);
        });
    }

    const newExchange = () =>{
        api.post('/postSkillExchangeRecord', {
            status: 'Ongoing',
            description: nexcdescRef.current.value,
        })
        .then((exc) =>{
            console.log(exc.data);
            exchangeReload();
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
            <Grid2 container spacing={2} direction={"row"}>
                <Grid2 sx={{ border: "2px solid", minWidth: 500, minHeight: 700, maxHeight: 700,borderRadius: 5, backgroundColor:"#E7BC40", overflow: "auto"  }}>
                    <Typography variant="h4">Active Exchange</Typography>
                    
                    {exchange.map((exc, index) =>(
                        <Grid2 key={index} 
                            sx={{ border: "2px solid", 
                            minWidth: 480, 
                            maxWidth:480, 
                            minHeight: 100, 
                            maxHeight: 100, 
                            margin: "auto", 
                            marginTop:1,
                            borderRadius: 3,
                            backgroundColor:"#D2B450",
                            padding:1 }}>
                            <Typography variant="h5">{exc.description}</Typography>
                            <Typography variant="body1" justifySelf={"left"}>Status: {exc.status}</Typography>
                            <Button variant="contained" color="success" onClick={() =>{handleEditExchange(exc.skillExchangeID, exc.status, exc.description)}}>Edit</Button>
                            <Button variant="contained" color="error" onClick={() => {deleteExchange(exc.skillExchangeID)}}>Delete</Button>
                        </Grid2>
                    ))}

                </Grid2>

                <Grid2>
                    <Stack direction={"column"} spacing={2}>
                        <Stack direction={"column"} spacing={1}>
                            <Typography variant="h6">Create Exchange</Typography>
                            <input type="text" id="description" ref={nexcdescRef} placeholder="Description"/>
                            <Button variant="contained" color="success" onClick={newExchange}>Initialize Exchange</Button>
                        </Stack>
                        <Stack direction={"column"} spacing={1}>
                            <input type="hidden" id="id" ref={excidRef}/>
                            <input type="text" id="estatus" ref={excstatRef} placeholder="Status"/>
                            <input type="text" id="edescription" ref={excdescRef} placeholder="Description"/>
                            <Button variant="contained" color="success" onClick={editExchange}>Edit Exchange</Button>
                        </Stack>
                    </Stack>
                </Grid2>
            </Grid2>
        </>
    )
}
