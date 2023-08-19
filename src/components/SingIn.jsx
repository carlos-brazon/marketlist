import React, { useState } from 'react'
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const SingIn = ({ userIn}) => {
    const [user, setUser] = useState({});
     const history = useNavigate(); // Importa useNavigate
     console.log(useNavigate('/'));

    const handleInput = () => {
        const inputName = event.target.name;
        setUser(prev => ({ ...prev, [inputName]: event.target.value }));
    }
    const handleSubmit = async () => {
        event.preventDefault();

        const auth = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                const user = userCredential.user;
                console.log(user);
                console.log(auth);
            })
            .catch((error) => {
                const errorCode = error.code;
                const errorMessage = error.message;
            });
            history('/', {replace: true});
        }

    return (
        <div className={`flex flex-col gap-4 p-3 items-center ${userIn ? '': ''}`}>
            <form className='flex gap-2 p-3' onSubmit={handleSubmit}>
                <input className='border p-2' type="text" name='email' onChange={handleInput} value={user.email || ''} placeholder='email' />
                <input className='border p-2' type="password" name='password' minLength="6" onChange={handleInput} value={user.password || ''} placeholder='password' />
                <input className='border p-2' type="submit" value={'Iniciar sesión'} />
            </form>
            <p className='font-normal text-sm leading-4'>Sino estás registrado <Link className='font-semibold text-sm leading-4 underline' to={'/CheckIn'}> pulsa aquí </Link></p>
        </div>
    )
}

export default SingIn