import React from "react";
import LoginTextInput from './LoginTextInput';
import './Login.css'
import { Link } from 'react-router-dom';

export default function Login() {

    const [formData, setFormData] = React.useState({
        username: "",
        password: ""
    })

    const textInputs = [
        {id:1, type: "text", placeholder: "Username", name: "username", value: formData.username},
        {id:2, type: "password", placeholder: "Password", name: "password", value: formData.password}
    ]

    const textInputElements = textInputs.map(textInput => (
        <LoginTextInput
            key={textInput.id}
            type={textInput.type}
            placeholder={textInput.placeholder}
            name={textInput.name}
            value={textInput.value}
            onChange={(event) => handleChange(event)}
        />
    ))

    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    return (
        <main className="App-login-form-container">
            <form className="App-login-form">
                <h1>Login</h1>
                <br />
                <div className="App-login-form-inputs">
                    <div className="App-login-form-text-inputs">
                        {textInputElements}
                    </div>
                </div>
                <br /><br /><br />
                <button 
                    className="App-login-form-submit"
                >
                    Login
                </button>
                <p>Don't have an account? <Link to='/signup'>Register!</Link></p>
            </form>
        </main>
    )
}