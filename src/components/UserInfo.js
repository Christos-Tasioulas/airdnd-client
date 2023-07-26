import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

export default function UserInfo() {

    const { id } = useParams()
    const [user, setUser] = useState({})

    useEffect(() => {
        fetch(`http://localhost:5000/user/getUserById/${id}`)
            .then((response) => response.json())
            .then((data) => setUser(data.message))
    }, [id])

    const [formData, setFormData] = useState({
        isApproved: user.isApproved,
        isEmpty: true,
        isSubmitted: false
    })
    const [message, setMessage] = useState("")

    const contacts = [
        {id:1, favicon: 'https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/245532/72-512.png', alt:"email", name:user.email},
        {id:2, favicon: 'https://cdn.icon-icons.com/icons2/644/PNG/512/red_phone_icon-icons.com_59526.png', alt:"phone", name:user.phoneNumber}
    ]

    const contactElements = contacts.map(contact => 
        <div key={contact.id} className='App-profile-contact'>
            <img src={contact.favicon} alt={contact.alt} />
            <h3>{contact.name}</h3>
        </div>
    )

    function handleClick(event) {
        const {name, value} = event.target
        setFormData(prevFormData => ({
            ...prevFormData,
            isEmpty: false,
            isSubmitted: false,
            [name]: value
        }))

        const approveMessage = (value === 'true') ? "Landlord Approved!" : "Landlord Disapproved!"
        setMessage(approveMessage)
    }

    function handleSubmit(event) {
        event.preventDefault()

        setFormData(prevState => ({
            ...prevState,
            isSubmitted: true
        }))

        setUser(prevState => ({
            ...prevState,
            isApproved: formData.isApproved
        }))
        
        const requestOptions = {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({id:user.id, isApproved:formData.isApproved})
        }

        fetch('http://localhost:5000/user/approveUser', requestOptions)
    }

    return (
        <main className="App-profile-container">
            <div className="App-profile"> 
                <div className="App-profile-user">
                    <div className="App-profile-userInfo">
                        <div className="App-profile-image">
                            <img src={user.image === "" ? "https://i.pinimg.com/originals/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg" : user.image} alt="prof"/>
                        </div>
                        <h2 className='App-profile-fullname'>{user.firstname} {user.lastname}</h2>
                        <h2 className='App-profile-username'>{user.username}</h2>
                        <h3 className='App-profile-role'>{user.isTenant && "Tenant"} {user.isLandlord && "Landlord"}</h3>
                        <br /><br /><br />
                        <div className='App-profile-contacts'>
                            <h2 className='App-profile-contacts-title'>Contact:</h2>
                            {contactElements}
                        </div>
                    </div>
                    <div className='App-profile-userHistory'>
                        {user.isLandlord && <div className='App-profile-landlord'>
                            <h3>Landlord Info</h3>
                        </div>}
                        {user.isTenant && <div className='App-profile-tenant'>
                            <h3>Tenant Info</h3>
                        </div>}
                        {user.isLandlord && <form className='App-approve-user' onSubmit={handleSubmit}>
                            <h3>Approved to be landlord?</h3>
                            <div className='App-approval-radios'>
                                <div className='App-approval-radio'>
                                    <input type="radio" id="Yes" name="isApproved" value="true" onClick={handleClick}/>
                                    <label htmlFor="Yes">Yes</label>
                                </div>
                                <div className='App-approval-radio'>
                                    <input type="radio" id="No" name="isApproved" value="false" onClick={handleClick}/>
                                    <label htmlFor="No">No</label>
                                </div>      
                            </div>
                            <br /><br />
                            <button 
                                className='App-approval-submit' 
                                style={{
                                    backgroundColor: formData.isEmpty ? "#484848" : "#ff585d",
                                    cursor: formData.isEmpty && "default"
                                }}
                            >Save Changes</button>
                        </form>}
                        {message !== "" && formData.isSubmitted && <h3>{message}</h3>}
                    </div>
                </div>
            </div>
        </main>
    )
}