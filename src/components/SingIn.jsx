import { useContext, useState } from 'react'
import { Link } from 'react-router-dom';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
import { auth2, db, db2 } from '../utils/firebase';
import { collection, doc, getDocs, setDoc } from 'firebase/firestore';
import { AllItemsContext } from './Contex';

const SingIn = () => {
    const { setUserIn, setLoading } = useContext(AllItemsContext);
    const { toast } = useToast()
    const [user, setUser] = useState({});
    const handleInput = (event) => {
        const inputName = event.target.name;
        setUser(prev => ({ ...prev, [inputName]: event.target.value }));
    }

    const handleSubmit = async () => {
        event.preventDefault();
        try {
            // Intenta iniciar sesión en la nueva BBDD
            await signInWithEmailAndPassword(auth2, user.email, user.password);

            // Si la autenticación en la nueva BBDD fue exitosa
            toast({
                title: <div className='flex gap-2 items-center justify-center'><span>Sesión iniciada correctamente</span></div>,
                duration: '2500',
            });
            window.location.href = '/';
        } catch (error) {
            setLoading(true)
            // de no poder iniciar sesion con el usuario, aquí se revisa en la antigua BBDD
            const dataOldBD = await getDocs(collection(db, 'users4')); //aqui se descarga la antigua BBDD
            const foundUser = dataOldBD.docs.find(doc => doc.data().email === user.email) // aquí se revisa si el usuario existe en la antigua BBDD descargada
            if (foundUser) {
                //si el usuario existe en la antigua base de datos se bebe crear el usuario en el nuevo firebase
                const userToFirebase = { ...foundUser.data(), email: user.email.toLowerCase() };
                await createUserWithEmailAndPassword(auth2, user.email, user.password)
                    .then(async (userCredential) => {
                        const newUser = userCredential.user;
                        delete userToFirebase.password;
                        await setDoc(doc(db2, "usersMarketList", newUser.uid), userToFirebase);
                        await setDoc(doc(db2, "usersData", newUser.uid), userToFirebase);

                        //*********************************************************** */ ESTO ES PARA TRAER Y GUARDAR LA ANTIGUA BASE DE DATOS************************************************************************************************************************************************************
                        const oldBD = await getDocs(collection(db, 'users4'));
                        oldBD.docs.forEach(async docUser => {
                            const newId = doc(collection(db2, 'newId')).id;
                            await setDoc(doc(db2, "oldBD2", newId), docUser.data());
                        });
                        //*********************************************************** */ ESTO ES PARA TRAER Y GUARDAR LA ANTIGUA BASE DE DATOS************************************************************************************************************************************************************
                        setUserIn(userToFirebase)
                    })
                    .catch((error) => {
                        setLoading(false)
                        toast({
                            title: <div className='flex gap-2 items-center justify-center'><span className='text-red-700'>Usuario o contraseña incorrecta</span></div>,
                            duration: '2500',
                        })
                        console.errorCode = error.code;
                        console.errorMessage = error.message;
                    });
            } else {
                toast({
                    title: <div className='flex gap-2 items-center justify-center'><span className='text-red-700'>Usuario o contraseña incorrecta</span></div>,
                    duration: '2500',
                })
            }
        }
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