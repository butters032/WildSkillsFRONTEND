import React, { useState, useEffect } from 'react';
import { Button, IconButton, Checkbox, Card, CardActionArea, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, TextField, Select, MenuItem, FormControlLabel, Switch, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const SkillOffering = ({ userId }) => {
    const [skillOfferings, setSkillOfferings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [newIsActive, setNewIsActive] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [newCategoryId, setNewCategoryId] = useState('');
    const [newSkills, setNewSkills] = useState('');
    const [editingSkillOfferingId, setEditingSkillOfferingId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const [student, setStudent] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetchSkillOfferings();
        fetchCategories();
    }, []);

    const api = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/student',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
    });

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

    console.log(student.studentId);

    const fetchSkillOfferings = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/wildSkills/skilloffering/getAllSkillOfferingRecord'
            );
            setSkillOfferings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching skill offerings:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get(
                'http://localhost:8080/api/wildSkills/category/getAllCategory'
            );
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };
    const handleNavigate = (offering) => {
        const category = categories.find(cat => cat.categoryId === offering.categoryId);
        console.log('Final State:', { ...offering, category }); 
        navigate(`/gig/${offering.skillOfferingId}`, { state: { ...offering, category } });
    };
    
    

    const handleDeleteSelected = async () => {
        try {
            await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:8080/api/wildSkills/skilloffering/deleteSkillOfferingDetails/${id}`)));
            fetchSkillOfferings();
            setSelectedIds([]);
            setShowCheckboxes(false);
            setOpenConfirmDialog(false);
        } catch (error) {
            console.error('Error deleting selected skill offerings:', error);
        }
    };

    const handleSave = async () => {
        const skillOfferingData = {
            title: newTitle,
            isActive: newIsActive,
            description: newDescription,
            skills: newSkills,
            category: {
                categoryId: newCategoryId,
            },
            studentID:student.id,
        };
        console.log('Skill Offering Data:',skillOfferingData);

        try {
            let response;
            if (editingSkillOfferingId) {
                response = await axios.put(`http://localhost:8080/api/wildSkills/skilloffering/putSkillOfferingDetails?id=${editingSkillOfferingId}`, skillOfferingData);
            } else {
                response = await axios.post('http://localhost:8080/api/wildSkills/skilloffering/postSkillOfferingRecord', skillOfferingData);
            }

            const savedOffering = response.data;
            setSkillOfferings(prevOfferings => 
                editingSkillOfferingId 
                    ? prevOfferings.map(offering => offering.skillOfferingId === editingSkillOfferingId ? savedOffering : offering)
                    : [...prevOfferings, savedOffering]
            );

            handleCloseDialog();
        } catch (error) {
            console.error('Error saving skill offering:', error.response || error.message || error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSkillOfferingId(null);
        setNewIsActive(false);
        setNewDescription('');
        setNewCategoryId('');
        setNewSkills('');
        setNewTitle('');
    };

    const toggleDeleteConfirmation = () => {
        if (selectedIds.length > 0) {
            setOpenConfirmDialog(true);
        }
    };

    return (
        <div style={{ textAlign: 'center', color: 'black' }}>
            <h1>My Gigs</h1>
            <Button variant="contained" color="primary" onClick={() => setOpenDialog(true)}>Add Gig</Button>
            <IconButton
                color="secondary"
                onClick={() => {
                    setShowCheckboxes(prev => !prev);
                    setSelectedIds([]);
                }}
                onDoubleClick={toggleDeleteConfirmation}
                style={{ color: 'red' }}
            >
                <DeleteIcon />
            </IconButton>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', marginTop: '20px' }}>
                    {skillOfferings.map((offering) => (
                        <Card key={offering.skillOfferingId} style={{ width: '250px', margin: '10px' }}>
                            <CardActionArea
                                onClick={() => !showCheckboxes && handleNavigate(offering)}
                                style={{ cursor: showCheckboxes ? 'default' : 'pointer' }}
                            >
                                <CardContent>
                                    {showCheckboxes && (
                                        <Checkbox
                                            checked={selectedIds.includes(offering.skillOfferingId)}
                                            onChange={() => {
                                                setSelectedIds((prev) =>
                                                    prev.includes(offering.skillOfferingId)
                                                        ? prev.filter((id) => id !== offering.skillOfferingId)
                                                        : [...prev, offering.skillOfferingId]
                                                );
                                            }}
                                        />
                                    )}
                                    <Typography variant="h6">
                                        {offering.title}
                                    </Typography>
                                    <Typography variant="body2" color="textSecondary">
                                        {offering.description || "No description available"}
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                        </Card>
                    ))}
                </div>
            )}
            {showCheckboxes && selectedIds.length > 0 && (
                <Button
                    variant="text"
                    color="secondary"
                    onClick={() => setOpenConfirmDialog(true)}
                    style={{ marginTop: '20px', color: 'red' }}
                >
                    Delete
                </Button>
            )}
            <Dialog open={openConfirmDialog} onClose={() => setOpenConfirmDialog(false)}>
                <DialogTitle>Confirm Deletion</DialogTitle>
                <DialogContent>
                    <Typography>Are you sure you want to delete the selected gig?</Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenConfirmDialog(false)} color="secondary">Cancel</Button>
                    <Button onClick={handleDeleteSelected} color="primary">Delete</Button>
                </DialogActions>
            </Dialog>
            <Dialog open={openDialog} onClose={handleCloseDialog} fullWidth maxWidth="sm">
                <DialogTitle>{editingSkillOfferingId ? "Edit Gig" : "Add Gig"}</DialogTitle>
                <DialogContent>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Title"
                            value={newTitle}
                            onChange={(e) => setNewTitle(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            required
                        />
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <InputLabel>Category</InputLabel>
                        <Select
                            value={newCategoryId}
                            onChange={(e) => setNewCategoryId(e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.categoryId}>
                                    {category.name}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                    <FormControl fullWidth margin="normal">
                        <TextField
                            label="Skills (comma-separated)"
                            value={newSkills}
                            onChange={(e) => setNewSkills(e.target.value)}
                        />
                    </FormControl>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog} color="secondary">Cancel</Button>
                    <Button onClick={handleSave} color="primary">Save</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
};

export default SkillOffering;
