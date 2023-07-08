// import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function Navbar() {
    // const [navbarButtons, setNavbarButtons] = useState()

    return (
        <nav className='App-navbar'>
            <ul className='App-navbar-buttons'>
                <li className='App-navbar-button'><Link to='/'>Home</Link></li>
                <li className='App-navbar-button'><Link to='/about'>About</Link></li>
                <li className='App-navbar-button'><Link to='/contact'>Contact</Link></li>
            </ul>
        </nav>
    )
}