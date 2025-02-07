import { useState } from 'react';
import { Link } from 'react-router-dom';
import { EmailAuthProvider, GoogleAuthProvider, linkWithCredential, signInWithEmailAndPassword, signInWithPopup, updatePassword } from 'firebase/auth';
import Input from './Input';

import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import { auth, db } from '../utils/firebase';
import googleIcon from "../assets/google-icon.svg";
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { defaultSuperListImg } from '../utils/util';
import emailjs from "emailjs-com";
import { emailjsConfig } from '../utils/emailjsConfig';

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

    const RamdomPassword = () => Math.random().toString(36).slice(-8);
    const singInGoogle = async () => {
        const provider = new GoogleAuthProvider();


        signInWithPopup(auth, provider)
            .then(async (result) => {
                const userLogged = result.user
                try {
                    const userSnap = await getDoc(doc(db, "userMarketList", userLogged.uid));
                    // Aquí compruebo si el usuario existe, sino existe entra el if
                    if (!userSnap.exists()) {
                        const userId = doc(collection(db, 'newId')).id;
                        const newUserToFirebase = {
                            addControl: false,
                            control_items: false,
                            create_at: serverTimestamp(),
                            cropp_pixel: {},
                            email: userLogged.email.toLowerCase(),
                            id: userId,
                            isDateControl: false,
                            isDoneControl: false,
                            isEditControl: false,
                            last_name: userLogged.displayName.split(" ")[1].toLowerCase(),
                            last_tags: 'compras',
                            name_: userLogged.displayName.split(" ")[0].toLowerCase(),
                            orderByDone: false,
                            orderByUrgent: false,
                            sortAscending: false,
                            super_list_img_selected: false,
                            tem_pass: '',
                            url_img_super_list: defaultSuperListImg,
                            url_img_google: userLogged.providerData[0].photoURL,
                        }
                        const newPasswordToSingIn = RamdomPassword();
                        const credential = EmailAuthProvider.credential(userLogged.email, newPasswordToSingIn);
                        await linkWithCredential(userLogged, credential);
                        await updatePassword(userLogged, newPasswordToSingIn);

                        // envio de contraseña
                        const sendEmail = (userEmail, password, user_name, user_last_name) => {
                            emailjs.send(
                                emailjsConfig.serviceId,
                                emailjsConfig.templateId,
                                {
                                    user_email: userEmail,
                                    user_password: password,
                                    name: user_name,
                                    last_name: user_last_name,
                                },
                                emailjsConfig.userIdPublic
                            ).then(response => {
                                console.log("Correo enviado con éxito:", response);
                            }).catch(error => {
                                console.error("Error enviando el correo:", error);
                            });
                        };
                        await sendEmail(userLogged.email, newPasswordToSingIn, userLogged.displayName.split(" ")[0].toLowerCase(), userLogged.displayName.split(" ")[1].toLowerCase());
                    } else {
                        //si el usuario ya existe 
                        const updateSingInUserToFirebase = {
                            ...userSnap.data(),
                            url_img_google: userLogged.providerData[0].photoURL,
                        }
                        await setDoc(doc(db, "userMarketList", userLogged.uid), updateSingInUserToFirebase);
                    }
                    window.location.href = "/";

                } catch (error) {
                    console.error("Error en el inicio de sesión con Google:", error);
                }


            })
            .catch((error) => {
                console.error("Error:", error.code);
                console.error("Error:", error.message);
            });

    };
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
            <Button
                variant="outline"
                className="w-fit flex gap-1 h-8 px-2 py-1"
                onClick={() => setControlSingIn(prev => !prev)}
            >
                <p className="">Iniciar sesión con correo y contraseña</p>

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