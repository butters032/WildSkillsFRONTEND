import React, { useState, useEffect } from 'react';
import { Button, Grid, IconButton, Checkbox, Card,CardMedia, CardActionArea, CardContent, Typography, Dialog, DialogTitle, DialogContent, DialogActions, FormControl, TextField, Select, MenuItem, FormControlLabel, Switch, InputLabel } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import { ArrowBack } from '@mui/icons-material';


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
                `http://localhost:8080/api/wildSkills/skilloffering/student/${userId}/getAllSkillOfferingRecord/client`
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
            await Promise.all(selectedIds.map(id => axios.delete(`http://localhost:8080/api/wildSkills/skilloffering/student/{studentId}/deleteSkillOfferingDetails/client/${id}`)));
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
            //studentID:userId,
        };
        console.log('Skill Offering Data:',skillOfferingData);

        
        try {
            let response;
            response = await axios.post(`http://localhost:8080/api/wildSkills/skilloffering/student/${userId}/postSkillOfferingRecord`, skillOfferingData);
            

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

    const scrollContainer = React.useRef(null);

    const scrollLeft = () => {
        scrollContainer.current.scrollBy({ left: -250, behavior: 'smooth' });
    };

    const scrollRight = () => {
        scrollContainer.current.scrollBy({ left: 250, behavior: 'smooth' });
    };

    return (
         <div style={{ textAlign: 'center', 
         color: 'black', 
         background: 'linear-gradient(120deg, #000000, #434343)', 
         minHeight: '85vh', 
         padding: '20px',
         minWidth:'97.8vw'
         }}>
            <div style={{color:'white',fontSize:'50px'}}
            >Gigs</div>
            <Button 
                variant="contained" 
                onClick={() => setOpenDialog(true)}
                style={{
                    background: 'linear-gradient(45deg, #cf2d2d 30%, #ff762e 90%)',
                    color: 'white',
                    margin: '20px',
                    borderRadius: '15px',
                   // boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                    padding: '10px 20px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    '&:hover': {
                        background: 'linear-gradient(45deg, #FF8E53 30%, #FE6B8B 90%)',
                    }
                }}
            >
                ADD GIG
            </Button>
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
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 20px' }}>
                    <IconButton 
                        onClick={scrollRight} 
                        style={{ color: 'white' }}
                    >
                        <ArrowBackIosIcon />
                    </IconButton>
                    <div 
                        ref={scrollContainer} 
                        style={{ display: 'flex', overflowX: 'auto', padding: '20px', width: '80%', margin: '0 10px' }}
                    >
                        {skillOfferings.map((offering) => (
                            <Card
                                key={offering.skillOfferingId}
                                style={{
                                    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)',
                                    transition: '0.3s',
                                    width: '250px',
                                    margin: '0 10px',
                                    flexShrink: 0, // Prevent shrinking
                                }}
                            >
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
                                        <Typography variant="h6" style={{ fontWeight: 'bold' }}>
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
                    <IconButton 
                        onClick={scrollRight} 
                        style={{ color: 'white' }}
                    >
                        <ArrowForwardIosIcon />
                    </IconButton>

                </div>
            )}
            {showCheckboxes && selectedIds.length > 0 && (
                <Button
                variant="text"
                onClick={() => setOpenConfirmDialog(true)}
                style={{
                    marginTop: '20px',
                    color: 'red',
                    borderRadius: '15px',
                    fontSize: '16px',
                    fontWeight: 'bold',
                    textTransform: 'none',
                    padding: '10px 20px',
                    border: '2px solid red',
                    boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
                    '&:hover': {
                        background: 'rgba(255, 0, 0, 0.1)',
                    }
                }}
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
