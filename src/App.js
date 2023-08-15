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
import Logout from './components/Logout';
import EditProfile from './components/EditProfile';
import UserInfo from './components/UserInfo';

function App() {
  
  // States that determine if a user is connected and if the user is connected if he is the admin
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
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
  
      // Validating and decoding the JSON Web Token
      fetch("http://localhost:5000/user/validateToken", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      })
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then(validationData => {

        // Token validation succeeded, now decode the token to check if the user is an admin
        return fetch("http://localhost:5000/user/decodeToken", {
          method: "GET",
          headers: {
            "Authorization": `Bearer ${token}`
          }
        })
        .then(decodeResponse => {
          if (!decodeResponse.ok) {
            throw new Error("Token decoding failed");
          }
          return decodeResponse.json();
        })
        .then(decodeData => {
          // Passing the information if the user is an admin or not
          setIsAdmin(decodeData.isAdmin);
        })
        .catch(error => {
          console.error(error);
          // Handle the error here, e.g., show an error message to the user
        });

      })
      .catch(error => {
        console.error(error);
        // Handle the error here, e.g., show an error message to the user
      });
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
            <Route path="/" element={<Home isAdmin={isAdmin} token={jsonWebToken}/>}/>
            <Route path="/login" element={<Login onRegistrationComplete={handleRegistrationComplete}/>}/>
            <Route path="/signup" element={<Signup onRegistrationComplete={handleRegistrationComplete}/>}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
            <Route path="/profile" element={<Profile token={jsonWebToken}/>}/>
            <Route path="/logout" element={<Logout />}/>
            <Route path="/editprofile" element={<EditProfile token={jsonWebToken}/>}/>
            <Route path="/userinfo/:id" element={<UserInfo />} />
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
