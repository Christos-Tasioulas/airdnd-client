import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';

// All Components (the ones we navigate to)
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';
import Profile from './components/Profile';
import Logout from './components/Logout';
import EditProfile from './components/EditProfile';
import AddPlace from './components/AddPlace';
import PlaceInfo from './components/PlaceInfo';
import Booking from './components/Booking';
import EditPlace from './components/EditPlace';
import UserInfo from './components/UserInfo';
import LandlordBooked from './components/LandlordBooked';
import Inbox from './components/Inbox';
import Message from './components/Message';
import StartMessage from './components/StartMessage'
import HostReviews from './components/HostReviews'

function App() {
  
  // States that determine if a user is connected and if the user is connected if he is the admin
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [jsonWebToken, setJsonWebToken] = useState()

  const handleRegistrationComplete = () => {
    setUserIsLoggedIn(true);
  };

  // Checking connection status, looking for a JSON Web Token in the session storage
  useEffect(() => {
    const token = sessionStorage.getItem("token");
    if (token) {
      setUserIsLoggedIn(true);
      setJsonWebToken(token);
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
            <Route path="/" element={<Home token={jsonWebToken}/>}/>
            <Route path="/login" element={<Login onRegistrationComplete={handleRegistrationComplete}/>}/>
            <Route path="/signup" element={<Signup onRegistrationComplete={handleRegistrationComplete}/>}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/profile" element={<Profile token={jsonWebToken}/>}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/editprofile" element={<EditProfile token={jsonWebToken}/>}/>
            <Route path="/addplace" element={<AddPlace token={jsonWebToken}/>}/>
            <Route path="/placeinfo/:id" element={<PlaceInfo token={jsonWebToken}/>}/>
            <Route path="/booking/:id" element={<Booking token={jsonWebToken}/>}/>
            <Route path="/editplace/:id" element={<EditPlace token={jsonWebToken}/>}/>
            <Route path="/userinfo/:id" element={<UserInfo token={jsonWebToken}/>}/>
            <Route path="/landlordbooked" element={<LandlordBooked token={jsonWebToken}/>}/>
            <Route path="/inbox" element={<Inbox token={jsonWebToken}/>}/>
            <Route path="/message/:id" element={<Message token={jsonWebToken}/>}/>
            <Route path="/startmessage/:id" element={<StartMessage token={jsonWebToken}/>}/>
            <Route path="/hostreviews/:id" element={<HostReviews token={jsonWebToken}/>}/>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;

// a