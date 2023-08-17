import React, {useState, useEffect} from 'react';
import AdminHome from './AdminHome';
import './Home.css';
import TextInput from './TextInput';

export default function Home(props) {

    const [isAdmin, setIsAdmin] = useState(false) 
    const [isLandlord, setIsLandlord] = useState(false)
    const [isTenant, setIsTenant] = useState(false)
    const [isAnonymous, setIsAnonymous] = useState(true)

    useEffect(() => {

        if(!props.token) {
            return
        }

        // Validating and decoding the JSON Web Token
        fetch("http://localhost:5000/user/validateToken", {
            method: "GET",
            headers: {
            "Authorization": `Bearer ${props.token}`
            }
        })
        .then(response => {
            if (!response.ok) {
            throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(validationData => {

            // Token validation succeeded, now decode the token to check if the user is an admin
            return fetch("http://localhost:5000/user/decodeToken", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
            })
            .then(decodeResponse => {
            if (!decodeResponse.ok) {
                throw new Error("Token decoding failed");
            }
            return decodeResponse.json();
            })
            .then(decodeData => {
                // Passing the information for the role of the user
                setIsAdmin(decodeData.isAdmin);
                setIsLandlord(decodeData.isLandlord);
                setIsTenant(decodeData.isTenant);
                setIsAnonymous(false)
            })
            .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
            });

        })
        .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
        });

    }, [props.token]) 

    const [formData, setFormData] = useState({
        neighborhood: "",
        city: "",
        country: "",
        checkInDate: "",
        checkOutDate: "",
        numPeople: "",
    })

    // Only the home page for the admin is ready now
    const locationInputs = [
        { id:1, type: "text", placeholder: "Country", className: "App-home-form-location-input", name: "country", value: formData.country},
        { id:2, type: "text", placeholder: "City", className: "App-home-form-location-input", name: "city", value: formData.city},
        { id:3, type: "text", placeholder: "Neighborhood", className: "App-home-form-location-input", name: "neighborhood", value: formData.neighborhood}
    ]

    const dateInputs = [
        { id:4, type: "date", placeholder: "Check In", className:"App-home-form-date-input", name: "checkIn", value: formData.checkInDate},
        { id:5, type: "date", placeholder: "Check Out", className: "App-home-form-date-input", name: "checkOut", value: formData.checkOutDate},
    ]

    const textInputs = [
        { id:6, type: "text", placeholder: "Number Of Guests", className: "App-home-form-text-input", name: "numPeople", value: formData.numPeople},
    ]

    const locationElements = locationInputs.map(locationInput => (
        <TextInput
            key={locationInput.id}
            type={locationInput.type}
            placeholder={locationInput.placeholder}
            className={locationInput.className}
            name={locationInput.name}
            value={locationInput.value}
            onChange={(event) => handleChange(event)}
        />
    ));
    
    const dateElements = dateInputs.map(dateInput => (
        <TextInput 
            key={dateInput.id}
            type={dateInput.type}
            placeholder={dateInput.placeholder}
            className={dateInput.className}
            name={dateInput.name}
            value={dateInput.value}
            onChange={(event) => handleChange(event)}
        />
    ));
    
    const textElements = textInputs.map(textInput => (
        <TextInput 
            key={textInput.id}
            type={textInput.type}
            placeholder={textInput.placeholder}
            className={textInput.className}
            name={textInput.name}
            value={textInput.value}
            onChange={(event) => handleChange(event)}
        />
    ));    

    // This is where we change the formData members accordingly
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    console.log(formData)
    
    return(
        <main className='App-home'>
            {isAdmin && <AdminHome token={props.token}/>}
            {!isAdmin && (isTenant || isAnonymous) && <form className='App-home-form'>
                <div className='App-home-form-details'>
                    <div className='App-home-form-location'>
                        <h2>Location</h2>
                        <div className='App-home-form-location-inputs'>
                            {locationElements}
                        </div> 
                    </div>
                    <div className='App-home-form-date'>
                        <h2>Check In/Out Dates</h2>
                        <div className='App-home-form-date-inputs'>
                            {dateElements}
                        </div>
                    </div>
                    <div className='App-home-form-text'>
                        <h2>Number Of Guests</h2>
                        <div className='App-home-form-text-inputs'>
                            {textElements}
                        </div>
                    </div>
                </div>
                <div className='App-home-form-submit'></div>
            </form>}
        </main>
    )
}