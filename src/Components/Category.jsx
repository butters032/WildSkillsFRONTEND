import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Category = ({ onCategoriesChange }) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [editingCategoryId, setEditingCategoryId] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await axios.get('http://localhost:8080/api/wildSkills/category/getAllCategory');
            setCategories(response.data);
            if (onCategoriesChange) {
                onCategoriesChange(response.data); 
            }
        } catch (error) {
            console.error('Error fetching categories:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (id, name) => {
        setEditingCategoryId(id);
        setNewCategoryName(name);
    };

    const handleDelete = async (id) => {
        try {
            await axios.delete(`http://localhost:8080/api/wildSkills/category/deleteCourseDetails/${id}`);
            fetchCategories(); 
        } catch (error) {
            console.error('Error deleting category:', error);
        }
    };

    const handleAddOrUpdate = async (e) => {
        e.preventDefault(); 

        if (editingCategoryId) {
            try {
                await axios.put(`http://localhost:8080/api/wildSkills/category/putCategoryDetails?id=${editingCategoryId}`, {
                    name: newCategoryName,
                });
                setEditingCategoryId(null); 
            } catch (error) {
                console.error('Error updating category:', error);
            }
        } else {
            try {
                await axios.post('http://localhost:8080/api/wildSkills/category/postCategoryRecord', {
                    name: newCategoryName,
                });
            } catch (error) {
                console.error('Error adding category:', error);
            }
        }

        setNewCategoryName('');
        fetchCategories(); 
    };
    const handleCancelEdit = () => {
        setEditingCategoryId(null);
        setNewCategoryName('');
    };

    return (
        <div>
            <br></br>
            <h1>Category</h1>
            {loading ? (
                <p>Loading...</p>
            ) : (
                <table style={{ margin: '0 auto', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr>
                            <th style={{ padding: '10px', border: '1px solid black' }}>Category ID</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>Name</th>
                            <th style={{ padding: '10px', border: '1px solid black' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.categoryId}>
                                <td style={{ padding: '10px', border: '1px solid black' }}>{category.categoryId}</td>
                                <td style={{ padding: '10px', border: '1px solid black' }}>{category.name}</td>
                                <td style={{ padding: '10px', border: '1px solid black' }}>
                                    <button className="edit-button" onClick={() => handleEdit(category.categoryId, category.name)}>
                                        Edit
                                    </button>
                                    <button className="delete-button" onClick={() => handleDelete(category.categoryId)}>
                                        Delete
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
            <br />
            <form onSubmit={handleAddOrUpdate} style={{ textAlign: 'center', marginTop: '20px' }}>
                <input
                    type="text"
                    placeholder="Category Name"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    required
                    className="input-field"
                />
                <br />
                <br />
                <button type="submit">{editingCategoryId ? 'Update' : 'Add'}</button>
                {editingCategoryId && (
                    <button type="button" onClick={handleCancelEdit} style={{ marginLeft: '10px' }}>
                        Cancel
                    </button>
                )}
            </form>
        </div>
    );
};

export default Category;
