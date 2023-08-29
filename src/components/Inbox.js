import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

function Inbox(props) {
    
    const [messages, setMessages] = useState([])
    const [currentUserId, setCurrentUserId] = useState(0)
    const navigate = useNavigate();

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
                setCurrentUserId(decodeData.id)
                fetch(`https://127.0.0.1:5000/message/getMessagesByUser/${decodeData.id}`, {
                    method: "GET"
                })
                .then(getResponse => {
                    if (!getResponse.ok) {
                        throw new Error("Failed to retrieve messages");
                    }
                    return getResponse.json();
                })
                .then(getData => {
                    setMessages(getData.message.reverse())
                })
            })
            .catch(error => {
                console.error(error);
            })

        })
        .catch(error => {
            console.error(error);
        })
    }, [props.token])
    
    // This is every user row in the message table
    const messageElements = messages.map((message) => 
        (<tr onClick={event => handleClick(event, message)} key={message.messageId} className='App-place-info'>
            <td>{currentUserId === message.userId ? message.receiverUsername + " (Sent)" : message.senderUsername + " (Received)"}</td>
            <td>{message.messageText}</td>
            <td>{message.date}</td> 
        </tr>)
    )

    // Navigating the admin to each individual user's info page
    function handleClick(event, message) {
        const id = message.messageId
        navigate(`/message/${id}`)
    }

    return (
        <main className='App-home'>
            <div className='App-landlord-home'>
                <h1>Inbox</h1>
                <br />
                <div className='scroll-container'>
                    <table className='scroll'>
                        <thead>
                            <tr>
                                <th>Username</th>
                                <th>Text</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody className='scroll-body'>
                            {messageElements}
                        </tbody>  
                    </table>
                </div>
            </div>
        </main>
    );
};

export default Inbox;