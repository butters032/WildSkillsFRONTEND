import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, IconButton, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import axios from 'axios';

const Gig = ({userId}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [student, setStudent] = useState({});;
    const { title, description, skills = [], isActive, category, skillOfferingId } = location.state || {};
    const categoryId = category?.categoryId || null;
    const [resolvedCategoryName, setCategoryName] = useState(category ? category.name : 'Unknown Category');
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [editSkills, setEditSkills] = useState(skills);
    const [isEditing, setIsEditing] = useState(false);
    const [editIsActive, setEditIsActive] = useState(isActive); 
    const [authId, setAuthId] = useState();

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });

    useEffect(() => {
        console.log('Student data:', student);  // Log entire student object to see its structure
    }, [student]);
    
    useEffect(() => {
        const fetchStudent = async () => {
            if (!userId) {
                console.error('User ID is missing!');
                return;
            }
            try {
                const response = await api.get(`/getUserStudentRecord?id=${userId}`);
                const fetchedStudent = response.data;
                setStudent(fetchedStudent);
            } catch (error) {
                console.error('Error fetching student data:', error);
            }
        };
    
        fetchStudent();
    }, [userId]);    



    useEffect(() => {
        const fetchCategoryName = async () => {
            if (categoryId && !category) {
                try {
                    const response = await axios.get(`http://localhost:8080/api/wildSkills/category/getCategory/${categoryId}`);
                    setCategoryName(response.data.name);
                } catch (error) {
                    console.error('Error fetching category name:', error);
                }
            }
        };
        fetchCategoryName();
    }, [categoryId, category]);

    const handleEditClick = () => {
        setIsEditing(true);
    };

    const handleSaveClick = async () => {
        const skillOfferingData = {
            title: editTitle,
            description: editDescription,
            skills: editSkills,
            isActive: editIsActive,
        };
        try {
            await axios.put(`http://localhost:8080/api/wildSkills/skilloffering/putSkillOfferingDetails?id=${skillOfferingId}`, skillOfferingData);
            setIsEditing(false);
        } catch (error) {
            console.error('Error saving skill offering details', error);
        }
    };

    const skillArray = editSkills ? editSkills.split(',') : [];

    return (
        <Card style={{ height: 'auto', width: '900px', margin: '20px', padding: '10px', borderRadius: '8px' }}>
            <CardContent>
                {!isEditing ? (
                    <>
                        <Typography variant="h5" style={{ fontWeight: 'bold', display: 'flex', justifyContent: 'space-between', fontSize: '25px' }}>
                            {editTitle}
                            <IconButton color="primary" onClick={handleEditClick}>
                                <Edit />
                            </IconButton>
                        </Typography>
                        <Typography variant="h6" color="textPrimary" style={{ display: 'flex', justifyContent: 'flex-start' }} gutterBottom>
                            {student.name}
                        </Typography>
                        {student.authKey && student.authKey.authStatus === true ? (
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                            {/* <Chip label={editIsActive ? "Online" : "Offline"} style={{ verticalAlign: 'middle', marginRight: '5px' }} /> */}
                            Online
                        </Typography>
                        ) : (
                        <Typography>Offline</Typography>
                        )}
                        <br />
                        <Typography variant="h6" color="textPrimary" style={{ display: 'flex', justifyContent: 'flex-start' }} gutterBottom> 
                            {resolvedCategoryName}
                        </Typography>
                        <Typography variant="body1" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                            {editDescription}
                        </Typography>
                        <br />
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>Skills</Typography>
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                            {skillArray.slice(0, 10).map((skill, index) => (
                                <Chip key={index} label={skill.trim()} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                            ))}
                        </Typography>
                    </>
                ) : (
                    <>
                        <TextField
                            label="Title"
                            value={editTitle}
                            onChange={(e) => setEditTitle(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <TextField
                            label="Description"
                            value={editDescription}
                            onChange={(e) => setEditDescription(e.target.value)}
                            fullWidth
                            margin="normal"
                            multiline
                            rows={4}
                        />
                        <TextField
                            label="Skills"
                            value={editSkills}
                            onChange={(e) => setEditSkills(e.target.value)}
                            fullWidth
                            margin="normal"
                        />
                        <Button
                            variant="contained"
                            color="secondary"
                            onClick={handleSaveClick}
                            style={{ marginTop: '10px', marginLeft: '10px' }}
                        >
                            <Save />
                            Save
                        </Button>
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default Gig;
