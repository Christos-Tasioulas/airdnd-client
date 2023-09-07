import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useParams } from 'react-router-dom';
import './LandlordHome.css';
import JSONButton from './JSONButton';
import XMLButton from './XMLButton';

function TenantBooked(props) {

    const { id } = useParams()
    const token = props.token
    const [bookings, setBookings] = useState([])
    const [isAdmin, setIsAdmin] = useState(false)

    // Validate The Token
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

            // Token validation succeeded, now decode the token to check if the user is a landlord and their booked places
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
                // Extra security measure so that the data is returned only to tenants and admins
                if(decodeData.isTenant || decodeData.isAdmin) {
                    fetch(`https://127.0.0.1:5000/booking/getBookingsByUserId/${id}`)
                    .then((res) => res.json())
                    .then((data) => setBookings(data.message))
                }

                setIsAdmin(decodeData.isAdmin)
                
            })
            .catch(error => {
                console.error(error);
            })

        })
        .catch(error => {
            console.error(error);
        })
    }, [token])

    // This is every user row in the tenant table
    const bookingElements = bookings.map((booking) => 
        (<tr key={booking.id} className='App-place-info'>
            <td>{booking.date}</td>
            <td>{booking.checkIn}</td>
            <td>{booking.checkOut}</td>
            <td>{booking.price}</td> 
            <td>{booking.numGuests}</td> 
        </tr>)
    )

    return (
        <main className='App-home'>
            <div className='App-landlord-home'>
                <h1>Booked Places</h1>
                <br />
                <div className='scroll-container'>
                    <table className='scroll'>
                        <thead>
                            <tr>
                                <th>Booking Date</th>
                                <th>Check In</th>
                                <th>Check Out</th>
                                <th>Price</th>
                                <th>Guests</th>
                            </tr>
                        </thead>
                        <tbody className='scroll-body'>
                            {bookingElements}
                        </tbody>  
                    </table>
                </div>
                {isAdmin && <div className="App-export-buttons">
                    <XMLButton type="Bookings" id={id} data={bookings}/>
                    <JSONButton type="Bookings" id={id} data={bookings}/>
                </div>}
            </div>
        </main>
    )
}


export default TenantBooked;