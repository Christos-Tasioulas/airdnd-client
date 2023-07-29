import React from 'react'
import './Profile.css'
import { Link } from 'react-router-dom';

export default function Profile() {

    // All the favicons shown in the contact section of the user profile
    const contacts = [
        {id:1, favicon: 'https://cdn3.iconfinder.com/data/icons/social-messaging-ui-color-line/245532/72-512.png', alt:"email", name:'email@email.com'},
        {id:2, favicon: 'https://cdn.icon-icons.com/icons2/644/PNG/512/red_phone_icon-icons.com_59526.png', alt:"phone", name:'565656565656'}
    ]

    // User contact information as html elements
    const contactElements = contacts.map(contact => 
        <div key={contact.id} className='App-profile-contact'>
            <img src={contact.favicon} alt={contact.alt} />
            <h3>{contact.name}</h3>
        </div>
    )

    return (
        <main className="App-profile-container">
            <div className="App-profile">
                {/* In Link components you can only change the style using javascript styles similar to CSS
                  * but different syntax inside the style attribute of the tag
                  * This is a Link to the edit profile component 
                  */}
                <Link to='/editprofile' style={{position: "relative", left: "35%"}}>
                    <div className="App-profile-edit">
                        <div className="App-profile-edit-button">
                            <div className="App-profile-edit-cog">
                                <img src="https://icon-library.com/images/white-gear-icon-png/white-gear-icon-png-12.jpg" alt="Edit-profile" className="App-profile-edit-favicon"/>
                            </div>  
                            <span>Edit Account</span>
                        </div>
                    </div>
                </Link> 
                <br /><br />
                <div className="App-profile-user">
                    <div className="App-profile-userInfo">
                        {/* Displays the profile image of the user. For now it is the default profile image, profile images are not working yet in the app. */}
                        <div className="App-profile-image">
                            <img src="https://i.pinimg.com/originals/46/72/f8/4672f876389036583190d93a71aa6cb2.jpg" alt="prof"/>
                        </div>
                        {/* Important User Info */}
                        <h2 className='App-profile-fullname'>First Name Last Name</h2>
                        <h2 className='App-profile-username'>Username</h2>
                        <h3 className='App-profile-role'>Role(s)</h3>
                        <br /><br /><br />
                        {/* Contact Section in the profile page */}
                        <div className='App-profile-contacts'>
                            <h2 className='App-profile-contacts-title'>Contact:</h2>
                            {contactElements}
                        </div>
                    </div>
                    {/* These are set to appear depending on the roles of the user, the user authentication is not ready yet */}
                    {/* We don't have the corresponding info yet in the database */}
                    <div className='App-profile-userHistory'>
                        <div className='App-profile-landlord'>
                            <h3>Landlord Info</h3>
                        </div>
                        <div className='App-profile-tenant'>
                            <h3>Tenant Info</h3>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}