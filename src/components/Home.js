import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHome from './AdminHome';
import "react-datepicker/dist/react-datepicker.css";
import 'rc-slider/assets/index.css';
import Slider from 'rc-slider';
import './Home.css';
import TextInput from './TextInput';
import DatePicker from "react-datepicker";
import dayjs from "dayjs";
import LandlordHome from "./LandlordHome";
import PaginatedGrid from './PaginatedGrid';
import Card from './Card';

export default function Home(props) {
    
    // Token results
    const [isAdmin, setIsAdmin] = useState(false) 
    const [isLandlord, setIsLandlord] = useState(false)
    const [isTenant, setIsTenant] = useState(false)
    const [isAnonymous, setIsAnonymous] = useState(true) // user starts as anonymous
    const [userId, setUserId] = useState(0) 
    
    // States depending on user actions
    const [hasSearched, setHasSearched] = useState(false)
    const [hasSearchedOnce, setHasSearchedOnce] = useState(false)
    const [hasAddedFilters, setHasAddedFilters] = useState(false)
    const [searchResults, setSearchResults] = useState([])
    const [showLandlordHome, setShowLandlordHome] = useState(false)
    
    // States storing data
    const [spaceTypeOptions, setSpaceTypeOptions] = useState([])
    const navigate = useNavigate();
    const [maxPrice, setMaxPrice] = useState(0)
    const [priceRange, setPriceRange] = useState([]);
    const [recommendedPlaces, setRecommendedPlaces] = useState([]);


    useEffect(() => {

        // Getting all unique space types from the database
        fetch('https://127.0.0.1:5000/listing/getAllUniqueSpaceTypes', {
            method: 'GET'
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("SpaceTypes Not Found");
            }
            return response.json();
        })
        .then(data => {
            setSpaceTypeOptions(data.message);
        })
        .catch(error => {
            console.error(error);
        });

        // Getting the maximum daily price from the database
        fetch('https://127.0.0.1:5000/listing/getMaxDailyPrice', {
            method: 'GET'
        })
        .then(response=> {
            if (!response.ok) {
                throw new Error("Max daily price Not Found");
            }
            return response.json();
        })
        .then(data => {
            setMaxPrice(data.message);
            setPriceRange([0, data.message])
        })
        .catch(error => {
            console.error(error);
        });

    }, []);

    useEffect(() => {

        if(!props.token) {
            return
        }

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

            // Token validation succeeded, now decode the token to check the role of the user
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
                setIsAdmin(decodeData.isAdmin);
                setIsLandlord(decodeData.isLandlord);
                setIsTenant(decodeData.isTenant);
                setIsAnonymous(false)

                // Getting the id of the user
                setUserId(decodeData.id)

                return fetch(`https://127.0.0.1:5000/user/recommend/${decodeData.id}`)
                .then(recommendRes => {
                    if(!recommendRes.ok) {
                        throw new Error('Error at recommendation')
                    }

                    return recommendRes.json()
                })
                .then(recommendData => {
                    setRecommendedPlaces(recommendData.message)
                })

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

    const currentDate = new Date();

    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     * Notice that the fields are assigned to values as if a user is not registered.
     * That's because we need the authentication to work properly first to assign the values properly
     */
    const [formData, setFormData] = useState({
        neighborhood: "",
        city: "",
        country: "",
        checkInDate: currentDate,
        checkOutDate: currentDate,
        numPeople: "",
    })

    /**
     * Similar to formData but handles everything about the filter section
     */
    const [filterData, setFilterData] = useState({
        spaceType: "",
        hasSetAmenities: false,
        hasFreeWifi: false,
        hasCoolingSystem: false,
        hasHeatingSystem: false,
        hasKitchen: false,
        hasTV: false,
        hasParking: false,
        hasElevator: false
    })

    // Location Inputs of the search form
    const locationInputs = [
        { id:1, type: "text", placeholder: "Country", className: "App-home-form-location-input", name: "country", value: formData.country},
        { id:2, type: "text", placeholder: "City", className: "App-home-form-location-input", name: "city", value: formData.city},
        { id:3, type: "text", placeholder: "Neighborhood", className: "App-home-form-location-input", name: "neighborhood", value: formData.neighborhood}
    ]

    // Date Inputs of the search form
    const dateInputs = [
        { id: 4, placeholder: "Check In", name: "checkInDate", className: "App-home-form-date-input", selected: formData.checkInDate, minDate: new Date()},
        { id: 5, placeholder: "Check Out", name: "checkOutDate", className: "App-home-form-date-input", selected: formData.checkOutDate, minDate: formData.checkInDate },
    ];

    // Text Input of the search form
    const textInputs = [
        { id:6, type: "text", placeholder: "Number Of Guests", className: "App-home-form-text-input", name: "numPeople", value: formData.numPeople},
    ]

    // Input Elements as HTML
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
    
    // Calendar container
    const MyContainer = ({ className, children }) => {
        return (
          <div style={{ padding: "16px", background: "#ff585d", color: "#fff" }}>
            <div className={className}>
              <div style={{ position: "relative" }}>{children}</div>
            </div>
          </div>
        );
    };

    // DatePickers in HTML
    const dateElements = dateInputs.map((dateInput) => (
        <DatePicker
            key={dateInput.id}
            placeholderText={dateInput.placeholder}
            className={dateInput.className}
            selected={dateInput.selected}
            name={dateInput.name}
            dateFormat="dd/MM/yyyy"
            minDate={dateInput.minDate}
            calendarContainer={MyContainer}
            onChange={(date) => handleDateChange(dateInput.name, date)} // Use a separate handler for date changes
        />
    ));

    // Handler for date changes
    function handleDateChange(name, date) {
        setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: date, // Update the selected date
        }));
    }
        
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
        const {name, value, type, selected} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: type === "date" ? selected : value
        }))
    }

    function handleSubmit(event) {
        
        event.preventDefault();

        // Update the hasSearched state for each condition
        setHasSearched(
            formData.city !== "" ||
            formData.country !== "" ||
            formData.neighborhood !== "" ||
            formData.checkInDate !== null ||
            formData.checkOutDate !== null ||
            formData.numPeople !== ""
        );

        // Update the hasSearched state for each condition
        setHasSearchedOnce(
            formData.city !== "" ||
            formData.country !== "" ||
            formData.neighborhood !== "" ||
            formData.checkInDate !== null ||
            formData.checkOutDate !== null ||
            formData.numPeople !== ""
        );

        // Adding the user search of the existing user in the database
        if(
            formData.city !== "" ||
            formData.country !== "" ||
            formData.neighborhood !== "" ||
            formData.checkInDate !== null ||
            formData.checkOutDate !== null ||
            formData.numPeople !== ""
        ) {

            if(isTenant) {
                const formDataCopy = {...formData}
                
                formDataCopy.userId = userId
                formDataCopy.checkInDate = dayjs(formDataCopy.checkInDate).format("YYYY/MM/DD") // converting the dates to yyyy/mm/dd
                formDataCopy.checkOutDate = dayjs(formDataCopy.checkOutDate).format("YYYY/MM/DD") 

                const requestOptions = {
                    method: 'POST',
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(formDataCopy)
                }

                fetch("https://127.0.0.1:5000/userSearch/addUserSearch", requestOptions)
            }
        }
    }

    // Helper function for the amenities filters
    function convertToHumanReadable(inputString) {
        // Split the input string by capital letters
        const words = inputString.split(/(?=[A-Z])/);
    
        // Convert each word to lowercase and capitalize the first letter
        const formattedWords = words.map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase());
    
        // Remove the first word if it starts with "Has"
        if (formattedWords[0] === "Has") {
            formattedWords.shift();
        }
    
        // Join the words to form the human-readable string
        const humanReadableString = formattedWords.join(' ');
    
        return humanReadableString;
    }

    // Helper function for the amenities filters
    function removeSpaces(inputString) {
        // Remove all spaces from the input string
        const stringWithoutSpaces = inputString.replace(/\s+/g, '');
    
        return stringWithoutSpaces;
    }

    // Bugfix so that the search button works at the first search submission
    // Use the useEffect hook to trigger the search when hasSearched changes
    useEffect(() => {
        if (hasSearched) {
            // Construct the URL and perform the search
            const formDataCopy = { ...formData };

            const filterDataCopy = {...filterData}

            filterDataCopy.minPrice = priceRange[0]
            filterDataCopy.maxPrice = priceRange[1]
    
            // Checking if user has set amenities in the filter
            filterDataCopy.hasSetAmenities = filterDataCopy.hasFreeWifi ||
                                            filterDataCopy.hasCoolingSystem ||
                                            filterDataCopy.hasHeatingSystem ||
                                            filterDataCopy.hasKitchen ||
                                            filterDataCopy.hasTV ||
                                            filterDataCopy.hasParking ||
                                            filterDataCopy.hasElevator

            // Constructing the URL
            const searchParams = new URLSearchParams();

            // converting the dates to yyyy/mm/dd
            formDataCopy.checkInDate = dayjs(formDataCopy.checkInDate).format("YYYY/MM/DD")
            formDataCopy.checkOutDate = dayjs(formDataCopy.checkOutDate).format("YYYY/MM/DD")

            // appending non empty search params in the url
            for (const key in formDataCopy) {
                if (formDataCopy.hasOwnProperty(key) && (formDataCopy[key] !== "" && formDataCopy[key] !== "Invalid Date")) {
                    searchParams.append(key, formDataCopy[key]);  
                }
            }

            // case user has added filters
            if(hasAddedFilters) {

                // storing the amenities query in this variable
                let amenitiesQuery = ""

                // appending non empty search params in the url
                for (const key in filterDataCopy) {
                    if (filterDataCopy.hasOwnProperty(key) && (filterDataCopy[key] !== "" && filterDataCopy[key] !== undefined)) {
                        if(key === "spaceType") {
                            searchParams.append(key, filterDataCopy[key]);
                        }
                        else if(key === "minPrice" || key === "maxPrice") {
                            searchParams.append(key, filterDataCopy[key] + "");
                        }
                        else if(key !== "hasSetAmenities")  {
                            if(filterDataCopy[key] === true) {
                                // using the functions to convert the filter texts to url ready queries for the amenities search
                                let humanReadable = convertToHumanReadable(key)
                                // TV is returned as T V so we need to merge the letters
                                if(humanReadable === "T V") {
                                    humanReadable = removeSpaces(humanReadable)
                                }
                                // each amenity is split by comma
                                amenitiesQuery += humanReadable + ","
                            }
                        }
                    }
                }

                // append amenities in the url
                if (filterDataCopy.hasSetAmenities) {
                    searchParams.append("amenities", amenitiesQuery)
                }
            }

            // Perform the search
            const url = `https://127.0.0.1:5000/listing/searchListings?${searchParams.toString()}`;
            console.log(url)

            const searchOptions = {
                method: 'GET',
            };

            fetch(url, searchOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Search failed");
                    }
                    return response.json();
                })
                .then((data) => {
                    setSearchResults(data.results);
                })
                .catch(error => {
                    console.error("Error:", error);
                });
        }

        // Bugfix so that search works continuously
        setHasSearched(false)
    }, [hasSearched]);

    // Results and recommendations are both cards
    const resultElements = searchResults.map((searchResult) => (
        <Card
            checkInDate={formData.checkInDate}
            checkOutDate={formData.checkOutDate}
            numPeople={formData.numPeople}
            key={searchResult.id}
            {...searchResult} 
        />
    ))

    const recommendedPlacesElements = recommendedPlaces.map((recommendedPlace) => (
        <Card
            checkInDate={formData.checkInDate}
            checkOutDate={formData.checkOutDate}
            numPeople={formData.numPeople}
            key={recommendedPlace.id}
            {...recommendedPlace} 
        />
    ))

    // Changes the home page accordingly
    function handleRoleChange() {
        setShowLandlordHome(!showLandlordHome)
    }

    // shows each spaceType option in the dropdown
    const spaceTypeOptionElements = spaceTypeOptions.map((option, index) => (
        <option key={index} value={option}>
            {option}
        </option>
    ))

    // handles any changes in the filter data
    function handleFilterChange(event) {
        const {name, value, type, checked} = event.target
        setFilterData(prevFilterData => ({
            ...prevFilterData,
            [name]: type === "checkbox" ? checked : value
        }))
    }

    // changes price range
    const handlePriceChange = (values) => {
        setPriceRange(values);
    };

    // All checkbox inputs in the filter
    const checkboxes = [
        {id:1, label:"Free Wifi", name: "hasFreeWifi", value: filterData.hasFreeWifi},
        {id:2, label:"Cooling System", name: "hasCoolingSystem", value: filterData.hasCoolingSystem},
        {id:3, label:"Heating System", name: "hasHeatingSystem", value: filterData.hasHeatingSystem},
        {id:4, label:"Kitchen", name: "hasKitchen", value: filterData.hasKitchen},
        {id:5, label:"TV", name: "hasTV", value: filterData.hasTV},
        {id:6, label:"Parking", name: "hasParking", value: filterData.hasParking},
        {id:7, label:"Elevator", name: "hasElevator", value: filterData.hasElevator}
    ]

    const checkboxElements = checkboxes.map(checkbox => (
        <div key={checkbox.id} className='App-tenant-home-filter-checkbox'>
            <input
                id={checkbox.id}
                type="checkbox"
                name={checkbox.name}
                checked={checkbox.value}
                onChange={handleFilterChange} 
            />
            <label htmlFor={checkbox.id}>{checkbox.label}</label>
        </div>
    ))

    // handles filter removal in searches
    function handleRemoveAll(event) {
        event.preventDefault()

        setFilterData({
            spaceType: "",
            hasSetAmenities: false,
            hasFreeWifi: false,
            hasCoolingSystem: false,
            hasHeatingSystem: false,
            hasKitchen: false,
            hasTV: false,
            hasParking: false,
            hasElevator: false
        })

        setPriceRange([0, maxPrice])
    }

    // handles filter addition in searches
    function handleApply(event) {
        event.preventDefault()
        setHasAddedFilters(true)

        // Update the hasSearched state for each condition
        setHasSearched(
            formData.city !== "" ||
            formData.country !== "" ||
            formData.neighborhood !== "" ||
            formData.checkInDate !== null ||
            formData.checkOutDate !== null ||
            formData.numPeople !== ""
        );

        // Update the hasSearched state for each condition
        setHasSearchedOnce(
            formData.city !== "" ||
            formData.country !== "" ||
            formData.neighborhood !== "" ||
            formData.checkInDate !== null ||
            formData.checkOutDate !== null ||
            formData.numPeople !== ""
        );
    }

    return(
        <main className='App-home'>
            {/* renders different home page for each role. Admin Home is a separate component and so is Landlord Home. Anonymous users have the default home page (Tenant Home). */}
            {isAdmin && <AdminHome token={props.token}/>}
            {/* Button that redirects tenant-landlord users to the tenant home page */}
            {!isAdmin && isLandlord && isTenant && showLandlordHome && <button className='App-role-button-2' onClick={handleRoleChange}>Show Tenant</button>}
            {!isAdmin && (isTenant || isAnonymous) && !showLandlordHome && <div className='App-tenant-home'>
                <div className='App-tenant-home-container'>
                    <div className='App-tenant-home-left'>
                        <form onSubmit={handleSubmit} className='App-home-form'>
                            <div className='App-home-form-details'>
                                {/* Search is divided in 3 sections: Location, Check In/Check Out Dates, Num People */}
                                <div className='App-home-form-location'>
                                    <h3>Location</h3>
                                    <div className='App-home-form-location-inputs'>
                                        {locationElements}
                                    </div> 
                                </div>
                                <div className='App-home-form-date'>
                                    <h3>Check In/Out Dates</h3>
                                    <div className='App-home-form-date-inputs'>
                                        {dateElements}
                                    </div>
                                </div>
                                <div className='App-home-form-other'>
                                    <div className='App-home-form-text'>
                                        <h3>Number Of Guests</h3>
                                        <div className='App-home-form-text-inputs'>
                                            {textElements}
                                        </div> 
                                    </div>
                                    <div className='App-home-form-submit-container'>
                                        <button className='App-home-form-submit-button'>Search</button>
                                    </div>
                                </div>           
                            </div>
                        </form>
                        {/* Results are being presented in a paginated 5 x 2 grid It is determined whether the results are search or recommendations if the user has searched once or not*/}
                        <div className='App-home-search-results'>
                            <PaginatedGrid results={hasSearchedOnce ? resultElements : recommendedPlacesElements}/>
                        </div>
                    </div>  
                    <div className='App-tenant-home-right'>
                        {/* Button that redirects tenant-landlord users to the landlord home page */}
                        <div className='App-role-button-container'>
                            {!isAdmin && isLandlord && isTenant && !showLandlordHome && 
                                <button className='App-role-button' onClick={handleRoleChange}>Show Landlord</button>}
                        </div>
                        {/* Search Filters consist of a dropdown with all space types, a bar with dynamic price range and checkboxes with basic amenities */}
                        <form className='App-tenant-home-filters' onSubmit={handleApply}>
                            <h2>Add Filters</h2><br />
                            <h3>Select Type:</h3>
                            <select className="App-tenant-home-dropdown" name="spaceType" value={filterData.spaceType} onChange={handleFilterChange}>
                                <option value="">
                                    No Space Type
                                </option>
                                {spaceTypeOptionElements}
                            </select>
                            <div className="price-filter">
                                <h3>Price Range:</h3>
                                <Slider
                                    range
                                    min={0}
                                    max={maxPrice}
                                    value={priceRange}
                                    onChange={handlePriceChange}
                                />
                                <div className="price-minmax">
                                    <span>Min: ${priceRange[0]}</span>
                                    <span>Max: ${priceRange[1]}</span>
                                </div>
                            </div>
                            <div className='App-tenant-home-filter-checkboxes-container'> 
                                <h3>Amenities:</h3>
                                <div className='App-tenant-home-filter-checkboxes'>
                                {checkboxElements}
                                </div>
                            </div>
                            <div className='App-tenant-home-filter-button-container'>
                                <button onClick={handleRemoveAll} className='App-tenant-home-filter-remove'>Remove All</button>
                                <button className='App-tenant-home-filter-apply'>Apply</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>}
            {!isAdmin && ((!isTenant && isLandlord) || showLandlordHome) && <LandlordHome token={props.token}/>}
        </main>
    )
}