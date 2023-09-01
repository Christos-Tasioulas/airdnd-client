import React, { useState, useEffect } from 'react';
import Assurance from './Assurance';
import { useParams, useNavigate } from 'react-router-dom';
import ImageCarousel from "./ImageCarousel";
import TextInput from './TextInput';
// import ListForm from '../../../trash/trash-app/src/ListForm';
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import ListItem from './ListItem';

import './Signup.css' // We are reusing some css from the signup component
import './Profile.css' // We are reusing some css from the profile component
import './EditPlace.css' // Must be imported last so that overrides are accepted correctly

export default function EditPlace(props) {

    const { id } = useParams()
    const navigate = useNavigate();
    
    const currentDate = new Date();
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        minimumLengthStay: "",
        checkIn: currentDate,
        checkOut: currentDate,
        maxGuests: "",
        bedsNumber: "",
        bedroomsNumber: "",
        bathroomsNumber: "",
        squareMeters: "",
        spaceType: "",
        dailyPrice: "",
        additionalPrice: "",
        hasLivingRoom: false,
        description: ""
    })

    // State variable with the current place
    const [place, setPlace] = useState({})
    const [landlordPlaces, setLandlordPlaces] = useState([])
    const [isTheLandlord, setIsTheLandlord] = useState(false)
    const [isVerified, setIsVerified] = useState(false)
    
    const [amenitiesItems, setAmenitiesItems] = useState([])
    const [newAmenitiesItem , setNewAmenitiesItem] = useState("")
    const [amenitiesElements, setAmenitiesElements] = useState(null)
    const [houseRulesItems, setHouseRulesItems] = useState([])
    const [newHouseRulesItem , setNewHouseRulesItem] = useState("")
    const [houseRulesElements, setHouseRulesElements] = useState(null)
    const [photoItems, setPhotoItems] = useState([])
    const [newPhotoItem , setNewPhotoItem] = useState("")
    const [photoElements, setPhotoElements] = useState([])
    const [transitItems, setTransitItems] = useState([])
    const [newTransitItem , setNewTransitItem] = useState("")
    const [transitElements, setTransitElements] = useState(null)

    const [hasMadeChanges, setHasMadeChanges] = useState(false)
    const [wantsToDelete, setWantsToDelete] = useState(false)

    // const [newItemValue, setNewItemValue] = useState("");

    useEffect(() => {

        // Validating and decoding the JSON Web Token
        fetch("https://127.0.0.1:5000/user/validateToken", {
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
            return fetch("https://127.0.0.1:5000/user/decodeToken", {
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
                    fetch(`https://127.0.0.1:5000/listing/getPlacesByLandlordId/${decodeData.id}`)
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
        if(isVerified && isTheLandlord) {
            fetch(`https://127.0.0.1:5000/listing/getListingById/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPlace(data.message);
                // setAmenitiesItems(data.message.amenities)
                // setHouseRulesItems(data.message.houseRules)
                // setPhotoItems(data.message.photos)
                // setTransitItems(data.message.transit)
            })
            .catch((error) => {
                console.log(error);
            });
        }
        
    }, [id, isVerified, isTheLandlord]);


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

            setAmenitiesItems(place.amenities)
            setHouseRulesItems(place.houseRules)
            setPhotoItems(place.photos)
            setTransitItems(place.transit)

            if(place.photos)
            {
                const newPhotoElements = place.photos.map(photoUrl => ({
                    url: photoUrl
                }));
                setPhotoElements(newPhotoElements)
            }
        }
    }, [place])

    useEffect(() => {
        console.log(photoElements)
    }, [photoElements])

    function handleAdd(event, name, value) {
        event.preventDefault(); // prevents re-rendering

        // const { name, value } = event.target
        // console.log(value)
        if (value === null) {

            const { files } = event.target

            if (files.length > 0) {
                const formDataCopy = new FormData(); // Create a FormData object to send the file

                const file = files[0]; // Get the first file from the list
                formDataCopy.append("image", file); // Append the file to the FormData object

                // Make the POST request to upload the file
                const requestOptions = {
                    method: "POST",
                    body: formDataCopy, // Send the FormData object with the file
                };

                fetch("https://127.0.0.1:5000/upload", requestOptions)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error("Image upload failed");
                        }
                        return response.json(); // Assuming your server returns some JSON response
                    })
                    .then(data => {
                        const imagePath = "https://127.0.0.1:5000/" + data.filename
                        setNewPhotoItem(imagePath)
                        setPhotoItems([...photoItems, imagePath])
                        const photoElement = {
                            url: imagePath
                        }
                        setPhotoElements([...photoElements, photoElement])
                    })
                    .catch(error => {
                        console.error("Image upload error:", error);
                    });
            }
        }
        else if (value.trim() !== '') {
            if (name === 'amenities') {
                setAmenitiesItems([...amenitiesItems, newAmenitiesItem])
                setNewAmenitiesItem('')
            }
            else if (name === 'houseRules') {
                setHouseRulesItems([...houseRulesItems, newHouseRulesItem])
                setNewHouseRulesItem('')
            }
            else if (name === 'transit') {
                setTransitItems([...transitItems, newTransitItem])
                setNewTransitItem('')
            }
        }
    };

    function handleRemoveItem(event, name, index) {

        event.preventDefault(); // prevents re-rendering

        if (name === 'amenities') {
            const updatedItems = amenitiesItems.filter((_, i) => i !== index);
            setAmenitiesItems(updatedItems)
        }
        else if (name === 'houseRules') {
            const updatedItems = houseRulesItems.filter((_, i) => i !== index);
            setHouseRulesItems(updatedItems)
        }
        else if (name === 'transit') {
            const updatedItems = transitItems.filter((_, i) => i !== index);
            setTransitItems(updatedItems)
        }
        else if (name === 'photos') {
            const updatedItems = photoItems.filter((_, i) => i !== index);
            setPhotoItems(updatedItems)
            const updatedElements = photoElements.filter((_, i) => i !== index);
            setPhotoElements(updatedElements)
        }
    };

    const textInputs = [
        {id:1, type: 'text', placeholder: 'Change Name', className: 'App-signup-form-input', name: 'name', value: formData.name},
        {id:2, type: 'text', placeholder: 'Change Address', className: 'App-signup-form-input', name: 'address', value: formData.address},
        {id:3, type: 'text', placeholder: 'Change Minimum Length Of Stay', className:'App-signup-form-input', name:'minimumLengthStay', value: formData.minimumLengthStay},
        {id:4, type: 'text', placeholder: 'Change Max Guests', className: 'App-signup-form-input', name: 'maxGuests', value: formData.maxGuests },
        {id:5, type: 'text', placeholder: 'Change Number Of Beds', className: 'App-signup-form-input', name: 'bedsNumber', value: formData.bedsNumber },
        {id:6, type: 'text', placeholder: 'Change Number Of Bedrooms', className: 'App-signup-form-input', name: 'bedroomsNumber', value: formData.bedroomsNumber },
        {id:7, type: 'text', placeholder: 'Change Number Of Bathrooms', className: 'App-signup-form-input', name: 'bathroomsNumber', value: formData.bathroomsNumber },
        {id:8, type: 'text', placeholder: 'Change Area Of Space (in sq.m.)', className: 'App-signup-form-input', name: 'squareMeters', value: formData.squareMeters},
        {id:9, type: 'text', placeholder: 'Change Type Of Space', className: 'App-signup-form-input', name: 'spaceType', value: formData.spaceType},
        {id:10, type: 'text', placeholder: 'Change The Daily Price', className: 'App-signup-form-input', name: 'dailyPrice', value: formData.dailyPrice},
        {id:11, type: 'text', placeholder: 'Change Additional Price Per Person', className: 'App-signup-form-input', name: 'additionalPrice', value: formData.additionalPrice},
    ]

    const dateInputs = [
        { id:12, placeholder: "Check In", name: "checkIn", className: "App-edit-place-check-in-check-out", selected: formData.checkIn, minDate: new Date(), title: "Availiable From:"},
        { id:13, placeholder: "Check Out", name: "checkOut", className: "App-edit-place-check-in-check-out", selected: formData.checkOut, minDate: formData.checkIn, title: "Up Until:"},
    ];
    
    const listInputs = [
        {id:14, type: 'text', placeholder: 'Add Amenity', className: 'App-edit-place-list-input', name: 'amenities', value: newAmenitiesItem, title: 'Amenities', items: amenitiesItems,  elements: amenitiesElements},
        {id:15, type: 'text', placeholder: 'Add House Rule', className: 'App-edit-place-list-input', name: 'houseRules', value: newHouseRulesItem, title: "House Rules", items: houseRulesItems,  elements: houseRulesElements},
        {id:16, type: 'text', placeholder: 'Add Transit', className: 'App-edit-place-list-input', name: 'transit', value: newTransitItem, title: 'Transit', items: transitItems,  elements: transitElements}
    ]

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
          <div style={{ padding: "16px", background: "#ff585d", color: "#fff" }}>
            <div className={className}>
              <div style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        );
    };

    const dateElements = dateInputs.map((dateInput) => (
        <div className="date-picker-container">
            <h3>{dateInput.title}</h3>
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
    }

    useEffect(() => {

        if (amenitiesItems) {
            
            const updatedAmenitiesElements = amenitiesItems.map((item, index) => (
                <ListItem key={index} item={item} onRemove={(event) => handleRemoveItem(event, "amenities", index)} />
            ))
            setAmenitiesElements(updatedAmenitiesElements)
        }
            
        if (houseRulesItems) {
            const updatedHouseRulesElements = houseRulesItems.map((item, index) => (
                <ListItem key={index} item={item} onRemove={(event) => handleRemoveItem(event, "houseRules", index)} />
            ))
            setHouseRulesElements(updatedHouseRulesElements)
        }
                    
        if (transitItems) {
            const updatedTransitElements = transitItems.map((item, index) => (
                <ListItem key={index} item={item} onRemove={(event) => handleRemoveItem(event, "transit", index)} />
            ))
            setTransitElements(updatedTransitElements)
        }
            
    }, [amenitiesItems, transitItems, houseRulesItems])

    const listInputElements = listInputs.map(listInput => (
        <div key={listInput.id} className={listInput.className}>
            <h2>{listInput.title}</h2>
            <div>
                <input
                    type={listInput.type}
                    placeholder={listInput.placeholder}
                    name={listInput.name}
                    value={listInput.value}
                    onChange={(event) => handleListInputChange(listInput.name, event.target.value)}
                />
            </div>
            <button className='App-edit-place-list-input-add' onClick={(event) => handleAdd(event, listInput.name, listInput.value)}>Add</button>
            <ul>
                {listInput.elements}
            </ul>
        </div>
    ))
    
    // Create a handler for the list input change
    function handleListInputChange(name, value) {
        if (name === 'amenities') {
            setNewAmenitiesItem(value);
        } else if (name === 'houseRules') {
            setNewHouseRulesItem(value);
        } else if (name === 'transit') {
            setNewTransitItem(value);
        }
    }

    function handleChange(event) {
        const {name, value, type, checked} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    async function handleSave(event) {

        event.preventDefault()

        // let hasMadeChanges = false

        const updateData = {
            ...formData,
            amenities: amenitiesItems,
            houseRules: houseRulesItems,
            transit: transitItems,
            photos: photoItems
        }

        console.log(updateData)
        
        if(updateData.name !== "" && updateData.name !== place.name)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                name: updateData.name
            }))
        }

        if(updateData.address !== "" && updateData.address !== place.address)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                address: updateData.address
            }))
        }

        if(updateData.minimumLengthStay !== "" && updateData.minimumLengthStay !== place.minimumLengthStay)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                minimumLengthStay: updateData.minimumLengthStay
            }))
        }

        if(updateData.maxGuests !== "" && updateData.maxGuests !== place.maxGuests)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                maxGuests: updateData.maxGuests
            }))
        }

        if(updateData.bedsNumber !== "" && updateData.bedsNumber !== place.bedsNumber)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                bedsNumber: updateData.bedsNumber
            }))
        }

        if(updateData.bedroomsNumber !== "" && updateData.bedroomsNumber !== place.bedroomsNumber)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                bedroomsNumber: updateData.bedroomsNumber
            }))
        }

        if(updateData.bathroomsNumber !== "" && updateData.bathroomsNumber !== place.bathroomsNumber)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                bathroomsNumber: updateData.bathroomsNumber
            }))
        }

        if(updateData.squareMeters !== "" && updateData.squareMeters !== place.squareMeters)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                squareMeters: updateData.squareMeters
            }))
        }

        if(updateData.spaceType !== "" && updateData.spaceType !== place.spaceType)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                spaceType: updateData.spaceType
            }))
        }

        if(updateData.dailyPrice !== "" && updateData.dailyPrice !== place.dailyPrice)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                dailyPrice: updateData.dailyPrice
            }))
        }
        
        if(updateData.additionalPrice !== "" && updateData.additionalPrice !== place.additionalPrice)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                additionalPrice: updateData.additionalPrice
            }))
        }

        if(updateData.amenities !== place.amenities)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                amenities: updateData.amenities
            }))
        }

        if(updateData.houseRules !== place.houseRules)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                houseRules: updateData.houseRules
            }))
        }

        if(updateData.transit !== place.transit)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                transit: updateData.transit
            }))
        }

        if(updateData.photos !== place.photos)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                photos: updateData.photos
            }))
        }

        if(updateData.hasLivingRoom !== place.hasLivingRoom)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                hasLivingRoom: updateData.hasLivingRoom
            }))
        }
        
        if(updateData.description !== "" && updateData.description !== place.description)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                description: updateData.description
            }))
        }

        if(updateData.checkIn !== currentDate || updateData.checkOut !== currentDate)
        {
            setHasMadeChanges(true)
            setPlace(prevPlace => ({
                ...prevPlace,
                checkIn: updateData.checkIn,
                checkOut: updateData.checkOut
            }))
        }
        
        console.log(updateData)
    }

    useEffect(() => {

        if(hasMadeChanges){

            const placeCopy = {...place}
            
            placeCopy.minimumLengthStay = parseInt(place.minimumLengthStay)
            placeCopy.bedsNumber = parseInt(place.bedsNumber)
            placeCopy.bedroomsNumber = parseInt(place.bedroomsNumber)
            placeCopy.bathroomsNumber = parseFloat(place.bathroomsNumber)
            placeCopy.squareMeters = parseFloat(place.squareMeters)
            placeCopy.dailyPrice = parseInt(place.dailyPrice)
            placeCopy.additionalPrice = parseInt(place.additionalPrice)
            placeCopy.checkIn = dayjs(place.checkIn).format("YYYY/MM/DD")
            placeCopy.checkOut = dayjs(place.checkOut).format("YYYY/MM/DD")

            fetch("https://127.0.0.1:5000/user/validateToken", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${props.token}`
                }
            }).then((response) => {

                if (!response.ok) {
                    throw new Error("Token validation failed");
                }

                return response.json()

            }).then((data) => {
                const placeOptions = {
                    method: "PUT",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(placeCopy),
                }
    
                console.log(placeCopy)
                fetch("https://127.0.0.1:5000/listing/updateListing", placeOptions)
                
                navigate("/")
            });
        }

    }, [hasMadeChanges])

    function handleDelete(event)
    {
        event.preventDefault()

        setWantsToDelete(true)

        window.scrollTo({top: 0, left: 0, behavior: 'smooth'});
    }

    function handleNo(event)
    {
        event.preventDefault()

        setWantsToDelete(false)
    }

    function handleYes(event)
    {
        event.preventDefault()

        fetch("https://127.0.0.1:5000/user/validateToken", {
            method: "GET",
            headers: {
                "Authorization": `Bearer ${props.token}`
            }
        }).then((response) => {

            if (!response.ok) {
                throw new Error("Token validation failed");
            }

            return response.json()

        }).then((data) => {
            const placeOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }

            fetch(`https://127.0.0.1:5000/listing/deleteListing/${id}`, placeOptions)
            
            navigate("/")
        });

    }

    return (
        <main className='App-edit-place-container'>
            {!wantsToDelete && <form className="App-edit-place-form">
                <h1>Edit your Place!</h1>
                <div className="App-signup-form-inputs">
                    <div className="App-edit-place-text-inputs">
                        {textInputElements}
                    </div>
                    <div className="App-signup-form-other-inputs">
                        <div className='App-edit-place-photos'>
                            <h3>Add Photo</h3>
                            <div className="App-add-place-image">
                                <input
                                    id="PlacePhotos"
                                    type="file"
                                    multiple
                                    className="App-add-place-image-uploader"
                                    name="image"
                                    onChange={(event) => handleAdd(event, "image", null)}
                                    accept="image/png, image/jpeg, image/jpg"
                                />
                            </div>
                            {photoElements && <ImageCarousel isTheLandlord={true} images={photoElements} onImageRemove={handleRemoveItem}/>}
                        </div>
                        <div className='App-edit-place-date-inputs'>
                            {dateElements}
                        </div>
                        <br />
                        <div className='App-edit-place-checkbox'>
                            <input
                                id="hasLivingRoom"
                                className="App-signup-form-checkbox"
                                type="checkbox"
                                name="hasLivingRoom"
                                onChange={handleChange}
                                checked={formData.hasLivingRoom}
                            />
                            <div className='App-edit-place-checkbox-text'>
                                <label htmlFor="hasLivingRoom">Living Room</label>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='App-edit-place-list-inputs'>
                    {listInputElements}
                </div>
                <div className='App-edit-place-description'>
                    <textarea
                        placeholder='Change description'
                        className='App-edit-place-description-text'
                        name='description'
                        value={formData.description}
                        onChange={handleChange}
                    />
                </div>
                <div className='App-edit-place-buttons'>
                    <div className='App-edit-place-buttons-save'>
                        <button onClick={handleSave}>
                            Save
                        </button>
                    </div>
                    <div className='App-edit-place-buttons-delete'>
                        {/* <button > */}
                        <button onClick={handleDelete}>
                            Delete
                        </button>
                    </div>
                </div>
            </form>}
            <br /><br /><br />
            { wantsToDelete && <Assurance title="Are you sure you want to delete the place?" className="App-edit-place-destroy-buttons-form" onYes={handleYes} onNo={handleNo}/>}
        </main>
    )
}