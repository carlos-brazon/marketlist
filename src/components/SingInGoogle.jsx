import googleIcon from "../assets/google-icon.svg";
import { collection, doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import emailjs from "emailjs-com";
import { emailjsConfig } from '../utils/emailjsConfig';
import { AllItemsContext } from './Contex';
import { useNavigate } from "react-router-dom";
import { useContext } from 'react';
import { EmailAuthProvider, GoogleAuthProvider, linkWithCredential, signInWithPopup, updatePassword } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { Button } from "./ui/button";


const SingInGoogle = () => {
    const { setLoadingSingIn, setLoading, setUserIn } = useContext(AllItemsContext)
    const navigate = useNavigate();

    const RamdomPassword = () => Math.random().toString(36).slice(-8);
    const singInGoogle = async () => {
        const provider = new GoogleAuthProvider();

        signInWithPopup(auth, provider)
            .then(async (result) => {
                setLoading(true);
                setLoadingSingIn(false);
                const userLogged = result.user
                try {
                    const userSnap = await getDoc(doc(db, "userMarketList", userLogged.uid));
                    // Aquí compruebo si el usuario existe, sino existe entra el if
                    await navigate("/", { replace: true });
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
                            tem_pass: "",
                            url_img_super_list: '',
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
                        await setDoc(doc(db, "userMarketList", userLogged.uid), { ...newUserToFirebase, tem_pass: newPasswordToSingIn });
                        sendEmail(userLogged.email, newPasswordToSingIn, userLogged.displayName.split(" ")[0].toLowerCase(), userLogged.displayName.split(" ")[1].toLowerCase());
                        setUserIn({ ...newUserToFirebase, uid: userLogged.uid, tem_pass: newPasswordToSingIn })
                    } else {
                        //si el usuario ya existe
                        const updateSingInUserToFirebase = {
                            ...userSnap.data(),
                            url_img_google: userLogged.providerData[0].photoURL,
                        }
                        await setDoc(doc(db, "userMarketList", userLogged.uid), updateSingInUserToFirebase);
                    }
                } catch (error) {
                    console.error("Error en el inicio de sesión con Google:", error);
                }
            })
            .catch((error) => {
                console.error("Error:", error.code);
                console.error("Error:", error.message);
            });
        setLoadingSingIn(true);
    };
    return (
        <div>
            <Button
                variant="outline"
                className="w-fit flex gap-1 h-8 px-2 py-1"
                onClick={() => singInGoogle()}
            >
                <p className="bg-[linear-gradient(to_right,#4285F4,#EA4335,#FBBC05,#34A853)] bg-clip-text text-transparent">
                    Iniciar sesión con Google
                </p>
                <img className="w-5 h-5" src={googleIcon} alt="" />
            </Button>
        </div>
    )
}

export default SingInGoogle