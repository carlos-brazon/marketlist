import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.js';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';

const CheckIn = () => {
    const [user, setUser] = useState({});

    const handleInput = () => {
        const inputName = event.target.name;
        setUser(prev => ({ ...prev, [inputName]: event.target.value }));
    }
    const handleSubmit = async () => {
        event.preventDefault();
        const user3 = { ...user, markeList : [], password : ''};

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                await setDoc(doc(db, "users4", user.uid), user3);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <form className='flex flex-col gap-2 p-5 items-center' onSubmit={handleSubmit}>
            <input className='border w-min p-2' type="text" name='nombre' onChange={handleInput} value={user.nombre || ''} placeholder='Nombre' />
            <input className='border w-min p-2' type="text" name='apellido' onChange={handleInput} value={user.apellido || ''} placeholder='Apellido' />
            <input className='border w-min p-2' type="text" name='email' onChange={handleInput} value={user.email || ''} placeholder='Email' />
            <input className='border w-min p-2' type="password" name='password' minLength="6" onChange={handleInput} value={user.password || ''} placeholder='Password' />
            <input className='border w-min p-2' type="submit" value={'Registrarse'} />
        </form>
    )
}

export default CheckIn