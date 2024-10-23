import React, { useEffect, useState } from 'react';
import axios from 'axios';

const SkillOffering = () => {
    const [skillOfferings, setSkillOfferings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newStatus, setNewStatus] = useState('');
    const [newDescription, setNewDescription] = useState('');
    const [editingSkillOfferingId, setEditingSkillOfferingId] = useState(null);

    useEffect(() => {
        fetchSkillOfferings();
    }, []);

    const fetchSkillOfferings = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/skilloffering/getAllSkillOfferingRecord');
            setSkillOfferings(response.data);
        } catch (error) {
            console.error('Error fetching skill offerings:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id, status, description) => {
        setEditingSkillOfferingId(id);
        setNewStatus(status);
        setNewDescription(description);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/skilloffering/deleteSkillOfferingDetails/${id}`);
            fetchSkillOfferings(); // Refresh the table
        } catch (error) {
            console.error('Error deleting skill offering:', error);
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault();

        if (editingSkillOfferingId) {
            // Update skill offering
            try {
                await axios.put(`http://localhost:8080/api/skilloffering/putSkillOfferingDetails?id=${editingSkillOfferingId}`, {
                    status: newStatus,
                    description: newDescription,
                });
                setEditingSkillOfferingId(null); // Reset editing state
            } catch (error) {
                console.error('Error updating skill offering:', error);
            }
        } else {
            // Add new skill offering
            try {
                await axios.post('http://localhost:8080/api/skilloffering/postSkillOfferingRecord', {
                    status: newStatus,
                    description: newDescription,
                });
            } catch (error) {
                console.error('Error adding skill offering:', error);
            }
        }

        setNewStatus(''); // Clear input field
        setNewDescription(''); // Clear input field
        fetchSkillOfferings(); // Refresh the table
    };

    // Function to handle canceling the edit
    const handleCancelEdit = () => {
        setEditingSkillOfferingId(null);
        setNewStatus(''); // Clear the input field
        setNewDescription(''); // Clear the input field
    };

    return (
        <div>
            <h1>Skill Offering</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr>
                                <th style={{ padding: '10px', border: '1px solid black' }}>Skill Offering ID</th>
                                <th style={{ padding: '10px', border: '1px solid black' }}>Status</th>
                                <th style={{ padding: '10px', border: '1px solid black' }}>Description</th>
                                <th style={{ padding: '10px', border: '1px solid black' }}>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {skillOfferings.map((offering) => (
                                <tr key={offering.skillOfferingId}>
                                    <td style={{ padding: '10px', border: '1px solid black' }}>{offering.skillOfferingId}</td>
                                    <td style={{ padding: '10px', border: '1px solid black' }}>{offering.status}</td>
                                    <td style={{ padding: '10px', border: '1px solid black' }}>{offering.description}</td>
                                    <td style={{ padding: '10px', border: '1px solid black' }}>
                                        <button className="edit-button" onClick={() => handleEdit(offering.skillOfferingId, offering.status, offering.description)}>
                                            Edit
                                        </button>
                                        <button className="delete-button" onClick={() => handleDelete(offering.skillOfferingId)}>
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <br />
                    <br />
                    <form onSubmit={handleAddOrUpdate} style={{ textAlign: 'center', marginBottom: '20px' }}>
                        <input
                            type="text"
                            placeholder="Status"
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            required
                            className="input-field"
                        />
                        <input
                            type="text"
                            placeholder="Description"
                            value={newDescription}
                            onChange={(e) => setNewDescription(e.target.value)}
                            required
                            className="input-field"
                        />
                        <br />
                        <br />
                        <button type="submit">{editingSkillOfferingId ? 'Update' : 'Add'}</button>
                        {editingSkillOfferingId && (
                            <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
                                Cancel
                            </button>
                        )}
                    </form>
                </>
            )}
        </div>
    );
};

export default SkillOffering;
