import { useState, useEffect } from 'react';
import { AllItemsContext } from './Contex';
import { useContext } from 'react';
import { arrayUnion, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import MarketList from './MarketList';
import Input from './Input';
import { Button } from './ui/button';
import { useToast } from "@/components/ui/use-toast"
import Accepted from "../assets/accept-check.svg"
import Cancel from "../assets/cancel-remove.svg"


const Form = () => {
    const { userIn, setList, controltags, button, setButton, list, setSelectedTag } = useContext(AllItemsContext);
    const [user, setUser] = useState({});
    const { toast } = useToast()

    useEffect(() => {
        setUser(prev => ({ ...prev, tags: list?.length ? button : 'Compras' }));
    }, [button]);



    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = event.target.value;
        setUser(prev => ({ ...prev, [inputName]: inputValue }));
    }

    const handleSubmit = async () => {
        event.preventDefault();

        try {
            const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
            const market = querySnapshot.docs[0]?.data().markeList || []
            const productExists = market.some(item => item.name === user.name.trim());

            if (!productExists) {
                setUser(prev => ({ ...prev, name: '' }));
                setList(prev => [...prev, { ...user, isDone: false, priority: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }]);
                setSelectedTag(prev => [...prev, { ...user, isDone: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }])
                toast({
                    title: <div className='flex gap-2 items-center justify-center'><span>Agregado</span> <img className='h-8 w-8' src={Accepted} alt="" /></div>,
                    duration: '1000',
                })
                const newId = doc(collection(db, 'dummy')).id;
                await updateDoc(doc(db, 'users4', userIn.uid), {
                    markeList: arrayUnion({ ...user, tags: user.tags.trim(), isDone: false, id: newId, priority: false })
                });

                setButton(user.tags.trim());
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
            <form className={`flex items-center gap-2`} onSubmit={handleSubmit}>
                <Input
                    className={'w-28'}
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
                    value={user.tags || ''}
                    placeholder={'Nueva lista'}
                    className={controltags ? 'w-28' : 'hidden'}
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