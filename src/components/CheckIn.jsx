import { useState } from 'react';
import { collection, doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { auth, db } from '../utils/firebase.js';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { useNavigate } from 'react-router';
import Input from './Input.jsx';
import { Button } from './ui/button.jsx';
import { defaultSuperListImg } from '../utils/util.js';
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";

const CheckIn = () => {
    const history = useNavigate();
    const [user, setUser] = useState({});
    const [passwordError, setPasswordError] = useState('');
    const [emailError, setEmailError] = useState('');
    const [messageLogIn, setMessageLogIn] = useState('');
    const [eyeControl, setEyeControl] = useState(true);

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
        setUser({})
        if (!user.email || !user.email.includes('@')) {
            setEmailError('Formato de correo invalido, debe contener @.');
            return;
        }

        const userId = doc(collection(db, 'newId')).id;
        const userToFirebase = {
            addControl: false,
            control_items: false,
            create_at: serverTimestamp(),
            cropp_pixel: {},
            email: user.email.toLowerCase(),
            id: userId,
            isDateControl: false,
            isDoneControl: false,
            isEditControl: false,
            last_name: user.last_name.toLowerCase(),
            last_tags: 'compras',
            name_: user.name_.toLowerCase(),
            orderByDone: false,
            orderByUrgent: false,
            sortAscending: false,
            super_list_img_selected: true,
            tem_pass: '',
            url_img_super_list: defaultSuperListImg,
            url_img_google: '',

        };

        setMessageLogIn('Usuario registrado correctamente');
        createUserWithEmailAndPassword(auth, user.email, user.password)
            .then(async (userCredential) => {
                const newUser = userCredential.user;
                await setDoc(doc(db, "userMarketList", newUser.uid), { ...userToFirebase, url_img_google: newUser.providerData[0]?.photoURL })
                history('/', { replace: true });
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
                            name={'name_'}
                            onChange={handleInput}
                            value={user.name_ || ''}
                            placeholder={'Nombre'}
                            required
                        />
                        <Input
                            className={'w-28'}
                            type={'text'}
                            name={'last_name'}
                            onChange={handleInput}
                            value={user.last_name || ''}
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

                    <div className=" relative flex flex-col gap-1">
                        <Input
                            className={'w-[232px]'}
                            type={eyeControl ? 'password' : 'text'}
                            name={'password'}
                            onChange={handleInput}
                            value={user.password || ''}
                            placeholder={'Establecer contraseña'}
                            minLength={'6'}
                            required
                        />
                        <img onClick={() => setEyeControl(prev => !prev)} className="w-6 h-6 absolute right-2 top-3" src={eyeControl ? eyeOpen : eyeClosed} alt="" />
                    </div>
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