import React from 'react';
import LoginTextInput from './LoginTextInput';
import {useNavigate} from 'react-router-dom';

export default function SafetyHazard(props) {

    const [formData, setFormData] = React.useState({
        password: ""
    })
    const [message, setMessage] = React.useState("")
    
    const navigate = useNavigate();

    const textInputs = [
        {id:1, type: "password", placeholder: "Password", name: "password", value: formData.password}
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

    function handleSubmit(event) {
        event.preventDefault()

        if (formData.password !== props.prevPassword) {
            setMessage("Please enter the correct password")
            return
        }

        // code updating the user in the database

        navigate('/profile');
    }

    return (
        <form className="App-login-form" onSubmit={handleSubmit}>
            {message !== "" && <h3 className="App-signup-form-message">{message}</h3>}
            <h1>Enter your previous password</h1>
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
                Confirm Saved Changes
            </button>
        </form>
    )
}