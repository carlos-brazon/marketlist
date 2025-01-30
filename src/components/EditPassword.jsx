
import { useContext, useState } from "react";
import { AllItemsContext } from "./Contex";
import Input from "./Input";
import { Button } from "./ui/button";
import { cleanInputValueWithNumberOrLetters } from "../utils/util";
import { EmailAuthProvider, getAuth, reauthenticateWithCredential, updatePassword, } from "firebase/auth";
import { Label } from "@/components/ui/label"

const EditPassword = () => {
    const { userIn } = useContext(AllItemsContext);
    const [newValueInput, setNewValueInput] = useState();

    const handlePassworInput = (event) => {
        const inputName = event.target.name;
        let inputValue = cleanInputValueWithNumberOrLetters(event.target.value);
        setNewValueInput(prev => ({ ...prev, [inputName]: inputValue }));
    }

    const handleSubmitPassword = async () => {
        event.preventDefault();
        setNewValueInput({})
        const auth = getAuth();
        const user = auth.currentUser;
        const credential = EmailAuthProvider.credential(userIn.email, newValueInput.password);
        await reauthenticateWithCredential(user, credential).then(async () => {
            const newPassword = newValueInput.new_pass
            if (newValueInput.new_pass === newValueInput.new_pass_verify) {

                await updatePassword(user, newPassword).then(() => {
                    console.log('contraseña actualizada');

                }).catch((error) => {
                    console.log('error al actualizar la contraseña', error);
                });
            } else {
                console.log('la contraseña no coinciden');
            }

        }).catch((error) => {
            console.log('No se pudo autenticar la contraseña', error);
        });
    }
    return (
        <form className='flex flex-col gap-2 items-center' onSubmit={handleSubmitPassword}>
            <div className='flex flex-col gap-3'>

                <div className="flex flex-col gap-1">
                    <Label htmlFor="password">Contraseña Actual</Label>
                    <Input
                        className={`w-56`}
                        type={'true'.length ? 'password' : 'text'}
                        name={'password'}
                        onChange={handlePassworInput}
                        value={newValueInput?.password || ''}
                        placeholder={'Contraseña Actual'}
                        minLength={'6'}

                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="new_pass">Nueva Contraseña</Label>
                    <Input
                        className={`w-56 ${newValueInput?.new_pass === newValueInput?.new_pass_verify && newValueInput?.new_pass?.length ? 'border-green-700 focus:outline-green-700 border-[2px]' : ''}`}
                        type={'password'}
                        name={'new_pass'}
                        onChange={handlePassworInput}
                        value={newValueInput?.new_pass || ''}
                        placeholder={'Nueva contraseña'}
                        minLength={'6'}

                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="nnew_pass_verify">Repetir Contraseña</Label>
                    <Input
                        className={`w-56 ${newValueInput?.new_pass === newValueInput?.new_pass_verify && newValueInput?.new_pass_verify?.length ? 'border-green-700 focus:outline-green-700 border-[2px]' : ''}`}
                        type={'password'}
                        name={'new_pass_verify'}

                        onChange={handlePassworInput}
                        value={newValueInput?.new_pass_verify || ''}
                        placeholder={'Repetir contraseña'}
                        minLength={'6'}

                    />
                </div>
            </div>
            <Button type={'submit'}>Actualizar Contraseña</Button>
        </form>
    )
}

export default EditPassword