
import { useContext, useState } from 'react';
import { cleanInputValueWithNumberOrLetters, firstLetterUpperCase } from '../utils/util'
import Input from './Input'
import { Label } from "@/components/ui/label"
import { AllItemsContext } from './Contex';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Button } from './ui/button';


const EditProfile = () => {
    const { userIn, setUserIn } = useContext(AllItemsContext);
    const [newValueInput, setNewValueInput] = useState({ name_: userIn.name_, last_name: userIn.last_name });
    const handleInputProfile = (event) => {
        const inputName = event.target.name;
        let inputValue = cleanInputValueWithNumberOrLetters(event.target.value);
        setNewValueInput(prev => ({ ...prev, [inputName]: inputValue }));
    }
    const handleSubmitProfile = async () => {
        event.preventDefault();
        const finalValue = { name_: newValueInput.name_.toLowerCase(), last_name: newValueInput.last_name.toLowerCase() };
        try {
            await updateDoc(doc(db, "userMarketList", userIn.uid), finalValue);
            setUserIn(prev => ({ ...prev, ...finalValue }))
        } catch (error) {
            console.log("No se pudo actualizar el usuario", error);
        }
    }
    return (
        <form className='flex flex-col gap-2 items-center' onSubmit={handleSubmitProfile}>
            <div className='flex flex-col gap-3'>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="name_">Nombre</Label>
                    <Input
                        className={'w-56'}
                        type={'text'}
                        name={'name_'}
                        onChange={handleInputProfile}
                        value={firstLetterUpperCase(newValueInput?.name_) || ''}
                        placeholder={'Nombre'}
                        required
                    />
                </div>
                <div className="flex flex-col gap-1">
                    <Label htmlFor="email">Apellido</Label>
                    <Input
                        className={'w-56'}
                        type={'text'}
                        name={'last_name'}
                        onChange={handleInputProfile}
                        value={firstLetterUpperCase(newValueInput?.last_name) || ''}
                        placeholder={'Apellido'}
                        required
                    />
                </div>
            </div >
            <Button type={'submit'}>Guardar cambios</Button>
        </form>
    )
}

export default EditProfile