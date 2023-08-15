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

    const [message, setMessage] = React.useState("")
    const [users, setUsers] = React.useState([])
    const [authToken, setAuthToken] = React.useState("")

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

    async function handleSubmit(event) {
        event.preventDefault();
        
        try {
            /* Check if the username exists */
        
            // Retrieving the users with the same username as given
            const response = await fetch(
                `http://localhost:5000/user/getUsersByUsername/${formData.username}`,
                {
                    method: "GET",
                }
            );
        
            if (!response.ok) {
                // Handle the response status if it's not successful (e.g., 404, 500, etc.)
                throw new Error("Network response was not ok");
            }
        
            const data = await response.json();
            setUsers(data.message);
        
            // Use the state variable directly here
            if (data.message.length === 0) {
                setMessage(`User with username ${formData.username} does not exist`);
                return;
            }
        
            const user = data.message[0];
        
            if (formData.password !== user.password) {
                setMessage("Incorrect password");
                return;
            }

            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    id: user.id,
                    username: user.username,
                    password: user.password,
                    isAdmin: user.isAdmin,
                    isLandlord: user.isLandlord,
                    isTenant: user.isTenant
                })
            }

            await fetch("http://localhost:5000/user/generateToken", requestOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Network response was not ok");
                    }
                    console.log(response);
                    return response.json(); // Parse the response JSON
                })
                .then(data => {
                    // Get token from response data
                    const token = data.token;
                    console.log(data.token);

                    // Set token to Axios common header
                    setAuthToken(token);
                    sessionStorage.setItem("token", JSON.stringify(token));

                    // Request token validation from the server
                    return fetch("http://localhost:5000/user/validateToken", {
                        method: "GET",
                        headers: {
                            "Authorization": `Bearer ${token}`
                        }
                    });
                })
                .then(validationResponse => {
                    if (!validationResponse.ok) {
                        throw new Error("Token validation failed");
                    }
                    
                    // Token validation succeeded, now you can retrieve data from the validation response
                    return validationResponse.json();
                })
                .then(validationData => {
                    // Use the validationData as needed
                    sessionStorage.setItem("user", JSON.stringify(validationData.message));

                    window.location.href = "/"
                })
                .catch(error => {
                    console.error(error);
                    // Handle the error here, e.g., show an error message to the user
                });


        } catch (error) {
            console.log(error);
            setMessage("Failed to login. Please try again later.");
        }
    }
      

    return (
        <main className="App-login-form-container">
            <form className="App-login-form" onSubmit={handleSubmit}>
                {message !== "" && <h3 className="App-signup-form-message">{message}</h3>}
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