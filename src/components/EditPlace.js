import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import TextInput from './TextInput';

import './Signup.css' // We are reusing some css from the signup component
import './Profile.css' // We are reusing some css from the profile component
import './EditPlace.css' // Must be imported last so that overrides are accepted correctly

export default function EditPlace(props) {

    const location = useLocation();
    const { id }= location.state;

    // State variable with the current place
    const [place, setPlace] = useState({})
    const [landlordPlaces, setLandlordPlaces] = useState([])
    const [isTheLandlord, setIsTheLandlord] = useState(false)
    const [theLandlord, setTheLandlord] = useState({})
    const [isVerified, setIsVerified] = useState(false)
    const [transitElements, setTransitElements] = useState(null)

    useEffect(() => {

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
                if (decodeData.isLandlord)
                {
                    fetch(`http://localhost:5000/listing/getPlacesByLandlordId/${decodeData.id}`)
                        .then((response) => response.json())
                        .then((data) => setLandlordPlaces(data.message))
                }

                setIsVerified(true)
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

    // Another Bugfix that returns the landlords data for the verified users
    useEffect(() => {
        if(isVerified) {
            fetch(`http://localhost:5000/listing/getListingById/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPlace(data.message);

                setTransitElements(data.message.transit.map((transit, index) => (
                    <span key={index}>{transit} </span>
                )))
    
                // Now that the place state is updated, fetch the landlord's details
                fetch(`http://localhost:5000/user/getUserById/${data.message.userId}`)
                    .then((response) => response.json())
                    .then((data) => setTheLandlord(data.message))
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            });
        }
        
    }, [id, isVerified]);


    // Bugfix that controls whether the user is the landlord
    useEffect(() => {

        for (const placeItem of landlordPlaces) {
            if (parseInt(placeItem.id) === parseInt(id)) {
                setIsTheLandlord(true);
                break; // No need to continue looping once a match is found
            }
        }

    }, [id, landlordPlaces]);

    const [formData, setFormData] = useState({
        name: "",
        address: "",
        photos: [],
        houseRules: [],
        minimumLengthStay: "",
        checkIn: "",
        checkOut: "",
        maxGuests: "",
        bedsNumber: "",
        bedroomsNumber: "",
        bathroomsNumber: "",
        squareMeters: "",
        amenities: [],
        spaceType: "",
        dailyPrice: "",
        additionalPrice: "",
        transit: [],
        hasLivingRoom: "",
        description: ""
    })

    // Initializing the non text inputs
    useEffect(() => {
        if(place) {
            setFormData(prevFormData => ({
                ...prevFormData,
                photos: place.photos,
                houseRules: place.houseRules,
                checkIn: place.checkIn,
                checkOut: place.checkOut,
                amenities: place.amenities,
                transit: place.transit,
                hasLivingRoom: place.hasLivingRoom
            }))

            console.log(formData)
        }
    }, [place])

    const textInputs = [
        {id:1, type: 'text', placeholder: 'Change Name', className: 'App-signup-form-input', name: 'name', value: formData.name},
        {id:2, type: 'text', placeholder: 'Change Address', className: 'App-signup-form-input', name: 'address', value: formData.address},
        {id:3, type: 'text', placeholder: 'Change Minimum Length Of Stay', className:'App-signup-form-input', name:'minimumLengthStay', value: formData.minmmLengthStay},
        {id:4, type: 'text', placeholder: 'Change Max Guests', className: 'App-signup-form-input', name: 'maxGuests', value: formData.maxGuests},
        {id:5, type: 'text', placeholder: 'Change Number Of Beds', className: 'App-signup-form-input', name: 'bedsNumber', value: formData.bedsNumbe},
        {id:6, type: 'text', placeholder: 'Change Number Of Bedrooms', className: 'App-signup-form-input', name: 'bedroomsNumber', value: formData.bedroomNmber},
        {id:7, type: 'text', placeholder: 'Change Number Of Bathrooms', className: 'App-signup-form-input', name: 'bathroomsNumber', value: formData.btroomsNumber},
        {id:8, type: 'text', placeholder: 'Change Area Of Space (in sq.m.)', className: 'App-signup-form-input', name: 'squareMeters', value: formData.squareMeters},
        {id:9, type: 'text', placeholder: 'Change Type Of Space', className: 'App-signup-form-input', name: 'spaceType', value: formData.spaceType},
        {id:10, type: 'text', placeholder: 'Change The Daily Price', className: 'App-signup-form-input', name: 'dailyPrice', value: formData.dailyPrice},
        {id:11, type: 'text', placeholder: 'Change Additional Price Per Person', className: 'App-signup-form-input', name: 'additionalPrice', value: formData.additionalPrice},
    ]

    // {id:12, type: 'text', placeholder: 'Change Transit Access', className: '', name: 'transit', value:formData.transit}
    // {id:13, type: 'text', placeholder: 'Change ', className: '', name: 'hasLivingRoom',value:}
    // {id:15, type: 'text', placeholder: 'Change ', className: '', name: 'houseRules', value:},
    // {id:16, type: 'text', placeholder: 'Change ', className: '', name: 'amenities', value:},
    // {id:17, type: 'date', placeholder: 'Change ', className: '', name: 'checkIn', value:},
    // {id:18, type: 'date', placeholder: 'Change ', className: '', name: 'checkOut', value:},
    // {id:19, type: 'text', placeholder: 'Change ', className: '', name: 'description', value:},

    // const intInputs = [
    // ]

    const textInputElements = textInputs.map(textInput => (
        <TextInput
            key={textInput.id}
            type={textInput.type}
            placeholder={textInput.placeholder}
            className={textInput.className}
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

    return (
        <main className='App-edit-place-container'>
            <form className="App-signup-form">
                <h1>Edit your Place!</h1>
                <div className="App-signup-form-inputs">
                    <div className="App-signup-form-text-inputs">
                        {textInputElements}
                    </div>
                </div>
            </form>
        </main>
    )
}