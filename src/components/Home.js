import React, {useState, useEffect} from 'react';
import AdminHome from './AdminHome';

export default function Home(props) {

    const [isAdmin, setIsAdmin] = useState(false) 

    useEffect(() => {

        if(!props.token) {
            return
        }

        // Validating and decoding the JSON Web Token
        fetch("http://localhost:5000/user/validateToken", {
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
            return fetch("http://localhost:5000/user/decodeToken", {
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
                // Passing the information if the user is an admin or not
                setIsAdmin(decodeData.isAdmin);
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
            {isAdmin && <AdminHome token={props.token}/>}
        </main>
    )
}