import React from "react";
import LoginTextInput from './LoginTextInput';
import './Login.css'
import { Link } from 'react-router-dom';

export default function Login() {

    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     */ 
    const [formData, setFormData] = React.useState({
        username: "",
        password: ""
    })

    /**
     * All the input fields inside the form
     * In our formData object, the name attribute of the input is the name of the respective field as well
     * In our formData object, the value attribute of the input is the value of respective the field as well
     */
    const textInputs = [
        {id:1, type: "text", placeholder: "Username", name: "username", value: formData.username},
        {id:2, type: "password", placeholder: "Password", name: "password", value: formData.password}
    ]

    // Login Input html elements
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

    // This is where we change the formData members accordingly
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
                {/* In React Submit input can be labeled as button inside forms */}
                <button 
                    className="App-login-form-submit"
                >
                    Login
                </button>
                {/* Redirecting to signup if needed */}
                <p>Don't have an account? <Link to='/signup'>Register!</Link></p>
            </form>
        </main>
    )
}