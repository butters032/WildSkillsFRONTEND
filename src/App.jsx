import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Category from './Components/Category';
import SkillOffering from './Components/SkillOffering';
import './App.css'; 

const App = () => {
    return (
        <Router>
            <div style={{ textAlign: 'center', margin: '20px' }}>
            <div className="apptxt">WildSkills</div>
                <nav>
                    <Link to="/categories" style={{ margin: '10px', textDecoration: 'none' }}>Categories</Link>
                    <Link to="/skill-offerings" style={{ margin: '10px', textDecoration: 'none' }}>Skill Offerings</Link>
                </nav>
                <Routes>
                    <Route path="/categories" element={<Category/>} />
                    <Route path="/skill-offerings" element={<SkillOffering />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
