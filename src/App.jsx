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

const App = () => {
    const [authenticated, setAuthenticated] = useState(false);
    const [userId, setUserId] = useState('blank');
    //const [authId, setAuthId] = useState('blank');
    const [newAuthId, setNewAuthId] = useState('blank');


    const [authId, setAuthId] = useState(() => { 
        return localStorage.getItem('authId') || 'blank';});

    const [sessionEnd, setSessionEnd] = useState(() => {
        const storedSessionEnd = localStorage.getItem('sessionEnd');
        return storedSessionEnd ? new Date(storedSessionEnd) : new Date();
    });

    
    useEffect(() => { localStorage.setItem('authId', authId);
     }, [authId]);



    console.log('This is the auth id:', authId);
    
    console.log(userId);
    console.log('THIS IS THE NEW AUTH ID: ',newAuthId);

    const apiAuth = axios.create({
        baseURL: 'http://localhost:8080/api/wildSkills/authentication',
        timeout: 1000,
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        }
    });


    useEffect(()=>{
        if (newAuthId==authId){
            setAuthenticated(true);
         }
    })
    console.log('New AuthId and Local AuthId Sync...',authenticated);


    useEffect(() => {
        
        const checkAuth = async (authenticated,authId) => {
            if (authenticated == true) {
                try {
                    const authResponse = await apiAuth.get(`/getAuthenticationDetails?authId=${authId}`);
                    const currStatus = authResponse.data.authStatus;
                    if(currStatus==true){
                        setAuthenticated(true);
                        console.log('current Status: ', currStatus);
                        const sessionEndTime = new Date(authResponse.data.sessionDurationEnd);
                        console.log('Session END TIME:', sessionEndTime);
                        console.log('TEst:', authResponse);
                        const currTime = new Date();
                        localStorage.setItem('sessionEnd', sessionEndTime.toISOString());
                        setSessionEnd(sessionEndTime);
                        console.log('Session duration:', currTime);
                        if(sessionEndTime<currTime){
                            setAuthenticated(false);
                        }
                        else{
                            setAuthenticated(true);
                            console.log('Successfully Logged In');
                        }
                    }
                    else{
                        setAuthenticated(false);
                    }
                    
                } catch (error) {
                    console.error('Error checking authentication status', error);
                    setAuthenticated(false);
                }
            }
        };

        checkAuth(authenticated,authId);
    }, [authenticated]);


    return (
        <>
            <Router>
                <div style={{ textAlign: 'center', margin: '20px' }}>
                    <div className="apptxt" style={{borderBottom: "solid 2px", paddingBottom: 10, backgroundColor: "#800000"}}>
                        <span style={{ alignSelf: 'start', display: 'flex'}}>
                            <Link to="/" class="apptxt">WildSkills</Link>
                        </span>
                        <span style={{ alignSelf: 'end', display: 'flex' }}>
                            <img src={UserIcon} alt="User Icon" style={{ width: '65px', height: '65px' }} />
                        </span>
                    </div>

                    <div className="routetxt" >
                    <nav>
                        <Link to="/categories" style={{ margin: '10px', textDecoration: 'none', color: 'white' }}>Categories</Link>
                        <Link to="/skill-offerings" style={{ margin: '10px', textDecoration: 'none',color:'white' }}>Skill Offerings</Link>
                        <Link to="/registration" style={{ margin: '10px', textDecoration: 'none',color:'white' }}>Registration</Link>
                        <Link to="/skill-exchange" style={{ margin: '10px', textDecoration: 'none',color:'white' }}>Skill Exchange</Link>
                        <Link to="/chat" style={{ margin: '10px', textDecoration: 'none', color: 'white'}}>Chat</Link>
                        <Link to="/reviewList" style={{ margin: '10px', textDecoration: 'none', color: 'white'}}>Reviews</Link>
                        
                        <Link to="/profile" style={{ margin: '10px', textDecoration: 'none', color: 'white'}}>Profile</Link>
                        <Link to="/login" style={{ margin: '10px', textDecoration: 'none', color: 'white'}}>Login</Link>
                    </nav>
                    </div>

                    <Routes>
                        <Route path="/categories" element={authenticated ? <Category /> : <Navigate to="/login" />} />
                        <Route path="/" element={authenticated ? <Home /> : <Navigate to="/login" />} />
                        <Route path="/skill-offerings" element={authenticated ? <SkillOffering /> : <Navigate to="/login" />} />
                        <Route path="/registration" element={<Registration />} />
                        <Route path="/skill-exchange" element={authenticated ? <SkillExchange /> : <Navigate to="/login" />} />
                        <Route path="/gig/:id" element={authenticated ? <Gig /> : <Navigate to="/login" />} />
                        <Route path="/chat" element={authenticated ? <Chat /> : <Navigate to="/login" />} />
                        <Route path="/reviews" element={authenticated ? <Review /> : <Navigate to="/login" />} />
                        <Route path="/reviewList" element={authenticated ? <ReviewList /> : <Navigate to="/login" />} />
                        <Route path="/update-review/:id" element={authenticated ? <UpdateReview /> : <Navigate to="/login" />} />
                        <Route path="/profile" element={authenticated ? <Profile /> : <Navigate to="/login" />} />
                        <Route path="/login" element={<Login setUserId={setUserId} setNewAuthId={setNewAuthId}/>} />
                    </Routes>
                </div>
            </Router>
        </>
    );
};

export default App;
