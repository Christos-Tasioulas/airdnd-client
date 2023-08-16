import React from 'react';
import LoginTextInput from './LoginTextInput';
import {useNavigate} from 'react-router-dom';

export default function SafetyHazard(props) {

    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     */ 
    const [formData, setFormData] = React.useState({
        password: ""
    })

    // Message state that prints to the user if an error occurred in the register process
    const [message, setMessage] = React.useState("")
    
    const navigate = useNavigate();

    /**
     * All the input fields inside the form
     * In our formData object, the name attribute of the input is the name of the respective field as well
     * In our formData object, the value attribute of the input is the value of respective the field as well
     */
    const textInputs = [
        {id:1, type: "password", placeholder: "Password", name: "password", value: formData.password}
    ]

    // Safety Hazard as html elements
    // We are reusing the ones we used in the login component
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

    function handleSubmit(event) {

        // We don't want to be redirected to the home page
        event.preventDefault()

        // Checking if the passwords match
        if (formData.password !== props.prevPassword) {
            setMessage("Please enter the correct password")
            return
        }

        // code updating the user in the database
        

        // Navigating the user back to their profile page
        navigate('/profile');
    }

    return (
        <form className="App-login-form" onSubmit={handleSubmit}>
            {/* Any error will be printed to the user here */}
            {message !== "" && <h3 className="App-signup-form-message">{message}</h3>}
            <h1>Enter your previous password</h1>
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
                Confirm Saved Changes
            </button>
        </form>
    )
}