import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom';
import './StartMessage.css';

export default function Message(props) {

    const { id } = useParams()
    const navigate = useNavigate()
    const currentDate = new Date()

    const [currentUserId, setCurrentUserId] = useState(0)
    const [currentUserUsername, setCurrentUserUsername] = useState('')
    const [receiverUsername, setReceiverUsername] = useState('')
    const [formData, setFormData] = useState({
        date: currentDate,
        messageText: ""
    })
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
                fetch(`https://127.0.0.1:5000/user/getUserById/${decodeData.id}`, {method: 'GET'})
                .then((res) => res.json())
                .then((data) => setCurrentUserUsername(data.message.username))

                fetch(`https://127.0.0.1:5000/user/getUserById/${id}`, {method: 'GET'})
                .then((res) => res.json())
                .then((data) => setReceiverUsername(data.message.username))
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

    function handleChange(event) {
        const { name, value } = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            [name]:value
        }))
    }

    function handleSubmit(event) {
        event.preventDefault()

        if(formData.messageText === "") {
            setErrorMessage("Don't Send a blank message")
            return
        }

        const formDataCopy = {...formData}
        formDataCopy.userId = currentUserId

        formDataCopy.senderUsername = currentUserUsername
        formDataCopy.receiverId = id
        formDataCopy.receiverUsername = receiverUsername 
        
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

            navigate(`/userinfo/${formDataCopy.receiverId}`)

        })
        .catch(error => {
            console.error(error);
            // Handle the error here, e.g., show an error message to the user
        });
    }

    return (
        <main className='App-start-message-container'>
            <div className='App-start-message'>
                <h1>{receiverUsername}</h1>
                {errorMessage !== "" && <h3 className="App-signup-form-message">{errorMessage}</h3>}
                <form className='App-message-form'>
                    <textarea
                        placeholder='Send Text'
                        className='App-message-textarea'
                        onChange={(event) => handleChange(event)}
                        name='messageText'
                        value={formData.messageText}
                    />
                    <button className='App-start-message-button' onClick={(event) => handleSubmit(event)}>Send</button>
                </form>
            </div>
        </main>
    )
}