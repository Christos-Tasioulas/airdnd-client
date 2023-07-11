import React from 'react';

export default function Home(props) {

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

    return(
        <main className='App-home'>
            <h2>{userElements}</h2>
            {userImages}
        </main>
    )
}