import { useState } from 'react';
import { AllItemsContext } from './Contex';
import { useContext } from 'react';
import { doc, collection, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import Input from './Input';
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import Accepted from "../assets/accept-check.svg"
import Cancel from "../assets/cancel-remove.svg"
import { Textarea } from './ui/textarea';
import chevronDown from "../assets/chevronDown.svg";
import chevronUp from "../assets/chevronUp.svg";
import MainView from './MainView';

const Form = () => {
    const { setValueInputNewTags, valueInputNewTags, userIn, addTags, setButton, temporalCloud, setTemporalCloud, button } = useContext(AllItemsContext);
    const [user, setUser] = useState({ name: '', tags: valueInputNewTags });
    const { toast } = useToast()
    const [amoundPixel, setAmoundPixel] = useState(40);

    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setUser(prev => ({ ...prev, [inputName]: inputValue }));
        if (inputName == 'tags') {
            setValueInputNewTags(inputValue);
        }
    }

    const handleSubmit = async () => {
        event.preventDefault();
        if (user.name) {
            const tagsFinal = user.tags ? user.tags.trim() : button
            try {
                setUser(prev => ({ ...prev, name: '', tags: '' }));
                const arrayItemFilterByTags = [...temporalCloud].filter(item => {// aqui busco todos los items de la misma etiqueta (compras)
                    if (item.tags == tagsFinal) {
                        return item
                    }
                });
                const itemFound = arrayItemFilterByTags.find(element => element.name == user.name) // aqui verifico si el tiem nuevo existe dentro de ese array de etiquetas

                if (itemFound) {// si existe me indica repetido, sino lo agrego a la base detas
                    toast({
                        title: <div className='flex gap-2 items-center justify-center'><span>Repetido</span> <img className='h-8 w-8' src={Cancel} alt="" /></div>,
                        duration: '1000',
                    })
                } else {
                    const itemId = doc(collection(db, 'newId')).id;
                    const itemToMarketList = {
                        userUid: userIn.uid,
                        isDone: false,
                        priority: false,
                        id: itemId,
                        name: user.name.toLowerCase(),
                        tags: tagsFinal,
                        create_at: serverTimestamp(),
                        amount: 0
                    };
                    await setDoc(doc(db, "testlist", itemId), itemToMarketList); //aqui lo agrego a firebase
                    if (user.tags) {
                        await updateDoc(doc(db, "test", userIn.uid), { last_tags: user.tags })
                    }
                    setTemporalCloud(prev => [...prev, { ...itemToMarketList, create_at: new Date() }])
                    setButton(tagsFinal)
                    toast({
                        title: <div className='flex gap-2 items-center justify-center'><span>Agregado</span> <img className='h-8 w-8' src={Accepted} alt="" /></div>,
                        duration: '1000',
                    });

                }
            } catch (error) {
                console.error('Error al realizar la consulta:', error);
            }
        }

    }

    return (
        <div className={userIn ? 'flex flex-col items-center pt-2 gap-2' : 'hidden'}>
            <form className={`flex items-start gap-2 py-2`} onSubmit={handleSubmit}>
                <div className={`relative ease-in-out duration-1000 flex items-start gap-1`} style={{ height: `${amoundPixel}px` }}>
                    <Textarea
                        className={`rounded-md border border-gray-500  focus:border-black focus:border-[3px] focus-visible:ring-0 focus:outline-0 focus:ring-offset-0 focus-visible:ring-offset-0 h-full break-words resize-none pr-8 overflow-hidden ${addTags ? "w-[176px] " : "w-[280px]"}`}
                        type={'text'}
                        name={'name'}
                        onChange={handleInput}
                        onKeyDown={(event) => {
                            if (event.key === 'Enter') {
                                handleSubmit()
                            }
                        }}
                        value={user.name || ''}
                        placeholder={'Item'}
                        required
                    />
                    <div className='h-7 w-7 absolute right-0'>
                        <img className={`mt-[6px] ${amoundPixel > 40 ? 'hidden' : ''}`} onClick={() => setAmoundPixel(prev => prev + 50)} src={chevronDown} alt="" />
                        <div className={`flex flex-col relative ${amoundPixel == 40 ? '-z-20' : ''}`}>
                            <img className={`mt-[6px] h-7 w-7 ${amoundPixel == 40 ? 'opacity-0 blur-3xl' : 'opacity-100 duration-[1000ms]'}`} onClick={() => setAmoundPixel(prev => {
                                if (prev > 40) {
                                    return prev - 50
                                }
                                if (prev == 40) {
                                    return prev
                                }
                            })} src={chevronUp} alt="" />

                            <img className={`mt-[6px] h-7 w-7 ${amoundPixel == 40 ? 'opacity-0 blur-3xl' : 'opacity-100 duration-[1000ms]'}`} onClick={() => setAmoundPixel(prev => {
                                if (amoundPixel < 500) {
                                    return prev + 50
                                } else {
                                    return prev
                                }
                            })} src={chevronDown} alt="" />
                        </div>
                    </div>
                </div>
                <Input
                    type={'text'}
                    name={'tags'}
                    onChange={handleInput}
                    value={valueInputNewTags || ''}
                    placeholder={'Nueva lista'}
                    className={addTags ? 'w-24 text-sm h-10' : 'hidden'}
                    maxLength="25"
                    required
                />
                <Button className="text-[10px] px-2 mt-0.5" type={"submit"}>
                    Agregar
                </Button>
            </form>
            <MainView />
        </div>
    );
}
export default Form;