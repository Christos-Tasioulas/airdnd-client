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

    return(
        <main className='App-home'>
            <h2>{userElements}</h2>
        </main>
    )
}