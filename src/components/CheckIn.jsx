import React, { useState } from 'react'
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.js';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router';
import Input from './Input.jsx';

const CheckIn = () => {
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [passwordError, setPasswordError] = useState('');

    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        if (inputName === 'email') {
            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9@.\-_]/g, '');
            setUser((prev) => ({ ...prev, [inputName]: cleanedValue }));
        }
        else {
            setUser((prev) => ({ ...prev, [inputName]: inputValue }));
        }
        if (inputName === 'password' && inputValue.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        } else {
            setPasswordError('');
        }
    }
    const handleSubmit = async () => {
        event.preventDefault();
        const user3 = { ...user, markeList: [], password: '', email: (user.email).toLowerCase() };

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
        history('/', { replace: true });
    }

    return (
        <form className='flex flex-col gap-2 p-5 items-center' onSubmit={handleSubmit}>
            <Input
                type={'text'}
                name={'nombre'}
                onChange={handleInput}
                value={user.nombre || ''}
                placeholder={'Nombre'}
                required
            />
            <Input
                type={'text'}
                name={'apellido'}
                onChange={handleInput}
                value={user.apellido || ''}
                placeholder={'Apellido'}
                required
            />
            <Input
                type={'text'}
                name={'email'}
                onChange={handleInput}
                value={user.email || ''}
                placeholder={'Email'}
                required
            />
            <Input
                type={'password'}
                name={'password'}
                onChange={handleInput}
                value={user.password || ''}
                placeholder={'Password'}
                minLength={'6'}
                required
            />
            {passwordError && <p className='text-red-600'>{passwordError}</p>}

            <Input
                className={'w-fit text-white font-semibold text-base bg-slate-500 hover:bg-slate-700 hover:shadow-blue-800 shadow-md shadow-blue-950'}
                type={'submit'}
                value={'Registrarse'}
                required
            />
        </form>
    )
}
export default CheckIn;