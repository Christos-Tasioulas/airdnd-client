import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import Assurance from './Assurance';

export default function Message(props) {

    const { id } = useParams() // message id
    const navigate = useNavigate()
    const currentDate = new Date()

    const [currentUserId, setCurrentUserId] = useState(0) // userId via JWT
    const [message, setMessage] = useState({}) // stores the previous message if exists

    /**
     * State that contains the data obtained from the form.
     * Changes whenever a field on the form changes
     */ 
    const [formData, setFormData] = useState({
        date: currentDate,
        messageText: ""
    })

    const [wantsToDelete, setWantsToDelete] = useState(false) // state based if the user wants to delete clicked message
    const [errorMessage, setErrorMessage] = useState("")

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

            // Token validation succeeded, now decode the token to get the message
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

    // Changes the form data
    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]: value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        // checking if the user tries to send a blank message
        if(formData.messageText === "") {
            setErrorMessage("Don't Send a blank message")
            return
        }

        const formDataCopy = {...formData}

        // Checking if the user is the sender or the reciever of the previous message
        formDataCopy.userId = currentUserId
        formDataCopy.senderUsername = currentUserId === message.userId ? message.senderUsername : message.receiverUsername
        formDataCopy.receiverId = currentUserId === message.userId ? message.receiverId : message.userId
        formDataCopy.receiverUsername = currentUserId === message.userId ? message.receiverUsername : message.senderUsername
        
        // Extra security measure to check if the user is still logged in while they send the message
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

            fetch("https://127.0.0.1:5000/message/addMessage", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formDataCopy),
            })

            navigate('/inbox')

        })
        .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
        });
    }

    // User wants to delete the message
    function handleDelete(event) {
        event.preventDefault()
        setWantsToDelete(true)
    }

    // User doesn't want to delete the message
    function handleNo(event)
    {
        event.preventDefault()

        setWantsToDelete(false)
    }

    function handleYes(event)
    {
        event.preventDefault()

        // Extra security measure to check if the user is still logged in before they delete the message
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
            const placeOptions = {
                method: "DELETE",
                headers: { "Content-Type": "application/json" },
            }

            fetch(`https://127.0.0.1:5000/message/deleteMessage/${id}`, placeOptions)
            
            navigate("/inbox")
        });

    }

    return (
        <main className='App-home'>
            <div className='App-landlord-home'>
                {/* Displaying the other user's username */}
                <h1>{currentUserId === message.userId ? message.receiverUsername : message.senderUsername}</h1>
                {errorMessage !== "" && <h3 className="App-signup-form-message">{errorMessage}</h3>}
                <p className='App-message'>{message.messageText}</p>
                <form className='App-message-form'>
                    {/* Text area for the message */}
                    <textarea
                        placeholder='Send Text'
                        className='App-message-textarea'
                        onChange={(event) => handleChange(event)}
                        name='messageText'
                        value={formData.messageText}
                    />
                    <div className='App-message-buttons'>
                        <button className='App-message-delete' onClick={(event) => handleDelete(event)}>Delete</button>
                        <button className='App-message-button' onClick={(event) => handleSubmit(event)}>Send</button>
                    </div>
                </form>
                { /* Asking the user if they want to delete the message or not */ }
                { wantsToDelete && <Assurance className="App-delete-message-assurance" title="Are you sure you want to delete the message?" onYes={handleYes} onNo={handleNo}/>}
            </div>
        </main>
    )
}