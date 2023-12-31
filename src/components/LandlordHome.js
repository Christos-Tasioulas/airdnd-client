import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './AdminHome.css'; // Reusing Admin Home css
import './LandlordHome.css';

export default function LandlordHome(props) {
    
    const [places, setPlaces] = useState([])
    const navigate = useNavigate();

    // Retrieve all uplaces by landlordId
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

            // Token validation succeeded, now decode the token to check if the user is a landlord and their places
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
                if(decodeData.isLandlord) {
                    fetch(`https://127.0.0.1:5000/listing/getPlacesByLandlordId/${decodeData.id}`)
                    .then((res) => res.json())
                    .then((data) => setPlaces(data.message))
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

    // Navigating the table to each individual place's edit page
    async function handleClick(event, place) {
        const id = place.id

        navigate(`/editplace/${id}`)
    }
    
    // This is every user row in the landlord table
    const placeElements = places.map((place) => 
        (<tr onClick={event => handleClick(event, place)} key={place.id} className='App-place-info'>
            <td>{place.name}</td>
            <td>{place.address}</td>
            <td>{place.description}</td>
            <td>{place.spaceType}</td>
            <td>{place.dailyPrice}</td> 
        </tr>)
    )

    return (
        <div className='App-landlord-home'>
            <h1>Places To Rent Info</h1>
            <br />
            <div className='scroll-container'>
                <table className='scroll'>
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Address</th>
                            <th>Description</th>
                            <th>Space Type</th>
                            <th>Daily Price</th>
                        </tr>
                    </thead>
                    <tbody className='scroll-body'>
                        {placeElements}
                    </tbody>  
                </table>
            </div>
            <Link to="/addplace">
                <button className='Add-place-button'>
                    Add Place
                </button>
            </Link>
        </div>
    )
}