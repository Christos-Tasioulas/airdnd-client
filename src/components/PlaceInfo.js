import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link } from 'react-router-dom';
import './Profile.css' // We are reusing some css from the profile component
import './PlaceInfo.css'

export default function PlaceInfo() {

    // Retrieving the id of the place from the url parameter
    const { id } = useParams()
    const location = useLocation();
    const token = location.state?.token

    // State variable with the current place
    const [place, setPlace] = useState({})
    const [landlordPlaces, setLandlordPlaces] = useState([])
    const [isTheLandlord, setIsTheLandlord] = useState(false)
    const [isTenant, setIsTenant] = useState(true)
    const [theLandlord, setTheLandlord] = useState({})
    const [isVerified, setIsVerified] = useState(false)
    const [transitElements, setTransitElements] = useState(null)
    const [placeId, setPlaceId] = useState(null)

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

            // Token validation succeeded, now decode the token to check if the user is an admin
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
                
            })
            .catch(error => {
                console.error(error);
            })
        })
        .catch(error => {
            console.error(error);
        })
        
    }, [id, token])

    // Another Bugfix that returns the landlords data for the verified users
    useEffect(() => {
        if(isVerified) {
            fetch(`https://127.0.0.1:5000/listing/getListingById/${id}`)
            .then((response) => response.json())
            .then((data) => {
                setPlace(data.message);

                setTransitElements(data.message.transit.map((transit, index) => (
                    <span key={index}>{transit} </span>
                )))
    
                // Now that the place state is updated, fetch the landlord's details
                fetch(`https://127.0.0.1:5000/user/getUserById/${data.message.userId}`)
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

    // Small Bugfix
    useEffect(() => {
        if(place)
        {
            setPlaceId(place.id);
        }
    }, [place])
    

    return (
        <main className='App-place-container'>
            <div className='App-place'>
                {isTheLandlord && <Link to='/editplace' state={{ id: placeId }}  style={{position: "relative", left: "35%"}}>
                    <div className="App-profile-edit">
                        <div className="App-profile-edit-button">
                            <div className="App-profile-edit-cog">
                                <img src="https://icon-library.com/images/white-gear-icon-png/white-gear-icon-png-12.jpg" alt="Edit-profile" className="App-profile-edit-favicon"/>
                            </div>  
                            <span>Edit Place</span>
                        </div>
                    </div>
                </Link>}
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
                        <span>{place.photos}</span>
                    </div>
                    <div className='App-place-first-mini-container'>
                        <div className='App-place-basic-info'>
                            <div className='App-place-type-and-host'>
                                <h3>{place.spaceType}</h3>{isTenant && !isTheLandlord && <h3>Host: {theLandlord.firstname} {theLandlord.lastname}</h3>}
                            </div>
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
                            {place.amenities !== [] ? <span>{place.amenities}</span> : <span>No Amenities</span>}
                        </div>
                        <div className='App-place-rules'>
                            {place.houseRules !== [] ? <span>{place.houseRules}</span> : <span>No House Rules</span>}
                        </div>
                    </div>
                    <div className='App-place-location'>
                        <h5 className='App-place-address'>{place.address}</h5>
                        <h6 className='App-place-transit'>{transitElements}</h6>
                        <span>{place.map}</span>
                    </div>
                </div>
            </div>
        </main>
    )
}