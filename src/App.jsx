import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link, useNavigate } from 'react-router-dom';
import SkillExchange from './Components/SkillExchange';
import Category from './Components/Category';
import SkillOffering from './Components/SkillOffering';
import Chat from './Components/Chat';
import './App.css'; 
import Registration from './Components/Registration';
import UserIcon from './assets/images/UserIcon.png'
import Gig from './Components/Gig';
import Review from './Components/Review';
import Home from './Components/Home';
import { Typography } from '@mui/material';
import Profile from './Components/Profile';
import Login from './Components/Login';

const App = () => {

    return (
        <Router>
            <div style={{ textAlign: 'center', margin: '20px' }}>
                <div className="apptxt" style={{borderBottom: "solid 2px", paddingBottom: 10}}>
                    <span style={{ alignSelf: 'start', display: 'flex'}}>
                        {/*<Typography class='apptxt' onClick={handleClick()}>WildSkills</Typography>*/}
                        <Link to="/" class="apptxt">WildSkills</Link>
                    </span>
                    <span style={{ alignSelf: 'end', display: 'flex' }}>
                        <img src={UserIcon} alt="User Icon" style={{width: '65px', height:'65px'}}/>
                    </span>
                </div>

                <div className="routetxt" >
                <nav>
                    <Link to="/categories" style={{ margin: '10px', textDecoration: 'none' }}>Categories</Link>
                    <Link to="/skill-offerings" style={{ margin: '10px', textDecoration: 'none',color:'black' }}>Skill Offerings</Link>
                    <Link to="/registration" style={{ margin: '10px', textDecoration: 'none',color:'black' }}>Registration</Link>
                    <Link to="/skill-exchange" style={{ margin: '10px', textDecoration: 'none',color:'black' }}>Skill Exchange</Link>
                    <Link to="/chat" style={{ margin: '10px', textDecoration: 'none', color: 'black'}}>Chat</Link>
                    <Link to="/reviews" style={{ margin: '10px', textDecoration: 'none', color: 'black'}}>Reviews</Link>
                    
                    <Link to="/profile" style={{ margin: '10px', textDecoration: 'none', color: 'black'}}>Profile</Link>
                    <Link to="/login" style={{ margin: '10px', textDecoration: 'none', color: 'black'}}>Login</Link>
                </nav>
                </div>
                <Routes>
                    <Route path="/categories" element={<Category/>} />
                    <Route path="/" element={<Home />} />
                    <Route path="/skill-offerings" element={<SkillOffering />} />
                    <Route path="/registration" element={<Registration />} />
                    <Route path="/skill-exchange" element={<SkillExchange/>}/>
                    <Route path="/gig/:id" element={<Gig />} />
                    <Route path="/chat" element={<Chat/>}/>
                    <Route path="/reviews" element={<Review />}/>

                    <Route path="/profile" element={<Profile />}/>
                    <Route path="/login" element={<Login />}/>
                </Routes>
            </div>
        </Router>
    );
};

export default App;
