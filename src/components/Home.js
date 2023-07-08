import React from 'react';

export default function Home(props) {
    return(
        <main className='App-home'>
            <h2>{props.users}</h2>
        </main>
    )
}