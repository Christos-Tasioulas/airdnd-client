import React, { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import './AddPlace.css';
import './EditPlace.css'
import TextInput from "./TextInput";
import Map from './Map'
import DatePicker from "react-datepicker";
import ListItem from "./ListItem";
import ImageCarousel from "./ImageCarousel";

export default function AddPlace(props) {

    const navigate = useNavigate();
    
    const [isLandlord, setIsLandlord] = useState(false)
    const [landlordId, setLandlordId] = useState(0)
    const [position, setPosition] = useState([37.96820335923963, 23.766779277779243])
    const [message, setMessage] = useState("")

    useEffect(() => {

        fetch('https://127.0.0.1:5000/user/validateToken', {
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
        if(name === "address")
        {
            setLocationQuery(value)
        }
    }

    const [locationQuery, setLocationQuery] = useState("");

    useEffect(() => {

        // Construct the API URL
        const apiUrl = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(locationQuery)}`;
    
        // Make the API request
        fetch(apiUrl)
        .then(response => response.json())
        .then(data => {
            if (data.length > 0) {
                const firstResult = data[0];
                const latitude = parseFloat(firstResult.lat);
                const longitude = parseFloat(firstResult.lon);
                setPosition([latitude, longitude])
            }
        })
        .catch(error => {
            console.error("Error:", error);
        });

    }, [locationQuery])

    function handleNext(event)
    {
        event.preventDefault()

        if(formData.country === "") {
            setMessage("Please Add A Country")
            return
        }
        
        if(formData.city === "") {
            setMessage("Please Add A City")
            return
        }

        if(formData.neighborhood === "") {
            setMessage("Please Add A Neighborhood")
            return
        }

        if(formData.address === "") {
            setMessage("Please Add The Address")
            return
        }

        setMessage("")
        setHasGivenLocation(true)
    }

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

    const textInputs = [
        {id:1, type: 'text', placeholder: 'Name', className: 'App-signup-form-input', name: 'name', value: formData.name},
        {id:2, type: 'text', placeholder: 'Minimum Length Of Stay', className:'App-signup-form-input', name:'minimumLengthStay', value: formData.minimumLengthStay},
        {id:3, type: 'text', placeholder: 'Max Guests', className: 'App-signup-form-input', name: 'maxGuests', value: formData.maxGuests },
        {id:4, type: 'text', placeholder: 'Number Of Beds', className: 'App-signup-form-input', name: 'bedsNumber', value: formData.bedsNumber },
        {id:5, type: 'text', placeholder: 'Number Of Bedrooms', className: 'App-signup-form-input', name: 'bedroomsNumber', value: formData.bedroomsNumber },
        {id:6, type: 'text', placeholder: 'Number Of Bathrooms', className: 'App-signup-form-input', name: 'bathroomsNumber', value: formData.bathroomsNumber },
        {id:7, type: 'text', placeholder: 'Area Of Space (in sq.m.)', className: 'App-signup-form-input', name: 'squareMeters', value: formData.squareMeters},
        {id:8, type: 'text', placeholder: 'Type Of Space', className: 'App-signup-form-input', name: 'spaceType', value: formData.spaceType},
        {id:9, type: 'text', placeholder: 'Daily Price', className: 'App-signup-form-input', name: 'dailyPrice', value: formData.dailyPrice},
        {id:10, type: 'text', placeholder: 'Additional Price Per Person', className: 'App-signup-form-input', name: 'additionalPrice', value: formData.additionalPrice},
    ]

    const dateInputs = [
        { id:11, placeholder: "Check In", name: "checkIn", className: "App-edit-place-check-in-check-out", selected: formData.checkIn, minDate: new Date()},
        { id:12, placeholder: "Check Out", name: "checkOut", className: "App-edit-place-check-in-check-out", selected: formData.checkOut, minDate: formData.checkIn },
    ];
    
    const listInputs = [
        {id:13, type: 'text', placeholder: 'Add Amenity', className: 'App-edit-place-list-input', name: 'amenities', value: newAmenitiesItem, title: 'Amenities', items: amenitiesItems,  elements: amenitiesElements},
        {id:14, type: 'text', placeholder: 'Add House Rule', className: 'App-edit-place-list-input', name: 'houseRules', value: newHouseRulesItem, title: "House Rules", items: houseRulesItems,  elements: houseRulesElements},
        {id:15, type: 'text', placeholder: 'Add Transit', className: 'App-edit-place-list-input', name: 'transit', value: newTransitItem, title: 'Transit', items: transitItems,  elements: transitElements}
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
    
    function handlePrev(event) {
        event.preventDefault()
        
        setHasGivenLocation(false)
    }
    
    function handleSubmit(event) {
        
        event.preventDefault()
        
        if (formData.name === "") {
            setMessage("Please enter a place name");
            return;
        }
        if (formData.minimumLengthStay === "") {
            setMessage("Please enter the minimum length of stay");
            return;
        }
        if (formData.maxGuests === "") {
            setMessage("Please enter the maximum number of guests");
            return;
        }
        if (formData.bedsNumber === "") {
            setMessage("Please enter the number of beds");
            return;
        }
        if (formData.bedroomsNumber === "") {
            setMessage("Please enter the number of bedrooms");
            return;
        }
        if (formData.bathroomsNumber === "") {
            setMessage("Please enter the number of bathrooms");
            return;
        }
        if (formData.squareMeters === "") {
            setMessage("Please enter the area of the place in square meters");
            return;
        }
        if (formData.spaceType === "") {
            setMessage("Please enter the type of the space");
            return;
        }
        if (formData.dailyPrice === "") {
            setMessage("Please enter the daily price");
            return;
        }
        if (formData.additionalPrice === "") {
            setMessage("Please enter the additional price per person");
            return;
        }
        
        if (formData.checkIn === null) {
            setMessage("Please enter a minimum check in date");
            return;
        }

        if (formData.checkOut === null) {
            setMessage("Please enter a maximum check out date");
            return;
        }

        const timeDifference = formData.checkOut - formData.checkIn; // timeDiff is in milliseconds
        const differenceInDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));

        if (differenceInDays < formData.minimumLengthStay) {
            setMessage("Please enter valid available dates")
        }

        const formDataCopy = {
            ...formData,
            amenities: amenitiesItems,
            houseRules: houseRulesItems,
            photos: photoItems,
            transit: transitItems,
            latitude: position[0],
            longtitude: position[1],
            reviewCount: 0,
            reviewAvg: 0.0,
            isBooked: false,
            userId: landlordId
        }

        console.log(formDataCopy)

        
        fetch('https://127.0.0.1:5000/user/validateToken', {
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

                if(decodeData.isLandlord)
                {
                    // The request is a Post request with the copy of the form data object as JSON body
                    const requestOptions = {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(formDataCopy),
                    };
            
                    // Call the API to add the user
                    fetch("https://127.0.0.1:5000/listing/addListing", requestOptions);

                    navigate("/")
                }
                 
            })
            .catch(error => {
                console.error(error);
            })

        })
        .catch(error => {
            console.error(error);
        }) 
    }

    console.log(photoElements)

    return(
        <main className={hasGivenLocation ? "App-edit-place-container" : "App-add-place-container"}>
            <form className="App-edit-place-form">
                {isLandlord && !hasGivenLocation && <div className="App-add-place">
                    <h1>Add The Location Of Your Place!</h1>
                    <div className="App-add-place-inputs">
                        {locationInputElements}
                    </div>
                    <div className="App-add-place-map">
                        <Map position={position}/>
                    </div>
                    <button className="App-add-place-next" onClick={handleNext}>Next</button>
                </div>}
                {isLandlord && hasGivenLocation && <div className="App-add-place">
                    <h1>Add your Place!</h1>
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
                                {photoElements && <ImageCarousel images={photoElements} onImageRemove={handleRemoveItem}/>}
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
                            placeholder='Add description'
                            className='App-edit-place-description-text'
                            name='description'
                            value={formData.description}
                            onChange={handleChange}
                            />
                    </div>
                    <div className='App-edit-place-buttons'>
                        <div className='App-edit-place-buttons-save'>
                            <button onClick={handlePrev}>
                                Prev
                            </button>
                        </div>
                        <div className='App-edit-place-buttons-delete'>
                            <button  onClick={handleSubmit}>
                                Submit
                            </button>
                        </div>
                    </div>
                </div>}
                {message !== "" && <h3 className="App-signup-form-message">{message}</h3>}
            </form>
        </main>
    )
}

// [37.9733483, 23.7266016] Tholou 15 Plaka