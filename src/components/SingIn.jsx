import { useState } from 'react'
import { Link } from 'react-router-dom';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import Input from './Input';
import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet"
import { Button } from './ui/button';
import { SheetClose } from './ui/sheet';

// ...

const SingIn = () => {
    const [user, setUser] = useState({});

    const handleInput = (event) => {
        const inputName = event.target.name;
        setUser(prev => ({ ...prev, [inputName]: event.target.value }));
    }

    const handleSubmit = async () => {
        const auth = getAuth();
        signInWithEmailAndPassword(auth, user.email, user.password)
            .then((userCredential) => {
                userCredential.user;
                window.location.href = '/';
            })
            .catch((error) => {
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
                                <SheetClose asChild>
                                    <Button type="submit" onClick={() => handleSubmit()}>Iniciar sesión</Button>
                                </SheetClose>
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
