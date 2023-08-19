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

    // Getting the current user from the server app updating the state
    useEffect(() => {
        fetch('http://localhost:5000/user/validateToken', {
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
            return fetch("http://localhost:5000/user/decodeToken", {
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
                if(decodeData.isAdmin) {
                    fetch(`http://localhost:5000/listing/getListingById/${id}`)
                        .then((response) => response.json())
                        .then((data) => setPlace(data.message))
                }
                
            })
            .catch(error => {
                console.error(error);
            })
        })
        .catch(error => {
            console.error(error);
        })
        
    }, [id, token])

    return (
        <main className='App-place-container'>
            <div className='App-place'>
                <Link to='/' style={{position: "relative", left: "35%"}}>
                    <div className="App-profile-edit">
                        <div className="App-profile-edit-button">
                            <div className="App-profile-edit-cog">
                                <img src="https://icon-library.com/images/white-gear-icon-png/white-gear-icon-png-12.jpg" alt="Edit-profile" className="App-profile-edit-favicon"/>
                            </div>  
                            <span>Edit Place</span>
                        </div>
                    </div>
                </Link>
                <br/><br/>
                <div className='App-place-info'>
                    <div className='App-place-visuals'>
                        <div className='App-place-photos'></div>
                        <div className='App-place-map'></div>
                    </div>
                    <div className='App-place-text-info'>
                        
                    </div>
                </div>
            </div>
        </main>
    )
}