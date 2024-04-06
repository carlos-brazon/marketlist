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

const Form = () => {
    const { setValueInputNewTags, valueInputNewTags, userIn, setList, addTags, setAddTags, button, setButton, selectedTag, setSelectedTag } = useContext(AllItemsContext);
    const [user, setUser] = useState({});
    const { toast } = useToast()

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
        try {
            const dataUser = await getDocs(query(collection(db2, 'usersMarketList'), where('email', '==', userIn.email)));
            const marketListUser = dataUser.docs[0]?.data().markeList || []
            const listFilterTags = marketListUser.filter(item => item.tags === button)
            const productExists = listFilterTags.some(item => item.tags === user.tags && item.name === user.name.trim());
            if (!productExists) {
                setUser(prev => ({ ...prev, name: '' }));
                setAddTags(false)
                toast({
                    title: <div className='flex gap-2 items-center justify-center'><span>Agregado</span> <img className='h-8 w-8' src={Accepted} alt="" /></div>,
                    duration: '1000',
                })
                setButton(user.tags.trim());
                setList(prev => [...prev, { ...user, isDone: false, priority: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }]);
                setSelectedTag(prev => [...prev, { ...user, isDone: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }])
                const newId = doc(collection(db2, 'dummy')).id;
                await updateDoc(doc(db2, 'usersMarketList', userIn.uid), {
                    markeList: arrayUnion({ ...user, tags: user.tags.trim(), isDone: false, id: newId, priority: false })
                });
                await updateDoc(doc(db2, 'usersData', userIn.uid), {
                    markeList: arrayUnion({ ...user, tags: user.tags.trim(), isDone: false, id: newId, priority: false })
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
    return (
        <div className={userIn ? 'flex flex-col items-center pt-2 gap-2' : 'hidden'}>
            <form className={`flex items-center gap-2 py-2`} onSubmit={handleSubmit}>
                <Input
                    className={'w-44'}
                    type={'text'}
                    name={'name'}
                    onChange={handleInput}
                    value={user.name || ''}
                    placeholder={'Item'}
                    required
                />
                <Input
                    type={'text'}
                    name={'tags'}
                    onChange={handleInput}
                    value={user.tags || '' || valueInputNewTags}
                    placeholder={'Nueva lista'}
                    className={addTags ? 'w-24' : 'hidden'}
                    maxLength="25"
                    required
                />
                <Button type={"submit"}>
                    Agregar
                </Button>
            </form>

            <MarketList userIn={userIn} />
        </div>
    );
}
export default Form;