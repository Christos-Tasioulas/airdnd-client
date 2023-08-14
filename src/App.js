import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';

// All Components
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';
import Profile from './components/Profile';
import EditProfile from './components/EditProfile';
import UserInfo from './components/UserInfo';

function App() {
  
  // States that determine if a user is connected and if the user is connected if he is the admin
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState()

  useEffect(() => {
    const loggedInUser = localStorage.getItem("user");
    console.log(loggedInUser)
    if (loggedInUser) {
      const foundUser = JSON.parse(loggedInUser);
      setUser(foundUser);
      setUserIsLoggedIn(true);
      setIsAdmin(foundUser.isAdmin)
    }
  }, []);

  // React functions return html elements
  return (
    <div className="App">
      <BrowserRouter>
        <Header userIsLoggedIn={userIsLoggedIn}/> 
        <div className="App-body">
          {/* All the routes of the client app */}
          <Routes>
            <Route path="/" element={<Home isAdmin={isAdmin}/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/editprofile" element={<EditProfile />}/>
            <Route path="/userinfo/:id" element={<UserInfo />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
