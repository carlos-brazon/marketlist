import { useContext, useState } from "react";
import { AllItemsContext } from "./Contex";
import Input from "./Input";
import { Button } from "./ui/button";
import { cleanInputValueWithNumberOrLetters } from "../utils/util";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, sendPasswordResetEmail, updatePassword, } from "firebase/auth";
import { Label } from "@/components/ui/label"
import eyeOpen from "../assets/eye-open.svg";
import eyeClosed from "../assets/eye-closed.svg";
import { useToast } from "@/components/ui/use-toast"
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../utils/firebase";

const EditPassword = () => {
    const { userIn, setUserIn } = useContext(AllItemsContext);
    const [newValueInput, setNewValueInput] = useState();
    const [loading, setLoading] = useState(false);
    const [eyeControl, setEyeControl] = useState({ password: true, new_pass: true, new_pass_verify: true });
    const { toast } = useToast()

    const handlePassworInput = (event) => {
        const inputName = event.target.name;
        let inputValue = cleanInputValueWithNumberOrLetters(event.target.value);
        setNewValueInput(prev => ({ ...prev, [inputName]: inputValue }));
    }

    const handleSubmitPassword = async () => {
        event.preventDefault();

        if (newValueInput.new_pass != newValueInput.new_pass_verify) {
            toast({
                title: <span className='text-red-700'>Las contraseñas no coinciden</span>,
                duration: '1200',
            })
            return
        }
        setLoading(true);
        try {
            const auth = getAuth();
            const user = auth.currentUser;
            const credential = EmailAuthProvider.credential(userIn.email, newValueInput.password);

            await reauthenticateWithCredential(user, credential);
            await updatePassword(user, newValueInput.new_pass);
            await updateDoc(doc(db, "userMarketList", userIn.uid), { tem_pass: '' })
            setUserIn(prev => ({ ...prev, tem_pass: '' }))
            setLoading(false)
            toast({
                title: <span className='text-green-700'>Contraseña actualizada con éxito</span>,
                duration: '1500',
            })
            setNewValueInput({});
        } catch (error) {
            console.error("Error al actualizar la contraseña:", error);
            toast({
                title: <span className='text-red-700'>No se pudo actualizar la contraseña. Verifica tu contraseña actual.</span>,
                duration: '2000',
            })
        } finally {
            setLoading(false);
        }
    }
    const handleForgotPassword = () => {
        const auth = getAuth();
        sendPasswordResetEmail(auth, userIn.email)
            .then(() => {
                toast({
                    title: <span className='text-red-700'>Se ha enviado un email con instrucciones para restablecer tu contraseña..</span>,
                    duration: '2000',
                })
            })
            .catch((error) => {
                console.log(error.code);
                console.log(error.message);
            });
    }

    return (
        loading
            ? <div className='flex flex-col h-60 items-center justify-center'>
                < div className="lds-default" >
                    <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
                </div >
            </div > : <form className='flex flex-col gap-2 items-center justify-center' onSubmit={handleSubmitPassword}>
                <div className='flex flex-col gap-3'>

                    <div className=" relative flex flex-col gap-1 px-2">
                        <Label htmlFor="password">Contraseña Actual</Label>
                        <Input
                            className={`w-full`}
                            type={eyeControl.password ? 'password' : 'text'}
                            name={'password'}
                            onChange={handlePassworInput}
                            value={userIn?.tem_pass?.length ? userIn.tem_pass : newValueInput?.password || ''}
                            placeholder={'Contraseña Actual'}
                            minLength={'6'}
                        />
                        <img onClick={() => setEyeControl(prev => ({ ...prev, password: !eyeControl.password }))} className="w-6 h-6 absolute right-4 top-7" src={eyeControl.password ? eyeOpen : eyeClosed} alt="" />
                    </div>
                    <p className={`text-red-600 font-medium ${userIn?.tem_pass?.length ? '' : 'hidden'}`}>Cambia tu contraseña temporal por una personal</p>
                    <div className=" relative flex flex-col gap-1 px-2">
                        <Label htmlFor="new_pass">Nueva Contraseña</Label>
                        <Input
                            className={`w-full ${newValueInput?.new_pass === newValueInput?.new_pass_verify && newValueInput?.new_pass?.length ? 'border-green-700 focus:outline-green-700 border-[2px]' : ''}`}
                            type={eyeControl.new_pass ? 'password' : 'text'}
                            name={'new_pass'}
                            onChange={handlePassworInput}
                            value={newValueInput?.new_pass || ''}
                            placeholder={'Nueva contraseña'}
                            minLength={'6'}
                        />
                        <img onClick={() => setEyeControl(prev => ({ ...prev, new_pass: !eyeControl.new_pass }))} className="w-6 h-6 absolute right-4 top-7" src={eyeControl.new_pass ? eyeOpen : eyeClosed} alt="" />
                    </div>
                    <div className="relative flex flex-col gap-1 px-2">
                        <Label htmlFor="nnew_pass_verify">Repetir Contraseña</Label>
                        <Input
                            className={`w-full ${newValueInput?.new_pass === newValueInput?.new_pass_verify && newValueInput?.new_pass_verify?.length ? 'border-green-700 focus:outline-green-700 border-[2px]' : ''}`}
                            type={eyeControl.new_pass_verify ? 'password' : 'text'}
                            name={'new_pass_verify'}
                            onChange={handlePassworInput}
                            value={newValueInput?.new_pass_verify || ''}
                            placeholder={'Repetir contraseña'}
                            minLength={'6'}
                        />
                        <img onClick={() => setEyeControl(prev => ({ ...prev, new_pass_verify: !eyeControl.new_pass_verify }))} className="w-6 h-6 absolute right-4 top-7" src={eyeControl.new_pass_verify ? eyeOpen : eyeClosed} alt="" />
                    </div>
                </div>
                <Button type={'submit'}>Actualizar Contraseña</Button>
                <div className="w-64 md:w-full text-sm mt-1 text-center">
                    ¿Olvidaste tu contraseña? Pulsa {" "}
                    <span className="cursor-pointer font-medium text-blue-600 underline" onClick={handleForgotPassword}>aquí</span>
                    {" "} para recibir un email y restablecerla.
                </div>
            </form>
    )
}

export default EditPassword