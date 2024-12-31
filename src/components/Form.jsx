import { useState, useEffect } from 'react';
import { AllItemsContext } from './Contex';
import { useContext } from 'react';
import { arrayUnion, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db2 } from '../utils/firebase';
import MarketList from './MarketList';
import Input from './Input';
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import Accepted from "../assets/accept-check.svg"
import Cancel from "../assets/cancel-remove.svg"
import { Textarea } from './ui/textarea';
import { Timestamp } from 'firebase/firestore';
import chevronDown from "../assets/chevronDown.svg";
import chevronUp from "../assets/chevronUp.svg";

const Form = () => {
    const { setValueInputNewTags, valueInputNewTags, userIn, setList, addTags, setAddTags, button, setButton, selectedTag, setSelectedTag } = useContext(AllItemsContext);
    const [user, setUser] = useState({});
    const { toast } = useToast()
    const [amoundPixel, setAmoundPixel] = useState(40)


    useEffect(() => {
        if (userIn) {
            setUser(prev => ({ ...prev, tags: selectedTag?.length ? button : 'Compras' }));
        } else {
            setUser(prev => ({ ...prev, tags: userIn?.MarkeList?.length ? button : 'Compras' }));
        }
    }, [userIn, button]);

    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setUser(prev => ({ ...prev, [inputName]: inputValue }));
        if (inputValue.length) {
            setValueInputNewTags('')
        }
    }

    const handleSubmit = async () => {
        event.preventDefault();
        if (user.name) {
            try {
                setUser(prev => ({ ...prev, name: '' }));
                const dataUser = await getDocs(query(collection(db2, 'usersMarketList'), where('email', '==', userIn.email)));
                const marketListUser = dataUser.docs[0]?.data().markeList || []
                const listFilterTags = marketListUser.filter(item => item.tags === button)
                const productExists = listFilterTags.some(item => item.tags === user.tags && item.name === user.name.trim());
                if (!productExists) {
                    const date = new Date()
                    setAddTags(false)
                    toast({
                        title: <div className='flex gap-2 items-center justify-center'><span>Agregado</span> <img className='h-8 w-8' src={Accepted} alt="" /></div>,
                        duration: '1000',
                    })
                    setButton(user.tags.trim());
                    const timestamp = Timestamp.fromDate(date);
                    setList(prev => [...prev, { ...user, isDone: false, priority: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim(), create_at: timestamp, amount: 0 }]);
                    setSelectedTag(prev => [...prev, { ...user, isDone: false, priority: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }])
                    const newId = doc(collection(db2, 'newId')).id;
                    await updateDoc(doc(db2, 'usersMarketList', userIn.uid), {
                        last_tags: user.tags.trim(),
                        markeList: arrayUnion({ ...user, tags: user.tags.trim(), isDone: false, id: newId, priority: false, create_at: date, amount: 0 })
                    });
                    await updateDoc(doc(db2, 'usersData', userIn.uid), {
                        last_tags: user.tags.trim(),
                        markeList: arrayUnion({ ...user, tags: user.tags.trim(), isDone: false, id: newId, priority: false, create_at: date, amount: 0 })
                    });


                } else {
                    toast({
                        title: <div className='flex gap-2 items-center justify-center'><span>Repetido</span> <img className='h-8 w-8' src={Cancel} alt="" /></div>,
                        duration: '1000',
                    })
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
                    value={user.tags || '' || valueInputNewTags}
                    placeholder={'Nueva lista'}
                    className={addTags ? 'w-24 text-sm h-10' : 'hidden'}
                    maxLength="25"
                    required
                />
                <Button className="text-[10px] px-2 mt-0.5" type={"submit"}>
                    Agregar
                </Button>
            </form>

            <MarketList userIn={userIn} />
        </div>
    );
}
export default Form;
