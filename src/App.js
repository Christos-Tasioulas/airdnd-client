import React, { useState } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';

function App() {
  
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(true);
  const [isAdmin, setIsAdmin] = useState(true);

  return (
    <div className="App">
      <BrowserRouter>
        <Header userIsLoggedIn={userIsLoggedIn}/>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin}/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/editprofile" element={<EditProfile />}/>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
