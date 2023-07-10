import React from "react";

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
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    return (
        <main className="App-signup-form-container">
            <form className="App-signup-form">
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
                    value={formData.firstname}
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
                <button 
                    className="App-signup-form-submit"
                >
                    Sign up
                </button>
            </form>
        </main>
    )
}