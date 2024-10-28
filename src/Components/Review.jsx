import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';

import axios from 'axios';

import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Typography } from '@mui/material';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2'
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    ...theme.applyStyles('dark', {
      backgroundColor: '#1A2027',
    }),
  }));

const Review = () => {
    return (
        <>
            <div style={{border: '2px solid black', borderRadius: '10px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '50px', width: '100%', marginTop: '10px'}}>
                <h1 style={{marginLeft: '50px', marginRight: '50px'}}>Rate your Experience</h1>
                <Grid container spacing={2} >
                    <Grid size={5}>
                        <Item>
                            <div style={{border: '2px solid black', height: '210px'}}>
                                {/*Profile Pic Diri*/}
                            </div>
                        </Item>
                    </Grid>
                    <Grid size={7}>
                        <Item>
                            <div>
                                <Rating name="half-rating" defaultValue={2.5} precision={0.5} style={{fontSize: '75px'}} />
                                <br />
                                <TextField
                                    id="outlined-multiline-static"
                                     multiline
                                    rows={4}
                                    placeholder='Comment'
                                    style={{marginTop: '10px', width: '380px'}}
                                />
                            </div>
                        </Item>
                    </Grid>
                </Grid> 
            </div>
            
        </>
    );
};

export default Review;