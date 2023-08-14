import React, { useState } from "react";
import './Signup.css';
import SignupTextInput from './SignupTextInput';
import SafetyHazard from './SafetyHazard';

/**
 * WARNING: This component is very half-baked. The update request exists but needs the user authentication to work properly.
 * Many functions, elements and variables inside are at template state. They need to change when everything gets to work.
 */
export default function EditProfile() {

    // This state is copy-pasted from the signup component
    // TODO: Change this to user whenever possible
    const [user, setUser] = useState([]);

    // This state will be needed to save the user changes in a safely manner
    const [hasMadeChanges, setHasMadeChanges] = useState(false);

    // This state is copy-pasted from the signup component. Probably not needed here.
    const [isApproved, setIsApprovred] = useState(true);

    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     * Notice that the fields are assigned to values as if a user is not registered.
     * That's because we need the authentication to work properly first to assign the values properly
     */ 
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

    // Storing the previous password, needed for Safety Hazard Check
    const prevPassword = formData.password

    // Message state that prints to the user if an error occurred in the update process
    const [message, setMessage] = React.useState("") 

    /**
     * All the input fields inside the form
     * In our formData object, the name attribute of the input is the name of the respective field as well
     * In our formData object, the value attribute of the input is the value of respective the field as well
     */
    const textInputs = [
        {id:1, type: "text", placeholder: "Change Username", name: "username", value: formData.username},
        {id:2, type: "password", placeholder: "Change Password", name: "password", value: formData.password},
        {id:3, type: "password", placeholder: "Confirm Changed Password", name: "passwordConfirm", value: formData.passwordConfirm},
        {id:4, type: "text", placeholder: "Change First name", name: "firstname", value: formData.firstname},
        {id:5, type: "text", placeholder: "Change Last name", name: "lastname", value: formData.lastname},
        {id:6, type: "email", placeholder: "Change Email", name: "email", value: formData.email},
        {id:7, type: "text", placeholder: "Change Phone Number", name: "phoneNumber", value: formData.phoneNumber}
    ]

    // Edit Profile Input html elements
    // We are reusing the ones we used in the signup component
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
    
    // This is where we change the formData members accordingly
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    // Profile update process begins and ends here (Not ready yet)
    function handleSubmit(event) {

        // We don't want to be redirected to the home page
        event.preventDefault()

        /* Test Code from Signup component that might be useful for this form as well */

        // fetch(`http://localhost:5000/user/getUsersByUsername/${formData.username}`)
        //     .then((res) => res.json())
        //     .then((data) => setUsers(data.message))
        
        // if(formData.password !== formData.passwordConfirm) {
        //     setMessage("Error, passwords do not match!")
        //     return
        // } else if (users.length !== 0) {
        //     setMessage("Username already taken, choose another")
        //     return
        // } else if ((formData.isTenant === false) && (formData.isLandlord === false)) {
        //     setMessage("Please choose a role in the app")
        //     return
        // }

        // if(formData.isLandlord) {
        //     setFormData(prevFormData => ({
        //         ...prevFormData,
        //         isApproved: false
        //     }))

        //     setIsApprovred(false)
        // }

        // const formDataCopy = formData 

        // const requestOptions = {
        //     method: 'POST',
        //     headers: { 'Content-Type': 'application/json' },
        //     body: JSON.stringify(formDataCopy)
        // }

        // fetch('http://localhost:5000/user/editUser', requestOptions)

        // The user has made changes to their profile, Safety Hazard triggered.
        // We probably need to edit this state to change whenever a change actually happens
        // The submit button can be pressed even if the user has not made changes
        setHasMadeChanges(true)
    }

    return (
        <main className="App-signup-form-container">
        {!hasMadeChanges && <form className="App-signup-form" onSubmit={handleSubmit}>
            {/* Any error will be printed to the user here */}
            {message !== "" && <h3 className="App-signup-form-message">{message}</h3>}
            <h1>Edit your Account!</h1>
            <br />
            <div className="App-signup-form-inputs">
                <div className="App-signup-form-text-inputs">
                    {textInputElements}
                </div>
                <div className="App-signup-form-other-inputs">
                    {/* Profile picture section in the form, not working yet, it is here because of looks */}
                    <div className="App-signup-form-image-container">
                        <h3>Your Profile Picture</h3>
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
                    {/**
                       * Checkboxes to let the user select the desired roles.
                       * The checkboxes that have the roles already selected by the user,
                       * is a good idea to be already selected  
                       */}
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
            {/* In React Submit input can be labeled as button inside forms */}
            <button 
                className="App-signup-form-submit"
            >
                Save Changes
            </button>
        </form>}
        {hasMadeChanges && <SafetyHazard isApproved={isApproved} prevPassword={prevPassword}/>}
    </main>
    )
}