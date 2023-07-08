import React from 'react'
import logo from '../images/airdnd-logo.png'
import Navbar from './Navbar'

export default function Header() {
    return (
        <header className='App-header'>
            <img src={logo} alt="logo" className="App-logo" />
            <Navbar/>
        </header>
    )
}