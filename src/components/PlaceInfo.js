import React, { useState, useEffect } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import Map from './Map'
import ImageCarousel from './ImageCarousel';
import Reviews from './Reviews';
import './Profile.css' // We are reusing some css from the profile component
import './PlaceInfo.css'

export default function PlaceInfo(props) {

    // Retrieving the id of the place from the url parameter
    const { id } = useParams()
    const token = props.token

    const location = useLocation();
    const navigate = useNavigate();
    const searchParams = new URLSearchParams(location.search);
    
    // Access the checkIn, checkOut and numPeople parameters
    const checkInDate = new Date(searchParams.get('checkIn'));
    const checkOutDate = new Date(searchParams.get('checkOut'));
    const numPeople = searchParams.get('numPeople')

    // State variable with the current place
    const [place, setPlace] = useState({})
    const [landlordPlaces, setLandlordPlaces] = useState([])
    const [isTheLandlord, setIsTheLandlord] = useState(false) // The user by default is not the place landlord
    const [isTenant, setIsTenant] = useState(false)
    const [theLandlord, setTheLandlord] = useState({}) // The landlord retrieved by place data
    const [theLandlordReviewCount, setTheLandlordReviewCount] = useState(0)
    const [isVerified, setIsVerified] = useState(false)

    // Elements
    const [transitElements, setTransitElements] = useState(null)
    const [amenitiesElements, setAmenitiesElements] = useState(null)
    const [houseRulesElements, setHouseRulesElements] = useState(null)
    const [photoElements, setPhotoElements] = useState([])
    const [placeId, setPlaceId] = useState(0)
    const [position, setPosition] = useState([])

    // Getting the current place from the server app updating the state
    useEffect(() => {
        fetch('https://127.0.0.1:5000/user/validateToken', {
            method: 'GET',
            headers: {
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => {
            if (!response.ok) {
                throw new Error("Network response was not ok");
            }
            return response.json();
        })
        .then(validationData => {

            // Token validation succeeded, now decode the token to check if the user is the landlord
            return fetch("https://127.0.0.1:5000/user/decodeToken", {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`
                }
            })
            .then(decodeResponse => {
                if (!decodeResponse.ok) {
                    throw new Error("Token decoding failed");
                }
                return decodeResponse.json();
            })
            .then(decodeData => {

                // Verification for all roles in order to make the component reusable
                setIsTenant(decodeData.isTenant)

                if (decodeData.isLandlord) {
                    
                    fetch(`https://127.0.0.1:5000/listing/getPlacesByLandlordId/${decodeData.id}`)
                        .then((response) => response.json())
                        .then((data) => setLandlordPlaces(data.message))
                }

                setIsVerified(true)

                // Tracking the users that clicked in the place info
                fetch(`https://127.0.0.1:5000/userListing/getUserListing/${decodeData.id}/${id}`, {method: 'GET'})
                .then((resposnse) => {
                    if(!resposnse.ok) {
                        throw new Error('User Listing Not Found')
                    }

                    return resposnse.json()
                })
                .then((data) => {

                    // Case it is not the first time the user clicked this place
                    if(data.message) {
                        const requestOptions = {
                            method:'PUT',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({userId: decodeData.id, listingId: id})
                        }

                        fetch('https://127.0.0.1:5000/userListing/incrementUserListing', requestOptions)

                    // Case it is the first time the user clicked this place
                    } else {

                        const requestOptions = {
                            method:'POST',
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({userId: decodeData.id, listingId: id})
                        }

                        fetch('https://127.0.0.1:5000/userListing/addUserListing', requestOptions)

                    }
                })
                
            })
            .catch(error => {
                console.error(error);
            })
        })
        .catch(error => {
            console.error(error);
        })

        // Getting the place
        fetch(`https://127.0.0.1:5000/listing/getListingById/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPlace(data.message);

                // Getting the html elements for list data and the position
                setTransitElements(data.message.transit.map((transit, index) => (
                    <span key={index}>{transit}{data.message.transit.length !== index+1 && " • "}</span>
                )))

                setAmenitiesElements(data.message.amenities.map((amenity, index) => (
                    <li key={index}>{amenity}</li>
                )))

                setHouseRulesElements(data.message.houseRules.map((houseRule, index) => (
                    <li key={index}>{houseRule}</li>
                )))

                setPhotoElements(data.message.photos.map((photo, index) => (
                    { key: index, url: photo }
                )))

                setPosition([data.message.latitude, data.message.longtitude])
    
                // Now that the place state is updated, fetch the landlord's details
                fetch(`https://127.0.0.1:5000/user/getUserById/${data.message.userId}`)
                    .then((response) => response.json())
                    .then((data) => {
                        setTheLandlord(data.message)

                        fetch(`https://127.0.0.1:5000/review/countReviewsByLandlordId/${data.message.id}`)
                        .then((response) => response.json())
                        .then((data) => setTheLandlordReviewCount(data.message))

                    })
                    .catch((error) => {
                        console.log(error);
                    });
            })
            .catch((error) => {
                console.log(error);
            })
        
    }, [])

    // Bugfix that controls whether the user is the landlord
    useEffect(() => {

        for (const placeItem of landlordPlaces) {
            if (parseInt(placeItem.id) === parseInt(id)) {
                setIsTheLandlord(true);
                break; // No need to continue looping once a match is found
            }
        }

    }, [id, landlordPlaces]);

    // Small Bugfix
    useEffect(() => {
        if(place)
        {
            setPlaceId(place.id);
        }
    }, [place])
    
    // Redirects the user to the booking form
    function handleClick(event) {
        event.preventDefault();

        navigate(`/booking/${id}`, {state: {checkInDate: checkInDate, checkOutDate: checkOutDate, numPeople: numPeople}})
    }

    // Url that takes the user to the host info
    const url = `/userinfo/${theLandlord.id}`

    return (
        <main className='App-place-container'>
            <div className='App-place'>
                <br/><br/>
                <div className='App-place-info-container'>
                    <h2>{place.name}</h2>
                    <div className='App-place-stats'>
                        <img src="https://static.vecteezy.com/system/resources/previews/001/189/080/original/star-png.png" alt="star" className="App-star"/>
                        <span>{place.reviewAvg} • </span>
                        <span><u>{place.reviewCount} <b>Reviews</b></u> • </span>
                        <span><u>{place.neighborhood} {place.city}, {place.country}</u> • </span>
                        {isTheLandlord && place.isBooked ? <span>Booked</span> : <span>Not Booked</span>}
                    </div>
                    <div className='App-place-photos'>
                        {/* Images are displayed in an image carousel. Cannot be removed in that page */}
                        {place.photos && place.photos.length > 0 ? (
                            <ImageCarousel isTheLandlord={false} images={photoElements} />
                        ) : (
                            <span>No Photos Available</span>
                        )}
                    </div>
                    <div className='App-place-first-mini-container'>
                        <div className='App-place-basic-info'>
                            <div className='App-place-type-and-host'>
                                <h2>{place.spaceType}</h2>
                                {/* Link to host info */}
                                {isTenant && !isTheLandlord && 
                                    <div className='App-place-host'>
                                        <div className='App-place-host-name-and-image'>
                                            <h3>Host: <Link to={url} style={{color:"black"}}>{theLandlord.firstname} {theLandlord.lastname}</Link></h3>
                                            <img src={theLandlord.image} alt='profile' className='App-place-host-image'/>
                                        </div>
                                        {/* host image */}
                                        <span>{theLandlordReviewCount} Host Review{theLandlordReviewCount !== 1 && 's'}</span>
                                    </div>
                                }
                            </div>
                            <br/>
                            <div className='App-place-guests-and-rooms'>
                                <span>{place.maxGuests} Guests • </span>
                                <span>{place.bedroomsNumber} Bedrooms • </span>
                                <span>{place.bedsNumber} Beds • </span>
                                <span>{place.bathroomsNumber} Bathrooms</span>
                            </div>
                        </div>
                        <div className='App-place-reservation'>
                            <div className='App-place-price'>
                                <div className='App-place-daily-price'>
                                    <h2>{place.dailyPrice}$/night</h2>
                                </div>
                                <div className='App-place-additional-price'>
                                    <h4>Additional per person: {place.additionalPrice}$/person</h4>
                                </div>
                            </div>
                            <div className='App-place-reservation-button'>
                            {/* Booking Button appears only if the user has given dates to the search */}
                            {isTenant && checkInDate.toString() !== "Invalid Date" && checkOutDate.toString() !== "Invalid Date" && (
                                <button onClick={handleClick}>
                                    Booking
                                </button>
                            )}
                            </div>
                        </div>
                    </div>
                    
                    <div className='App-place-description'>
                        <h3>Description</h3>
                        <span>{place.description}</span>
                    </div>
                    <div className='App-place-second-mini-container'>
                        <div className='App-place-additional-space-info'>
                            {place.hasLivingRoom ? <span>Has Living Room</span> : <span>Does Not Have A Living Room</span>}
                            <br/>  
                            <span>{place.squareMeters} sq.m.</span>
                        </div>
                        <div className='App-place-time-info'>
                            <div className='App-place-days-available'>
                                <h4>Max Stay Per Booking: {place.minimumLengthStay} days</h4>
                            </div>
                            <div className='App-place-check-in-check-out'>
                                <div className='App-place-check-in'>
                                    <h4>Available from:</h4>
                                    <span>{place.checkIn}</span>
                                </div>
                                <div className='App-place-check-out'>
                                    <h4>Available until:</h4>
                                    <span>{place.checkOut}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='App-place-third-mini-container'>
                        <div className='App-place-amenities'>
                            <h3>Amenities</h3>
                            {place.amenities !== [] ? <ul>{amenitiesElements}</ul> : <span>No Amenities</span>}
                        </div>
                        <div className='App-place-rules'>
                            <h3>House Rules</h3>
                            {place.houseRules !== [] ? <ul>{houseRulesElements}</ul> : <span>No House Rules</span>}
                        </div>
                    </div>
                    <div className='App-place-location'>
                        <h5 className='App-place-address'>{place.address}</h5>
                        {place.transit !== [] ? <h6 className='App-place-transit'>You can reach us by: {transitElements}</h6> : <span>No Transit</span>}
                        {/* Renders the map if loaded (Buggy?) */}
                        {position.length === 2 ? (
                            <div>
                                <Map position={position} />
                            </div>
                        ) : (
                            <span>Loading Map...</span>
                        )}
                    </div>
                    <div className='App-place-reviews'>
                        <Reviews reviewed="place" token={token} id={id} />
                    </div>
                </div>
            </div>
        </main>
    )
}