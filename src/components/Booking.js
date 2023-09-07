import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams, useNavigate } from 'react-router-dom'
import Assurance from './Assurance';
import './Booking.css';
import dayjs from "dayjs";

export default function Booking(props) {

    // URL Parameters
    const { id } = useParams();

    const location = useLocation();
    // Props carried via Link component
    const { checkInDate, checkOutDate, numPeople } = location.state;
    const navigate = useNavigate()
    const [message, setMessage] = useState('')
    const [hasBooked, setHasBooked] = useState(false)

    const [bookingData, setBookingData] = useState({
        userId: 0,
        placeId: parseInt(id), // url params are strings in react
        numPeople: numPeople,
        checkIn: checkInDate,
        checkOut: checkOutDate,
        price: 0
    })

    const [place, setPlace] = useState({})

    useEffect(() => {

        // Token validation
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
    
            // Token validation succeeded, now decode the token to check if the user is a tenant
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
    
                if(decodeData.isTenant) {
                    setBookingData(prevBookingData => ({
                        ...prevBookingData,
                        userId: decodeData.id // getting userId via JWT
                    }));
                } else {
                    throw new Error("User is not Tenant");
                }
                
            })
            .catch(error => {
                console.error(error);
            });
        })
        .catch(error => {
            console.error(error);
        });
    
        // Getting the listing id and the accummulative price for the reservation
        fetch(`https://127.0.0.1:5000/listing/getListingById/${id}`)
            .then((response) => response.json())
            .then((data) => {

                setPlace(data.message)

                setBookingData(prevBookingData => ({
                    ...prevBookingData,
                    // Price = (numPeople-1) * additionalPrice + dailyPrice
                    price: (numPeople - 1) * data.message.additionalPrice + data.message.dailyPrice
                }));
            });

    }, [props.token, id]);
    

    function handleNumberOfGuests(event) {
        const { value } = event.target
        // Changing the num people and the price keys in booking data
        setBookingData(prevBookingData => ({
            ...prevBookingData,
            numPeople: value,
            price: (value - 1) * place.additionalPrice + place.dailyPrice
        }));
    }

    // Refusal to book returns the user back home directly
    function handleNo(event) {
        event.preventDefault()

        navigate("/")
    }

    function handleYes(event) {
        event.preventDefault()

        // Handling Empty Number Of People Input Field
        if(bookingData.numPeople === '') {
            setMessage("Please, Add Number Of Guests")
            return
        }

        // Token Validation
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

            // Setting the isBooking field of teh listing to true
            const placeOptions = {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({id:bookingData.placeId})
            }

            fetch(`https://127.0.0.1:5000/listing/bookListing`, placeOptions)

            const bookingDataCopy = {...bookingData}

            bookingDataCopy.date = new Date()
            bookingDataCopy.date = bookingDataCopy.date.toISOString()
            bookingDataCopy.checkIn = bookingDataCopy.checkIn.toISOString()
            bookingDataCopy.checkOut = bookingDataCopy.checkOut.toISOString() // Converting all dates to ISO strings yyyy/mm/dd to fit with MySQL
            bookingDataCopy.numPeople = parseInt(bookingDataCopy.numPeople) // Converting numPeople to int

            const bookingOptions = {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(bookingDataCopy) 
            }
            
            fetch('https://127.0.0.1:5000/booking/addBooking', bookingOptions)

            setHasBooked(true)
        });
    }

    return(
        <main className='App-booking-container'>
            {/* Message to indicate successful booking */}
            {hasBooked && <div className='App-approved'>
                <img src="https://upload.wikimedia.org/wikipedia/commons/thumb/6/6f/Eo_circle_light-green_checkmark.svg/2048px-Eo_circle_light-green_checkmark.svg.png" alt="success"/>
                <h2>Sucessfully Booked</h2>
                <h4>Go to <Link to="/" style={{color: "black", textDecoration: 'none'}}>Home Page</Link></h4>
            </div>}
            {!hasBooked && <div className='App-booking'>
                {message !== '' && <h3 className="App-signup-form-message">{message}</h3>}
                <h1>Book This Place</h1>
                <div className='App-booking-info'>
                    <div className='App-booking-guests-and-price'>
                        <label htmlFor="numPeople"><h3>Number Of Guests:</h3></label>
                        <input
                            id="numPeople"
                            type="text"
                            placeholder="Give Number Of Guests"
                            className='App-booking-guests-input'
                            value={bookingData.numPeople}
                            onChange={handleNumberOfGuests}
                        />
                        <h2>Total: {bookingData.price}$/night</h2>
                    </div>
                    <div className='App-booking-dates'>
                        {/* Dates will appear to the user in DD/MM/YYYY format */}
                        <h2>Check In:</h2> <span>{dayjs(bookingData.checkIn).format("DD/MM/YYYY")}</span>
                        <h2>Check Out:</h2> <span>{dayjs(bookingData.checkOut).format("DD/MM/YYYY")}</span>
                    </div>
                </div>
                {/* Assurance to confirm booking */}
                <Assurance className="App-booking-assurance" title="Confirm?" onNo={handleNo} onYes={handleYes}/>
            </div>}
        </main>
    )
}