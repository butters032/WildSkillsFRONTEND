import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Category from './Components/Category';
import SkillOffering from './Components/SkillOffering';
import './App.css'; 
import Registration from './Components/Registration';

const App = () => {
    return (
        <Router>
            <div style={{ textAlign: 'center', margin: '20px' }}>
            <div className="apptxt">WildSkills</div>
                <nav>
                    <Link to="/categories" style={{ margin: '10px', textDecoration: 'none' }}>Categories</Link>
                    <Link to="/skill-offerings" style={{ margin: '10px', textDecoration: 'none' }}>Skill Offerings</Link>
                    <Link to="/registration" style={{ margin: '10px', textDecoration: 'none' }}>Registration</Link>
                </nav>
                <Routes>
                    <Route path="/categories" element={<Category/>} />
                    <Route path="/skill-offerings" element={<SkillOffering />} />
                    <Route path="/registration" element={<Registration />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
