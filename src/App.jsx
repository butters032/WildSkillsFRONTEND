import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, Link, Navigate } from 'react-router-dom';
import axios from 'axios';
import SkillExchange from './Components/SkillExchange';
import Category from './Components/Category';
import SkillOffering from './Components/SkillOffering';
import Chat from './Components/Chat';
import './App.css'; 
import Registration from './Components/Registration';
import UserIcon from './assets/images/UserIcon.png';
import Gig from './Components/Gig';
import Review from './Components/Review';
import Home from './Components/Home';
import Profile from './Components/Profile';
import Login from './Components/Login';
import ReviewList from './Components/ReviewList';
import UpdateReview from './Components/ReviewUpdate';
import { Button } from '@mui/material';

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [userId, setUserId] = useState(() => localStorage.getItem('userId') || 'blank');
    
    const [authId, setAuthId] = useState(() => localStorage.getItem('authId') || 'blank');

    const [sessionEnd, setSessionEnd] = useState(() => {
        const storedSessionEnd = localStorage.getItem('sessionEnd');
        return storedSessionEnd ? new Date(storedSessionEnd) : new Date();
    });

    const defaultVal = 'blank';

    useEffect(() => {
        localStorage.setItem('authId', authId);
        localStorage.setItem('userId', userId);

        console.log('Auth Id: ',authId);
        console.log('User Id: ',authId);

        if (authId !== 'blank') {
            setAuthenticated(true);
        }
        else {
            setAuthenticated(false);
        }

    }, [authId,userId]);
    //authId,userId

    

    useEffect(() => {
        const checkAuth = async (authId) => {
            if (authId !== 'blank') {
                try {
                    const authResponse = await apiAuth.get(`/getAuthenticationDetails?authId=${authId}`);
                    const currStatus = authResponse.data.authStatus;
                    const sessionEndTime = new Date(authResponse.data.sessionDurationEnd);
                    const currTime = new Date();

                    localStorage.setItem('sessionEnd', sessionEndTime.toISOString());
                    setSessionEnd(sessionEndTime);

                    if (currStatus && sessionEndTime > currTime) {
                        setAuthenticated(true);
                    } else {
                        setAuthenticated(false);
                    }
                } catch (error) {
                    console.error('Error checking authentication status', error);
                    setAuthenticated(false);
                }
            }
        };

        checkAuth(authId);
    }, [authId]);


    return (
        <>
            <Router>
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <div className="apptxt" style={{ borderBottom: "solid 2px", paddingBottom: 10, backgroundColor: "#800000" }}>
                        <span style={{ alignSelf: 'start', display: 'flex'}}>
                            <Link to="/" className="apptxt">WildSkills</Link>
                        </span>
                        <span style={{ alignSelf: 'end', display: 'flex' }}>
                            <img src={UserIcon} alt="User Icon" style={{ width: '65px', height: '65px' }} />
                        </span>
                    </div>

                    <div className="routetxt">
                        <nav>
                            {authenticated && (
                                <>
                                    <Link to="/categories" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Categories</Link>
                                    <Link to="/skill-offerings" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Skill Offerings</Link>
                                    <Link to="/skill-exchange" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Skill Exchange</Link>
                                    <Link to="/chat" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Chat</Link>
                                    <Link to="/reviewList" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Reviews</Link>
                                    <Link to="/profile" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Profile</Link>
                                    <Button onClick={logoutHandle} style={{ color: 'white' }}>Logout</Button>
                                </>
                            )}
                            
                        </nav>
                    </div>
                    
                    <Routes>
                        <Route path="/" element={authenticated ? <Home userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/categories" element={authenticated ? <Category userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/skill-offerings" element={authenticated ? <SkillOffering userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/registration" element={<Registration userId={userId}/>} />
                        <Route path="/skill-exchange" element={authenticated ? <SkillExchange userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/gig/:id" element={authenticated ? <Gig userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/chat" element={authenticated ? <Chat userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/reviews" element={authenticated ? <Review userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/reviewList" element={authenticated ? <ReviewList userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/update-review/:id" element={authenticated ? <UpdateReview userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/profile" element={authenticated ? <Profile userId={userId}/> : <Navigate to="/login" />} />
                        <Route path="/login" element={authenticated ?  <Navigate to="/" /> :<Login setUserId={setUserId} setAuthId={setAuthId}/>} />
                    </Routes>
                </div>
            </Router>
        </>
    );
};

export default App;
