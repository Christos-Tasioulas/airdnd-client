import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';

export default function Message(props) {

    const { id } = useParams()
    const currentDate = new Date()

    const [currentUserId, setCurrentUserId] = useState(0)
    const [message, setMessage] = useState({})
    const [formData, setFormData] = useState({
        date: currentDate,
        messageText: ""
    })

    useEffect(() => {

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
                // Passing the information for the role of the user
                setCurrentUserId(decodeData.id)
                fetch(`https://127.0.0.1:5000/message/getMessageById/${id}`, {
                    method: "GET"
                })
                .then(getResponse => {
                    if (!getResponse.ok) {
                        throw new Error("Failed to retrieve message");
                    }
                    return getResponse.json()
                })
                .then(getData => {
                    setMessage(getData.message)
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

    return (
        <main className='App-home'>
            <div className='App-landlord-home'>
                <h1>{currentUserId === message.userId ? message.receiverUsername : message.senderUsername}</h1>
                <p className='App-message'>{message.messageText}</p>
                <form className='App-message-form'>
                    <textarea
                        placeholder='Send Text'
                        className='App-message-textarea'
                    />
                    <button className='App-message-button'>Send</button>
                </form>
            </div>
        </main>
    )
}