import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
    Card, CardContent, Button, Typography, TextField, Select, MenuItem, FormControl, InputLabel,
    Switch, FormControlLabel, Dialog, DialogTitle, DialogContent, DialogActions, Checkbox, IconButton, CardActionArea
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

const SkillOffering = () => {
    const [skillOfferings, setSkillOfferings] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [openConfirmDialog, setOpenConfirmDialog] = useState(false);
    const [selectedIds, setSelectedIds] = useState([]);
    const [showCheckboxes, setShowCheckboxes] = useState(false);
    const [newIsActive, setNewIsActive] = useState(false);
    const [newDescription, setNewDescription] = useState('');
    const [newCategory, setNewCategory] = useState('');
    const [newSkills, setNewSkills] = useState('');
    const [editingSkillOfferingId, setEditingSkillOfferingId] = useState(null);
    const [newTitle, setNewTitle] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        fetchSkillOfferings();
        fetchCategories();
    }, []);

    const fetchSkillOfferings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/skilloffering/getAllSkillOfferingRecord');
            setSkillOfferings(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching skill offerings:', error);
        }
    };

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/category/getAllCategory');
            setCategories(response.data);
        } catch (error) {
            console.error('Error fetching categories:', error);
        }
    };

    const handleNavigate = (offering) => {
        navigate(`/gig/${offering.skillOfferingId}`, { state: { ...offering } });
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
            category: newCategory,
            skills: newSkills.split(',').map(skill => skill.trim())
        };

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
            console.error('Error saving skill offering:', error);
        }
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
        setEditingSkillOfferingId(null);
        setNewIsActive(false);
        setNewDescription('');
        setNewCategory('');
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
            {/* Confirmation Dialog for Deletion */}
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
                            value={newCategory}
                            onChange={(e) => setNewCategory(e.target.value)}
                        >
                            {categories.map((category) => (
                                <MenuItem key={category.categoryId} value={category.name}>{category.name}</MenuItem>
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
                    <FormControlLabel
                        control={
                            <Switch
                                checked={newIsActive}
                                onChange={(e) => setNewIsActive(e.target.checked)}
                                color="primary"
                            />
                        }
                        label={newIsActive ? "Online" : "Offline"}
                    />
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
