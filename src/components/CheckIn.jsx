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
    const [emailError, setEmailError] = useState('');
    const [messageLogIn, setMessageLogIn] = useState('');

    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        if (inputName === 'email') {
            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9@.\-_]/g, '');
            setUser((prev) => ({ ...prev, [inputName]: cleanedValue }));
            if (cleanedValue.includes('@')) {
                setEmailError(false)
            }
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
        if (!user.email || !user.email.includes('@')) {
            setEmailError('Formato de correo invalido, debe contener @.');
            return;
        }
        const showMessage = () => {
            setTimeout(() => {
                history('/', { replace: true });
            }, 2000);
        };

        const userToFirebase = { ...user, markeList: [], email: (user.email).toLowerCase() };

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                const user = userCredential.user;
                delete userToFirebase.password;
                await setDoc(doc(db, "users4", user.uid), userToFirebase);
                setMessageLogIn('Usuario registrado correctamente');
                showMessage();
            })
            .catch((error) => {
                setMessageLogIn('Error al registrar usuario, intentalo de nuevo');
                setUser('');
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <div className='flex flex-col gap-4 p-3'>
            <h1 className='font-semibold text-xl'>Crea tu cuenta</h1>

            <form className='flex flex-col gap-2 items-center' onSubmit={handleSubmit}>
                <div className='flex gap-2'>
                    <Input
                        className={'w-28'}
                        type={'text'}
                        name={'nombre'}
                        onChange={handleInput}
                        value={user.nombre || ''}
                        placeholder={'Nombre'}
                        required
                    />
                    <Input
                        className={'w-28'}
                        type={'text'}
                        name={'apellido'}
                        onChange={handleInput}
                        value={user.apellido || ''}
                        placeholder={'Apellido'}
                        required
                    />
                </div>
                <Input
                    className={'w-[232px]'}
                    type={'text'}
                    name={'email'}
                    onChange={handleInput}
                    value={user.email || ''}
                    placeholder={'Email'}
                    required
                />
                <Input
                    className={'w-[232px]'}
                    type={'password'}
                    name={'password'}
                    onChange={handleInput}
                    value={user.password || ''}
                    placeholder={'Establecer contraseña'}
                    minLength={'6'}
                    required
                />
                <p>{messageLogIn}</p>
                {passwordError && <p className='text-red-600'>{passwordError}</p>}
                {emailError && <p className='text-red-600'>{emailError}</p>}
                <Input
                    className={'w-fit text-white font-semibold text-base bg-slate-500 hover:bg-slate-700 hover:shadow-blue-800 shadow-md shadow-blue-950'}
                    type={'submit'}
                    value={'Registrarse'}
                    required
                />
            </form>
        </div>
    )
}
export default CheckIn;