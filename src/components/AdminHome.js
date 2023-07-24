import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AdminHome.css';

export default function AdminHome() {

    const [users, setUsers] = useState([])
    const navigate = useNavigate();
    
    useEffect(() => {
        fetch('http://localhost:5000/user/getAllUsers')
            .then((res) => res.json())
            .then((data) => setUsers(data.message))
    }, [])

    async function handleClick(event, user) {
        const id = user.id

        navigate(`/userinfo/${id}`)
    }

    const userElements = users.map((user) => 
        (<tr onClick={event => handleClick(event, user)} key={user.id} className='App-user-info'>
            <td>{user.username}</td>
            <td>{user.firstname} {user.lastname}</td>
            <td>{user.email}</td>
            <td>
                {user.isAdmin && `Admin`} {user.isTenant && `Tenant`} {user.isLandlord && `Landlord`}
            </td>
            <td>{user.isApproved ? "User Approved" : "User not Approved"}</td> 
        </tr>)
    )

    return (
        <div className='App-admin-home'>
            <h1>User Info</h1>
            <br />
            <table className='App-users-info'>
                <thead>
                    <tr>
                        <th>Username</th>
                        <th>Fullname</th>
                        <th>Email</th>
                        <th>Roles</th>
                        <th>Approved State</th>
                    </tr>
                </thead>
                <tbody>
                    {userElements}
                </tbody>  
            </table>
        </div>
    )
}