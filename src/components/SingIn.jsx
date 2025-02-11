import { Link } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Input from './Input';
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import { auth } from '../utils/firebase';
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";
import SingInGoogle from './SingInGoogle';

const SingIn = () => {
    const [eyeControl, setEyeControl] = useState(true);
    const { toast } = useToast()
    const [user, setUser] = useState({});
    const [controlSingIn, setControlSingIn] = useState(false);

    const handleInput = (event) => {
        const inputName = event.target.name;
        setUser(prev => ({ ...prev, [inputName]: event.target.value }));
    }

    const handleSubmit = async () => {
        event.preventDefault();
        await signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                toast({
                    title: <div className='flex gap-2 items-center justify-center'><span className='text-green-700'>Sesión iniciada correctamente</span></div>,
                    duration: '2500',
                })
                userCredential.user;
                window.location.href = '/';
            })
            .catch((error) => {
                toast({
                    title: <div className='flex gap-2 items-center justify-center'><span className='text-red-700'>Usuario o contraseña incorrecta</span></div>,
                    duration: '2500',
                })
                console.errorCode = error.code;
                console.errorMessage = error.message;
            });
    }

    return (
        <>
            <div>Inicia sesión en MarketList</div>
            <SingInGoogle />
            <Button
                variant="outline"
                className="w-fit flex gap-1 h-8 px-2 py-1"
                onClick={() => setControlSingIn(prev => !prev)}
            >
                <p>Iniciar sesión con correo y contraseña</p>

            </Button>
            <div >
                <div className={`flex flex-col gap-4 items-center`}>
                    <form className={`flex flex-col gap-2 items-center justify-center ${controlSingIn || "hidden"}`}>
                        <Input
                            type={'text'}
                            name={'email'}
                            onChange={handleInput}
                            value={user.email || ''}
                            placeholder={'Email'}
                            className={'w-64'}
                            required
                        />
                        <div className=" relative flex flex-col gap-1">

                            <Input
                                type={eyeControl ? 'password' : 'text'}
                                name={'password'}
                                onChange={handleInput}
                                value={user.password || ''}
                                placeholder={'Password'}
                                minLength={6}
                                className={'w-64'}
                                required
                            />
                            <img onClick={() => setEyeControl(prev => !prev)} className="w-6 h-6 absolute right-2 top-3" src={eyeControl ? eyeOpen : eyeClosed} alt="" />
                        </div>
                        <Button type="submit" onClick={() => handleSubmit()}>Iniciar sesión</Button>
                    </form>

                    <div className='font-normal text-sm leading-4'>
                        Si no estás registrado{' '}
                        <Link to={'/checkIn'} className='font-semibold text-sm leading-4 underline' >
                            pulsa aquí
                        </Link>
                    </div>
                </div>
            </div>
        </>



    )
}

export default SingIn;