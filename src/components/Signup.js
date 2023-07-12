import React from "react";
import './Signup.css';
import { Link } from 'react-router-dom';
import SignupTextInput from './SignupTextInput';

export default function Signup(props) {

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

    function handleSubmit(event) {
        event.preventDefault()

        const sameUsername = props.users.find(user => user.username === formData.username)

        if(formData.username === "") {
            setMessage("Please enter a username")
            return
        } else if((formData.password === "") || (formData.passwordConfirm === "")) {
            setMessage("Please enter a password twice")
            return
        } else if((formData.firstname === "") || (formData.lastname === "")) {
            setMessage("Please enter your name")
            return
        } else if(formData.email === "") {
            setMessage("Please enter your email address")
            return
        } else if(formData.phoneNumber === "") {
            setMessage("Please enter your number")
            return
        }
        
        if(formData.password !== formData.passwordConfirm) {
            setMessage("Error, passwords do not match!")
            return
        } else if (sameUsername !== undefined) {
            setMessage("Username already taken, choose another")
            return
        } else if ((formData.isTenant === false) && (formData.isLandlord === false)) {
            setMessage("Please choose a role in the app")
            return
        }

        if(formData.isLandlord) {
            setFormData(prevFormData => ({
                ...prevFormData,
                isApproved: false
            }))

            setMessage("Waiting for approval to become landlord")
        }

        const formDataCopy = formData
        formDataCopy['isAdmin'] = false 

        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(formDataCopy)
        }

        fetch('http://localhost:5000/user/addUser', requestOptions)
    }

    return (
        <main className="App-signup-form-container">
            <form className="App-signup-form" onSubmit={handleSubmit}>
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
            </form>
        </main>
    )
}