import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Category from './Components/Category';
import SkillOffering from './Components/SkillOffering';
import './App.css'; 
import Divider from '@mui/material/Divider';
import UserIcon from './assets/images/UserIcon.png'
import TextField from '@mui/material/TextField';

const App = () => {
    return (
        <Router>
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <div className="apptxt">
                    <span style={{ alignSelf: 'start', display: 'flex'}}>WildSkills</span>
                    <span style={{ alignSelf: 'end', display: 'flex' }}>
                        <img src={UserIcon} alt="User Icon" style={{width: '65px', height:'65px'}}/>
                    </span>
                </div>

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
