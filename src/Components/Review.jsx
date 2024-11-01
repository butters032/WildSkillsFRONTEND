import React, { useState } from 'react';
import axios from 'axios';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import { Typography, Button } from '@mui/material';
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Grid from '@mui/material/Grid2';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
}));

const Review = () => {
    // Step 1: State for rating and comment
    const [rating, setRating] = useState(2.5);
    const [comment, setComment] = useState('');

    // Step 2: Handle form submission
    const handleSubmit = async () => {
        try {
            const response = await axios.post('http://localhost:8080/api/review/postReviewRecord', {
                rating: rating,
                comment: comment
            });
            alert('Review submitted successfully!');
            setRating(2.5); // Reset form
            setComment('');
        } catch (error) {
            console.error('Error submitting review:', error);
            alert('Failed to submit review.');
        }
    };

    return (
        <>
            <div style={{border: '2px solid black', borderRadius: '10px', paddingLeft: '50px', paddingRight: '50px', paddingBottom: '50px', width: '100%', marginTop: '10px'}}>
                <h1 style={{marginLeft: '50px', marginRight: '50px'}}>Rate your Experience</h1>
                <Grid container spacing={2}>
                    <Grid item size={12}>
                        <Item>
                            <div>
                                {/* Step 3: Rating component */}
                                <Rating
                                    name="half-rating"
                                    value={rating}
                                    precision={0.25}
                                    onChange={(event, newValue) => setRating(newValue)}
                                    style={{fontSize: '75px'}}
                                />
                                <br />
                                {/* Step 4: Comment input field */}
                                <TextField
                                    id="outlined-multiline-static"
                                    multiline
                                    rows={4}
                                    placeholder='Comment'
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    style={{marginTop: '10px', width: '380px'}}
                                />
                                <br />
                                {/* Step 5: Submit button */}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={handleSubmit}
                                    style={{marginTop: '15px'}}
                                >
                                    Submit Review
                                </Button>
                            </div>
                        </Item>
                    </Grid>
                </Grid> 
            </div>
        </>
    );
};

export default Review;
