import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import NavbarButton from './NavbarButton';
import './Navbar.css';

export default function Navbar(props) {
    const location = useLocation()
    const [navbarButtons, setNavbarButtons] = useState([]);

    useEffect(() => {

        let newButtons;
        if (props.userIsLoggedIn) {
            newButtons = [
                { id: 1, path: '/', name: 'Home', isActive: true },
                { id: 2, path: '/profile', name: 'Profile', isActive: false },
                { id: 3, path: '/', name: 'Logout', isActive: false },
                { id: 4, path: '/about', name: 'About', isActive: false },
                { id: 5, path: '/contact', name: 'Contact', isActive: false }
            ]
        } else {
            newButtons = [
                { id: 1, path: '/', name: 'Home', isActive: true },
                { id: 2, path: '/login', name: 'Login', isActive: false },
                { id: 3, path: '/signup', name: 'Sign Up', isActive: false },
                { id: 4, path: '/about', name: 'About', isActive: false },
                { id: 5, path: '/contact', name: 'Contact', isActive: false }
            ]
        }

        newButtons = newButtons.map(button => {
            return {
                ...button,
                isActive: window.location.pathname === button.path
            }
        })

        setNavbarButtons(newButtons)

    }, [props.userIsLoggedIn, location]);

    const navbarButtonElements = navbarButtons.map(button => (
        <NavbarButton
            key={button.id}
            className={button.isActive ? 'App-navbar-button-active' : 'App-navbar-button'}
            path={button.path}
            name={button.name}
        />
    ));

    return (
        <nav className="App-navbar">
            <ul className="App-navbar-buttons">
                {navbarButtonElements}
            </ul>
        </nav>
    );
}
