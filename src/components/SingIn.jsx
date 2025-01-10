import { useState } from 'react'
import { Link } from 'react-router-dom';
import { signInWithEmailAndPassword } from 'firebase/auth';
import Input from './Input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
    SheetClose
} from "@/components/ui/sheet"
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import { auth } from '../utils/firebase';

const SingIn = () => {
    const { toast } = useToast()
    const [user, setUser] = useState({});
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
        <Sheet>
            <SheetTrigger asChild><Button variant='secondary'> Iniciar sesión</Button></SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Inicia sesión en MarketList</SheetTitle>
                    <SheetDescription asChild>
                        <div className={`flex flex-col gap-4 items-center`}>
                            <form className='flex flex-col gap-2 items-center justify-center'>
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
                                <Button type="submit" onClick={() => handleSubmit()}>Iniciar sesión</Button>
                            </form>

                            <Link to={'/checkIn'} className='font-normal text-sm leading-4'>
                                Si no estás registrado{' '}
                                <SheetClose className='font-semibold text-sm leading-4 underline' >
                                    pulsa aquí
                                </SheetClose>
                            </Link>
                        </div>
                    </SheetDescription>
                </SheetHeader>
            </SheetContent>
        </Sheet>
    )
}

export default SingIn;