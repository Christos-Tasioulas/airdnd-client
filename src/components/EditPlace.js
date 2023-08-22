import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';

import TextInput from './TextInput';
// import ListForm from '../../../trash/trash-app/src/ListForm';
import DatePicker from "react-datepicker";

import './Signup.css' // We are reusing some css from the signup component
import './Profile.css' // We are reusing some css from the profile component
import './EditPlace.css' // Must be imported last so that overrides are accepted correctly

const ListItem = React.memo(({ item, onRemove }) => (
    <li>
        {item}
        <button onClick={onRemove}>Remove</button>
    </li>
));

export default function EditPlace(props) {
    
    // const location = useLocation();
    const { id } = useParams()
    
    const currentDate = new Date();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        photos: [],
        newPhoto: "",
        houseRules: [],
        newHouseRule: "",
        minimumLengthStay: "",
        checkIn: currentDate,
        checkOut: currentDate,
        maxGuests: "",
        bedsNumber: "",
        bedroomsNumber: "",
        bathroomsNumber: "",
        squareMeters: "",
        amenities: [],
        newAmenity: "",
        spaceType: "",
        dailyPrice: "",
        additionalPrice: "",
        transit: [],
        newTransit: "",
        hasLivingRoom: "",
        description: ""
    })

    // State variable with the current place
    const [place, setPlace] = useState({})
    const [landlordPlaces, setLandlordPlaces] = useState([])
    const [isTheLandlord, setIsTheLandlord] = useState(false)
    const [theLandlord, setTheLandlord] = useState({})
    const [isVerified, setIsVerified] = useState(false)
    
    const [amenitiesElements, setAmenitiesElements] = useState(null)
    const [amenitiesItems, setAmenitiesItems] = useState([])
    
    const [houseRulesElements, setHouseRulesElements] = useState(null)
    const [houseRulesItems, setHouseRulesItems] = useState([])

    const [photoElements, setPhotoElements] = useState(null)
    const [photoItems, setPhotoItems] = useState([])

    const [transitElements, setTransitElements] = useState(null)
    const [transitItems, setTransitItems] = useState([])

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

                setAmenitiesItems(data.message.amenities)

                setAmenitiesElements(data.message.amenities.map((amenity, index) => (
                    <ListItem key={index} item={amenity} onRemove={() => handleRemoveItem(formData, "amenities", index)} />
                )))

                setHouseRulesItems(data.message.houseRules)
                
                setHouseRulesElements(data.message.houseRules.map((houseRule, index) => (
                    <ListItem key={index} item={houseRule} onRemove={() => handleRemoveItem(formData, "houseRules", index)} />
                )))
    
                setPhotoItems(data.message.photos)

                setPhotoElements(data.message.photos.map((photo, index) => (
                    <ListItem key={index} item={photo} onRemove={() => handleRemoveItem(formData, "photos", index)}/>
                )))
                
                setTransitItems(data.message.transit)

                setTransitElements(data.message.transit.map((transit, index) => (
                    <ListItem key={index} item={transit} onRemove={() => handleRemoveItem(formData, "transit", index)}/>
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



    // Initializing the non text inputs
    useEffect(() => {
        if(place) {

            setFormData(prevFormData => ({
                ...prevFormData,
                photos: place.photos,
                houseRules: place.houseRules,
                amenities: place.amenities,
                transit: place.transit,
                hasLivingRoom: place.hasLivingRoom
            }))
        }
    }, [place])

    // useEffect(() => {
    //     if(place) {

    //         setFormData(prevFormData => ({
    //             ...prevFormData,
    //             amenities: amenitiesItems,
    //             photos: photoItems,
    //             houseRules: houseRulesItems,
    //             transit: transitItems,
    //         }))
    //     }
    // }, [photoItems, houseRulesItems, amenitiesItems, transitItems])

    function handleAdd(formData, name, value) {
        if (value.trim() !== '') {
            const newName = 'new' + name.charAt(0).toUpperCase() + name.slice(1);
            const formDataCopy = {
                ...formData,
                [name]: [...formData[name], value],
                [newName]: '' 
            }

            setFormData(formDataCopy)
        }
    };

    function handleRemoveItem(formData, name, index) {
        const formDataCopy = {
            ...formData,
            [name]: formData[name].filter((_, i) => i !== index)
        }
        setFormData(formDataCopy);
    };

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

    const dateInputs = [
        { id:12, placeholder: "Check In", name: "checkIn", className: "App-edit-place-check-in-check-out", selected: formData.checkIn, minDate: new Date()},
        { id:13, placeholder: "Check Out", name: "checkOut", className: "App-edit-place-check-in-check-out", selected: formData.checkOut, minDate: formData.checkIn },
    ];
    
    const listInputs = [
        {id:14, type: 'text', placeholder: 'Add Amenity', className: 'App-edit-profile-list-input', name: 'newAmenity', value: formData.newAmenity, title: 'Amenities', elements: amenitiesElements},
        {id:15, type: 'text', placeholder: 'Add House Rule', className: 'App-edit-profile-list-input', name: 'newHouseRules', value: formData.newHouseRule, title: "House Rules", elements: houseRulesElements},
        {id:16, type: 'text', placeholder: 'Add Transit', className: 'App-edit-profile-list-input', name: 'newTransit', value: formData.newTransit, title: 'Transit', elements: transitElements}
    ]

    // {id:13, type: 'text', placeholder: 'Change ', className: '', name: 'hasLivingRoom',value:}
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

    const MyContainer = ({ className, children }) => {
        return (
          <div style={{ padding: "16px", background: "#216ba5", color: "#fff" }}>
            <div className={className}>
              <div style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        );
    };

    const dateElements = dateInputs.map((dateInput) => (
        <div className="date-picker-container">
            <DatePicker
                key={dateInput.id}
                placeholderText={dateInput.placeholder}
                className={dateInput.className}
                selected={dateInput.selected}
                name={dateInput.name}
                dateFormat="dd/MM/yyyy"
                minDate={dateInput.minDate}
                calendarContainer={MyContainer}
                popperPlacement="bottom-start"
                onChange={(date) => handleDateChange(dateInput.name, date)} // Use a separate handler for date changes
            />  
        </div>
    ));

    // Handler for date changes
    function handleDateChange(name, date) {
        setFormData((prevFormData) => ({
            ...prevFormData,
            [name]: date, // Update the selected date
        }));

        console.log(formData)
    }

    const listInputElements = listInputs.map(listInput => (
        <div key={listInput.id} className={listInput.className}>
            <h2>{listInput.title}</h2>
            <div>
                <input
                    type={listInput.type}
                    placeholder={listInput.placeholder}
                    name={listInput.name}
                    value={listInput.value}
                    onChange={(event) => handleChange(event)}
                />
            </div>
            <button onClick={() => handleAdd(formData, listInput.name, listInput.value)}>Add</button>
            <ul>{listInput.elements}</ul>
        </div>
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
            <form className="App-edit-place-form">
                <h1>Edit your Place!</h1>
                <div className="App-signup-form-inputs">
                    <div className="App-edit-place-text-inputs">
                        {textInputElements}
                    </div>
                    <div className="App-signup-form-other-inputs">
                        <div className='App-edit-place-photos'>
                            {/* {photoElements} */}
                        </div>
                        <div className='App-edit-place-date-inputs'>
                            {dateElements}
                        </div>
                        <div className='App-edit-place-checkbox'>
                            <input
                                id="hasLivingRoom"
                                className="App-signup-form-checkbox"
                                type="checkbox"
                                name="hasLivingRoom"
                                onChange={handleChange}
                                checked={formData.hasLivingRoom}
                            />
                            <label htmlFor="hasLivingRoom">Does It Have A Living Room?</label>
                        </div>
                    </div>
                </div>
                <div className='App-edit-place-list-inputs'>
                    {listInputElements}
                </div>
                <div className='App-edit-place-submit'>
                    <button type='submit'>
                        Save
                    </button>
                    <button>
                        Delete
                    </button>
                </div>
            </form>
        </main>
    )
}