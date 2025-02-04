import { useContext, useState } from 'react';
import { Link } from 'react-router-dom';
import { EmailAuthProvider, getAuth, GoogleAuthProvider, linkWithCredential, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import Input from './Input';

import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import { auth, db } from '../utils/firebase';
import googleIcon from "../assets/google-icon.svg";
import { AllItemsContext } from './Contex';
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';

const SingIn = () => {
    const { userIn, setUserIn } = useContext(AllItemsContext);
    const [eyeControl, setEyeControl] = useState(true);
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

    const RamdomPassword = () => Math.random().toString(36).slice(-8);
    const singInGoogle = async () => {
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            console.log(user);

            // Verificar si el usuario ya existe en Firestore
            const userSnap = await getDoc(doc(db, "userMarketList", user.uid));
            // Usuario nuevo,
            const userId = doc(collection(db, 'newId')).id;
            const userToFirebase = {
                addControl: false,
                control_items: false,
                create_at: serverTimestamp(),
                email: user.email.toLowerCase(),
                id: userId,
                isDateControl: false,
                isDoneControl: false,
                isEditControl: false,
                last_name: user.displayName.split(" ")[1].toLowerCase(),
                last_tags: 'compras',
                last_url: user.providerData[0].photoURL,
                name_: user.displayName.split(" ")[0].toLowerCase(),
                orderByDone: false,
                orderByUrgent: false,
                sortAscending: false,
            }

            if (!userSnap.exists()) {
                const newPasswordToSingIn = RamdomPassword();
                console.log("Usuario nuevo registrado con Google.");
                console.log("Contraseña generada:", newPasswordToSingIn);

                // Puedes enviar la contraseña al email del usuario o mostrarla en la UI 

                const credential = EmailAuthProvider.credential(user.email, newPasswordToSingIn);

                await linkWithCredential(user, credential);
                console.log("Cuenta vinculada con email y contraseña correctamente.");
                console.log("Contraseña generada:", newPasswordToSingIn);
            }

            // Redirigir al usuario después del inicio de sesión
            await setDoc(doc(db, "userMarketList", user.uid), userToFirebase);
            setUserIn(userToFirebase)
            // window.location.href = "/";
        } catch (error) {
            console.error("Error en el inicio de sesión con Google:", error);
        }
        // const auth = getAuth();
        // const provider = new GoogleAuthProvider();

        // signInWithPopup(auth, provider)
        //     .then(async (result) => {
        //         const data = {
        //             firstName: result._tokenResponse.firstName,
        //             lastName: result._tokenResponse.lastName,
        //             email: result._tokenResponse.email,
        //             photo: result._tokenResponse.photoUrl,
        //         };
        //         // await setDoc(doc(db, "users-numbers", result.user.uid), data);
        //         // setUserIn(data);
        //         window.location.href = '/';
        //         // This gives you a Google Access Token. You can use it to access the Google API.
        //         const credential = GoogleAuthProvider.credentialFromResult(result);
        //         const token = credential.accessToken;
        //         // The signed-in user info.
        //         const user = result.user;
        //         console.log(user);

        //         // IdP data available using getAdditionalUserInfo(result)
        //         // ...
        //     })
        //     .catch((error) => {
        //         console.log('aquie esta el erro:', error);

        //         // Handle Errors here.
        //         const errorCode = error.code;
        //         const errorMessage = error.message;
        //         // The email of the user's account used.
        //         const email = error.customData?.email;
        //         // The AuthCredential type that was used.
        //         const credential = GoogleAuthProvider.credentialFromError(error);
        //         // ...
        //     });
    };

    console.log(userIn);

    return (
        <>

            <div>Inicia sesión en MarketList</div>
            <Button
                variant="outline"
                className="w-fit flex gap-1 h-8 px-2 py-1"
                onClick={() => singInGoogle()}
            >
                <p className="bg-gradient-to-r from-blue-700 via-red-700 via-yellow-700 to-green-700 bg-clip-text text-transparent">Iniciar sesión con Google</p>
                <img className="w-5 h-5" src={googleIcon} alt="" />
            </Button>
            <div >
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
                            <img onClick={() => setEyeControl(prev => !prev)} className="w-6 h-6 absolute right-2 top-3" src={eyeControl ? eyeClosed : eyeOpen} alt="" />
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