import { useState } from 'react';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../utils/firebase.js';
import { createUserWithEmailAndPassword, getAuth } from 'firebase/auth';
import { useNavigate } from 'react-router';
import Input from './Input.jsx';
import { Button } from './ui/button.jsx';
const CheckIn = () => {
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [messageLogIn, setMessageLogIn] = useState('');

    const handleInput = (event) => {

        const inputName = event.target.name;
        const inputValue = event.target.value;

        if (inputName === 'email') {
            const cleanedValue = inputValue.replace(/[^a-zA-Z0-9@.\-_]/g, '');
            setUser((prev) => ({ ...prev, [inputName]: cleanedValue }));
            if (cleanedValue.includes('@')) {
                setEmailError(false);
            }
        } else {
            setUser((prev) => ({ ...prev, [inputName]: inputValue }));
        }

        if (inputName === 'password' && inputValue.length < 6) {
            setPasswordError('La contraseña debe tener al menos 6 caracteres.');
        } else {
            setPasswordError('');
        }
    };

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

        const userToFirebase = { ...user, markeList: [], email: user.email.toLowerCase() };

        const auth = getAuth();
        createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                const newUser = userCredential.user;
                delete userToFirebase.password;
                setMessageLogIn('Usuario registrado correctamente');
                showMessage();
                await setDoc(doc(db, "users4", newUser.uid), userToFirebase);
                await setDoc(doc(db, "usersData", newUser.uid), userToFirebase);
            })
            .catch((error) => {
                setMessageLogIn('Error al registrar usuario, inténtalo de nuevo');
                setUser('');
                console.errorCode = error.code;
                console.errorMessage = error.message;
            });
    };

    return (
        <>
            <div className='flex flex-col gap-4 p-3 items-center bg-white rounded-md shadow-md shadow-neutral-700 hover:shadow-lg hover:shadow-neutral-800'>
                <div className='font-semibold text-xl'>Crea tu cuenta</div>
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
                    <div className='min-h-6'>
                        <p>{messageLogIn}</p>
                        {passwordError && <p className='text-red-600'>{passwordError}</p>}
                        {emailError && <p className='text-red-600'>{emailError}</p>}
                    </div>
                    <Button type={'submit'}>Registrarse</Button>
                </form>
            </div>
        </>
    )
}
export default CheckIn;