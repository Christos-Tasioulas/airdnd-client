import React, { useState } from "react";
import './Signup.css';
import { Link } from 'react-router-dom';
import SignupTextInput from './SignupTextInput';

export default function Signup() {

    const [users, setUsers] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const [userIsApproved, setUserIsApprovred] = useState(true);
    const [formData, setFormData] = React.useState({
        username: "",
        password: "",
        passwordConfirm: "",
        firstname: "",
        lastname: "",
        email: "",
        phoneNumber: "",
        isTenant: false,
        isLandlord: false,
        isApproved: true,
        image: ""
    })

    const [message, setMessage] = React.useState("") 

    const textInputs = [
        {id:1, type: "text", placeholder: "Username", name: "username", value: formData.username},
        {id:2, type: "password", placeholder: "Password", name: "password", value: formData.password},
        {id:3, type: "password", placeholder: "Confirm Password", name: "passwordConfirm", value: formData.passwordConfirm},
        {id:4, type: "text", placeholder: "First name", name: "firstname", value: formData.firstname},
        {id:5, type: "text", placeholder: "Last name", name: "lastname", value: formData.lastname},
        {id:6, type: "email", placeholder: "Email", name: "email", value: formData.email},
        {id:7, type: "text", placeholder: "Phone Number", name: "phoneNumber", value: formData.phoneNumber}
    ]

    const textInputElements = textInputs.map(textInput => (
        <SignupTextInput
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

    async function handleSubmit(event) {
        event.preventDefault();
      
        if (formData.username === "") {
            setMessage("Please enter a username");
            return;
        }
      
        if (formData.password === "" || formData.passwordConfirm === "") {
            setMessage("Please enter a password twice");
            return;
        }
      
        if (formData.firstname === "" || formData.lastname === "") {
            setMessage("Please enter your name");
            return;
        }
      
        if (formData.email === "") {
            setMessage("Please enter your email address");
            return;
        }
      
        if (formData.phoneNumber === "") {
            setMessage("Please enter your number");
            return;
        }
      
        try {
            // Check if the username is already taken
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
        
            if (formData.password !== formData.passwordConfirm) {
                setMessage("Error, passwords do not match!");
                return;
            }
        
            if (users.length !== 0) {
                setMessage("Username already taken, choose another");
                return;
            }
        
            if (!formData.isTenant && !formData.isLandlord) {
                setMessage("Please choose a role in the app");
                return;
            }
        
            // Handle other conditions and submit the form data
            if (formData.isLandlord) {
                setUserIsApprovred(false);
            
                setFormData((prevFormData) => ({
                    ...prevFormData,
                    isApproved: !prevFormData.isApproved,
                }));
            }
        
            const formDataCopy = { ...formData };
            formDataCopy.isAdmin = false;
            formDataCopy.isApproved = !formDataCopy.isLandlord;
        
            const requestOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataCopy),
            };
        
            // Call the API to add the user
            await fetch("http://localhost:5000/user/addUser", requestOptions);
        
            setIsRegistered(true);
        } catch (error) {
            console.log(error);
            setMessage("Failed to add user. Please try again later.");
        }
    }
      

    return (
        <main className="App-signup-form-container">
            {!isRegistered && <form className="App-signup-form" onSubmit={handleSubmit}>
                {message !== "" && <h3 className="App-signup-form-message">{message}</h3>}
                <h1>Let's Get You Started!</h1>
                <br />
                <div className="App-signup-form-inputs">
                    <div className="App-signup-form-text-inputs">
                        {textInputElements}
                    </div>
                    <div className="App-signup-form-other-inputs">
                        <div className="App-signup-form-image-container">
                            <h3>Add your Profile Picture</h3>
                            <div className="App-signup-form-image">
                                <input
                                    id="ProfilePicture"
                                    type="file"
                                    className="App-signup-form-image-uploader"
                                    name="image"
                                    onChange={handleChange}
                                    value={formData.image}
                                />
                                <label htmlFor="ProfilePicture"><img src="https://i.pinimg.com/originals/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg" alt="prof"/></label>
                            </div>
                        </div>
                        <h3>Choose any of the roles below: </h3>
                        <p>You can choose either one or both</p>
                        <div className="App-signup-form-checkboxes">
                            <div className="App-signup-form-roles">
                                <input
                                    id="tenant"
                                    className="App-signup-form-checkbox"
                                    type="checkbox"
                                    name="isTenant"
                                    onChange={handleChange}
                                    checked={formData.isTenant}
                                />
                                <label htmlFor="tenant">Tenant</label>
                            </div>
                            <div className="App-signup-form-roles">
                                <input
                                    id="landlord"
                                    className="App-signup-form-checkbox"
                                    type="checkbox"
                                    name="isLandlord"
                                    onChange={handleChange}
                                    checked={formData.isLandlord}
                                />
                                <label htmlFor="landlord">Landlord</label>
                            </div>         
                        </div>
                    </div>
                </div>
                <br /><br /><br />
                <button 
                    className="App-signup-form-submit"
                >
                    Sign up
                </button>
                <p>Already have an <Link to='/login'>Account</Link>?</p>
            </form>}
            {isRegistered && userIsApproved && <div className="App-approved">
                <img src="https://cdn-icons-png.flaticon.com/512/148/148767.png" alt="success"/>
                <h2>Sucessfully Registered</h2>
                <h4>Return to <Link to="/" style={{color: "black", textDecoration: 'none'}}>Home Page</Link></h4>
            </div>}
            {isRegistered && !userIsApproved && <div className="App-waiting-for-approval">
                <img src="https://icones.pro/wp-content/uploads/2021/03/icone-d-horloge-rouge.png" alt="pending"/>
                <h2>Waiting for approval to become landlord</h2>
                <h4>Return to <Link to="/" style={{color: "#d04b4d", textDecoration: 'none'}}>Home Page</Link></h4>
            </div>}
        </main>
    )
}