import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import JSONButton from "./JSONButton";
import XMLButton from "./XMLButton";

// Container component for the landlord home component if the user is the admin
export default function LandlordPlaces(props) {

    const { id } = useParams()
    const [isAdmin, setIsAdmin] = useState(false)
    const [places, setPlaces] = useState([])
    const navigate = useNavigate()

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
                if(decodeData.isAdmin) {
                    fetch(`https://127.0.0.1:5000/listing/getPlacesByLandlordId/${id}`)
                    .then((res) => res.json())
                    .then((data) => setPlaces(data.message))
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
    }, [props.token])

    // Navigating the table to each individual place's edit page
    async function handleClick(event, place) {
        const id = place.id

        navigate(`/placeinfo/${id}`)
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
        <main className='App-home'>
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
                <div className="App-export-buttons">
                    <XMLButton type="Places" id={id} data={places}/>
                    <JSONButton type="Places" id={id} data={places}/>
                </div>
            </div>
        </main>
    )

}