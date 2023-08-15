import React from 'react';
import AdminHome from './AdminHome';

export default function Home(props) {

    /*
    // Test code to see if the app can read images from the database
    const userArray = props.users
    const userElements = userArray.map(user => {
        return (
            <div key={user.id}>
            {user.firstname}<br />
            {user.lastname}<br />
            </div>
        )
    })

    const userImages = userArray.map(user => {
        return (
            <div key={user.id}>
                <img className="App-home-image" src={user.image} alt="user"/>
            </div>
        )
    })
    */

    // Only the home page for the admin is ready now

    return(
        <main className='App-home'>
            {props.isAdmin && <AdminHome token={props.token}/>}
        </main>
    )
}