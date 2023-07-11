import React from "react";
import './Signup.css';
import { Link } from 'react-router-dom';

export default function Signup() {

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
        image: ""
    })
    
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        if(type === 'checkbox') {
            setFormData(prevFormData => ({
                ...prevFormData,
                [name]: type === "checkbox" ? checked : value
            }))
        }
        
        console.log(formData)
    }

    return (
        <main className="App-signup-form-container">
            <form className="App-signup-form">
                <h1>Let's Get You Started!</h1>
                <br />
                <div className="App-signup-form-inputs">
                    <div className="App-signup-form-text-inputs">
                        <input 
                            type="text" 
                            placeholder="Username"
                            className="App-signup-form-input"
                            name="username"
                            onChange={handleChange}
                            value={formData.username}
                        />
                        <input 
                            type="password" 
                            placeholder="Password"
                            className="App-signup-form-input"
                            name="password"
                            onChange={handleChange}
                            value={formData.password}
                        />
                        <input 
                            type="password" 
                            placeholder="Confirm password"
                            className="App-signup-form-input"
                            name="passwordConfirm"
                            onChange={handleChange}
                            value={formData.passwordConfirm}
                        />
                        <input
                            type="text" 
                            placeholder="First name"
                            className="App-signup-form-input"
                            name="firstname"
                            onChange={handleChange}
                            value={formData.firstname}
                        />
                        <input
                            type="text" 
                            placeholder="Last name"
                            className="App-signup-form-input"
                            name="lastname"
                            onChange={handleChange}
                            value={formData.lastname}
                        />
                        <input 
                            type="email" 
                            placeholder="Email address"
                            className="App-signup-form-input"
                            name="email"
                            onChange={handleChange}
                            value={formData.email}
                        />
                        <input
                            type="text" 
                            placeholder="Phone Number"
                            className="App-signup-form-input"
                            name="phoneNumber"
                            onChange={handleChange}
                            value={formData.phoneNumber}
                        />         
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
                                <label for="ProfilePicture"><img src="https://i.pinimg.com/originals/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg" alt="prof"/></label>
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