import React, { useState, useEffect } from 'react';
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {

    fetch("http://localhost:5000/user/getAllUsers")
      .then((res) => res.json())
      .then((data) => setUsers(data.message))
  }, []);

  const userElements = users.map(user => {
    return (
      <div>
        {user.firstname}<br />
        {user.lastname}<br />
      </div>
    )
  })

  return (
    <div className="App">
      <BrowserRouter>
        <Header />
        <div className="App-body">
          <Routes>
            <Route path="/" element={<Home users={userElements}/>}/>
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
