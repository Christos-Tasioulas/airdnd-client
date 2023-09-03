import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import Reviews from './Reviews';

export default function HostReview(props) {

    const [userId, setUserId] = useState(0)
    const { id } = useParams() 

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
                setUserId(decodeData.id)
            })
            .catch(error => {
                console.error(error);
            })

        })
        .catch(error => {
            console.error(error);
        })
    }, [props.token])

    return (
        <main className='App-home'>
            <div className='App-landlord-home'>
                <div className='App-landlord-reviews'>
                    <Reviews id={id} token={props.token} reviewed="host" />
                </div>
            </div>
        </main>
    )
}