import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

const Profile = () => {

    const navigate = useNavigate();
    useEffect(() => {
        if (localStorage.getItem('token')) {
            getUser()
            // eslint-disable-next-line
        }
        else {
            navigate("/");
        }
    }, [])

    const [name, setName] = useState()
    // const [notes, setNotes] = useState(notesInitial)

    const getUser = async () => {
        // API CALL
        const response = await fetch("http://localhost:5000/api/auth/getuser", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                "auth-token": localStorage.getItem('token')
            },
        });
        const json = await response.json()
        console.log(json.name);
        const uname = setName(json.name);

    }

    return (

        <div>
            {console.log({ name })}
            <p>Welcome</p>{name}
        </div >
    )
}

export default Profile