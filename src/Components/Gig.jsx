import React, { useEffect, useState } from 'react';
import { Card, CardContent, Typography, Chip, IconButton, TextField, Button, Switch, FormControlLabel } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import Chat from '@mui/icons-material/Chat';
import Edit from '@mui/icons-material/Edit';
import Save from '@mui/icons-material/Save';
import axios from 'axios';

const Gig = ({userId}) => {
    const location = useLocation();
    const navigate = useNavigate();
    const [student, setStudent] = useState({});;
    const { title, description, skills = [], isActive, categoryId, skillOfferingId, categories = [] } = location.state || {};
    const [categoryName, setCategoryName] = useState('Unknown Category');
    const [editTitle, setEditTitle] = useState(title);
    const [editDescription, setEditDescription] = useState(description);
    const [editSkills, setEditSkills] = useState(skills);
    const [isEditing, setIsEditing] = useState(false);
    const [editIsActive, setEditIsActive] = useState(isActive);

    const category = categories.find(cat => cat.categoryId === categoryId);
    const resolvedCategoryName = category ? category.name : categoryName;

    const id = userId;
    

    /*useEffect(() => {
        const fetchStudentName = async (id) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/wildSkills/student/getUserStudentRecord?id=${id}`);
                setStudentName(response.data.name);
                console.log(userId)
            } catch (error) {
                console.error('Error fetching student name', error);
            }
        };

        if (userId) {
            fetchStudentName(userId);
        }
    }, []);*/

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });
    useEffect(() => {
        
        const fetchStudent = async (id) => {
            try {
                const response = await api.get(`/getUserStudentRecord?id=${id}`);
                console.log(response.data);
                const fetchedStudent = response.data;
                setStudent(fetchedStudent);
                console.log(student)
            } catch (error) {
                console.error('Error fetching student data', error);
            }
        };

        if (id) {
            fetchStudent(id);
        }
    }, [id]);
    console.log(student.name)

    useEffect(() => {
        const fetchCategoryName = async (categoryId) => {
            try {
                const response = await axios.get(`http://localhost:8080/api/wildSkills/getCategory/${categoryId}`);
                setCategoryName(response.data.name);
            } catch (error) {
                console.error('Error fetching category name:', error);
            }
        };

        if (!category) {
            fetchCategoryName();
        }
    }, [categoryId, category]);

    const handleChatClick = () => {
        navigate('/chat');
    };

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
                        <Typography variant="body2" color="textSecondary" style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start' }}>
                            <Chip label={editIsActive ? "Online" : "Offline"} style={{ verticalAlign: 'middle', marginRight: '5px' }} />
                        </Typography>
                        <IconButton
                            color="primary"
                            style={{ marginTop: '10px', display: 'flex', justifyContent: 'flex-start', color: 'gray' }}
                            onClick={handleChatClick}
                        >
                            <Chat style={{ textAlign: 'left' }} />
                        </IconButton>
                        <br />
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
                        <FormControlLabel
                            control={<Switch checked={editIsActive} onChange={(e) => setEditIsActive(e.target.checked)} />}
                            label={editIsActive ? "Online" : "Offline"}
                            style={{ marginTop: '10px' }}
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
