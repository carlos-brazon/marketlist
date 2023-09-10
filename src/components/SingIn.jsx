import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Input from './Input';

const SingIn = () => {
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [messageLogIn, setMessageLogIn] = useState('')

    const handleInput = () => {
        const inputName = event.target.name;
        setUser(prev => ({ ...prev, [inputName]: event.target.value }));
    }
    const handleSubmit = async () => {
        event.preventDefault();
        
        const showMessage = () => {
            setTimeout(() => {
              history('/', { replace: true });
            }, 2000);
          };
        const auth = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                const user = userCredential.user;
                setMessageLogIn('Sesión iniciada correctamente');
                showMessage()
            })
            .catch((error) => {
                setMessageLogIn('Usuario no registrado');
                const errorCode = error.code;
                const errorMessage = error.message;
            });
    }

    return (
        <div className={`flex flex-col gap-4 p-3 items-center`}>
            <form className='flex flex-col gap-2 p-3 items-center justify-center' onSubmit={handleSubmit}>
                <Input
                    type={'text'}
                    name={'email'}
                    onChange={handleInput}
                    value={user.email || ''}
                    placeholder={'Email'}
                    className={'w-64'}
                    required
                />
                <Input
                    type={'password'}
                    name={'password'}
                    onChange={handleInput}
                    value={user.password || ''}
                    placeholder={'Password'}
                    minLength={6}
                    className={'w-64'}
                    required
                />
                <Input
                    className={'w-fit text-white font-semibold text-base bg-slate-500 hover:bg-slate-700 hover:shadow-blue-800 shadow-md shadow-blue-950'}
                    type={'submit'}
                    value={'Iniciar sesión'}
                    required
                />
            </form>
            <p>{messageLogIn}</p>
            <p className='font-normal text-sm leading-4'>Si no estás registrado <Link className='font-semibold text-sm leading-4 underline' to={'/CheckIn'}> pulsa aquí </Link></p>
        </div>
    )
}
export default SingIn