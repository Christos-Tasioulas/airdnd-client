import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/Login';
import Signup from './components/Signup';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const [users, setUsers] = useState([]);
  const [userIsLoggedIn, setUserIsLoggedIn] = useState(false);

  useEffect(() => {

    fetch("http://localhost:5000/user/getAllUsers")
      .then((res) => res.json())
      .then((data) => setUsers(data.message))
  }, []);

  return (
    <div className="App">
      <BrowserRouter>
        <Header userIsLoggedIn={userIsLoggedIn}/>
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home users={users}/>}/>
            <Route path="/login" element={<Login />}/>
            <Route path="/signup" element={<Signup />}/>
            <Route path="/about" element={<About />}/>
            <Route path="/contact" element={<Contact />}/>
          </Routes>
        </div>
        <Footer />
      </BrowserRouter>
    </div>
  );
}

export default App;
