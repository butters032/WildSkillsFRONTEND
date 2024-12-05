import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Divider from '@mui/material/Divider';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid2';
import { Card, CardContent, CardActionArea, Typography } from '@mui/material';
import axios from 'axios';
import Rating from '@mui/material/Rating';
import Button from '@mui/material/Button';
import { Link } from 'react-router-dom';

const ReviewList = ({userId}) => {
    const [reviews, setReviews] = useState([]);
    const [search, setSearch] = useState('');
    const navigate = useNavigate();

    const fetchReviews = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/review/getAllReviews');
            console.log("API response:", response.data);
            setReviews(response.data);
        } catch (error) {
            console.error("Error:", error);
            alert('Failed to fetch reviews.');
        }
    };

    useEffect(() => {
        fetchReviews();
    }, []);

    const handleClick = (reviewId) => {
        navigate(`/skill-offerings/${reviewId}`);
    };

    const handleUpdate = (reviewId) => {
        navigate(`/update-review/${reviewId}`);
    };

    const addReview = (reviewId) => {
        navigate(`/reviews`);
    };

    const handleDelete = async (reviewId) => {
        try {
            await axios.delete(`http://localhost:8080/api/wildSkills/review/deleteReviewDetails/${reviewId}`);
            setReviews(reviews.filter(review => review.reviewId !== reviewId));
            alert('Review deleted successfully');
        } catch (error) {
            console.error("Error deleting review:", error);
            alert('Failed to delete review.');
        }
    };

    return (
        <>
            <h1>Reviews</h1>
            <Divider style={{ marginBottom: '50px', backgroundColor: 'black' }} />
            
            
            <Grid container spacing={2}>
                {reviews.map((review) => (
                    <Grid item size={4} key={review.reviewId}>
                        <Card style={{ border: '1px solid black', borderRadius: '10px' }}>
                            <CardContent>
                                <Typography variant="h5">{review.revieweeName || 'Review Title'}</Typography>
                                <Divider style={{ marginBottom: '15px', marginTop: '5px', backgroundColor: 'black' }} />
                                <Typography>Review Made by: {review.reviewerName}</Typography>
                                <Rating precision={0.5} value={review.rating} readOnly />
                                <Typography variant="body2">{review.comment || 'Sample review content'}</Typography>
                                <Button 
                                        variant="outlined" 
                                        color="primary" 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleUpdate(review.reviewId);
                                        }}
                                        style={{ marginTop: '10px' }}
                                        size='small'
                                    >
                                        Update
                                    </Button>
                                <Button 
                                        variant="outlined" 
                                        color="error" 
                                        onClick={(e) => {
                                            e.stopPropagation(); 
                                            handleDelete(review.reviewId);
                                        }}
                                        style={{ marginTop: '10px' }}
                                        size='small'
                                    >
                                        Delete
                                    </Button>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
            <Button variant="contained" onClick={addReview} style={{marginTop: '10px'}}>Add Review</Button>
        </>
    );
};

export default ReviewList;
