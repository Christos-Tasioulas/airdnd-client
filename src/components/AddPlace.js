import React, { useEffect, useState } from "react";
import './AddPlace.css';
import TextInput from "./TextInput";
import Map from './Map'

export default function AddPlace(props) {

    const [isLandlord, setIsLandlord] = useState(false)
    const [landlordId, setLandlordId] = useState(0)

    useEffect(() => {

        fetch('http://localhost:5000/user/validateToken', {
            method: 'GET',
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

                setIsLandlord(decodeData.isLandlord)
                if(decodeData.isLandlord)
                {
                    setLandlordId(decodeData.id)
                }
                 
            })
            .catch(error => {
                console.error(error);
            })

        })
        .catch(error => {
            console.error(error);
        })

    }, [props.token])

    const [hasGivenLocation, setHasGivenLocation] = useState(false)

    const currentDate = new Date()
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        photos: [],
        houseRules: [],
        minimumLengthStay: "",
        checkIn: currentDate,
        checkOut: currentDate,
        maxGuests: "",
        bedsNumber: "",
        bathroomsNumber: "",
        bedroomsNumber: "",
        squareMeters: "",
        amenities: [],
        spaceType: "",
        additionalPrice: "",
        dailyPrice: "",
        map: "", 
        country: "",
        city: "",
        neighborhood: "",
        transit: [],
        // reviewCount: 0,
        // reviewAvg: 0.0,
        hasLivingRoom: false,
        description: "",
        // isBooked: false,
        // userId: 0
    })

    const locationInputs = [ 
        {id:1, type:"text", placeholder:"Country", className:"App-login-form-input", name:"country", value:formData.country},
        {id:2, type:"text", placeholder:"City", className:"App-login-form-input", name:"city", value:formData.city},
        {id:3, type:"text", placeholder:"Neighborhood", className:"App-login-form-input", name:"neighborhood", value:formData.neighborhood},
        {id:4, type:"text", placeholder:"Address", className:"App-login-form-input", name:"address", value:formData.address}
    ]

    const locationInputElements = locationInputs.map(locationInput => (
            <TextInput
                key={locationInput.id}
                type={locationInput.type}
                placeholder={locationInput.placeholder}
                className={locationInput.className}
                name={locationInput.name}
                value={locationInput.value}
                onChange={(event) => handleChange(event)}
            />
        )
    )

    // This is where we change the formData members accordingly
    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    return(
        <main className="App-add-place-container">
            <form className="App-edit-place-form">
                {isLandlord && !hasGivenLocation && <div className="App-add-location">
                    <div className="App-add-place-inputs">
                        {locationInputElements}
                    </div>
                    <div className="App-add-place-map">
                        <Map />
                    </div>
                    <button className="App-add-place-next">Next</button>
                </div>}
            </form>
        </main>
    )
}