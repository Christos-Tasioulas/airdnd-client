import React, { useState, useEffect } from 'react';
import NavbarButton from './NavbarButton';
import './Navbar.css';

export default function Navbar(props) {
    const [navbarButtons, setNavbarButtons] = useState([]);

    useEffect(() => {
        if (props.userIsLoggedIn) {
            setNavbarButtons([
                { id: 1, path: '/', name: 'Home', isActive: true },
                { id: 2, path: '/profile', name: 'Profile', isActive: false },
                { id: 3, path: '/', name: 'Logout', isActive: false },
                { id: 4, path: '/about', name: 'About', isActive: false },
                { id: 5, path: '/contact', name: 'Contact', isActive: false }
            ]);
        } else {
            setNavbarButtons([
                { id: 1, path: '/', name: 'Home', isActive: true },
                { id: 2, path: '/login', name: 'Login', isActive: false },
                { id: 3, path: '/signup', name: 'Signup', isActive: false },
                { id: 4, path: '/about', name: 'About', isActive: false },
                { id: 5, path: '/contact', name: 'Contact', isActive: false }
            ]);
        }
    }, [props.userIsLoggedIn]);

    function toggleActive(id) {
        setNavbarButtons(prevState => {
            return prevState.map((button) => {
                return button.id === id ? { ...button, isActive: true } : { ...button, isActive: false };
            });
        });
    }

    const navbarButtonElements = navbarButtons.map(button => (
        <NavbarButton
            key={button.id}
            className={button.isActive ? 'App-navbar-button-active' : 'App-navbar-button'}
            toggle={() => toggleActive(button.id)}
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
