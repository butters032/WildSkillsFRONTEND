import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Typography, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import { useLocation } from 'react-router-dom';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Review = () => {
    const location = useLocation();
    const { userId, exchangeId } = location.state || {};

    const [rating, setRating] = useState(2.5);
    const [comment, setComment] = useState('');



    const handleSubmit = async () => {
        if (!exchangeId) {
            alert('Exchanged student not found.');
            return;
        }

        try {
            const response = await axios.post(`http://localhost:8080/api/wildSkills/review/reviewStudent/${userId}/${exchangeId}`, {
                rating: rating,
                comment: comment,
            });
            alert('Review submitted successfully!');
            setRating(2.5);
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review.');
        }
    };

    const debugtest = () => {
        console.log(userId + " and " + exchangeId)
    };

    return (
        <div style={{ border: '2px solid black', borderRadius: '10px', padding: '50px', marginTop: '10px' }}>
            <h1>Rate your Experience</h1>
            <Grid container spacing={2}>
                <Grid item xs={12}>
                    <Item>
                        <div>
                            <Rating
                                name="half-rating"
                                value={rating}
                                precision={0.5}
                                onChange={(event, newValue) => setRating(newValue)}
                                style={{ fontSize: '75px' }}
                            />
                            <br />
                            <TextField
                                id="outlined-multiline-static"
                                multiline
                                rows={4}
                                placeholder="Comment"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                style={{ marginTop: '10px', width: '380px' }}
                            />
                            <br />
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={handleSubmit}
                                style={{ marginTop: '15px' }}
                            >
                                Submit Review
                            </Button>
                            <Button
                                variant="contained"
                                color="primary"
                                onClick={debugtest}
                                style={{ marginTop: '15px' }}
                            >
                                debug button
                            </Button>
                        </div>
                    </Item>
                </Grid>
            </Grid>
        </div>
    );
};

export default Review;
