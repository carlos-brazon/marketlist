import React, { useState, useEffect } from 'react';
import { AllItemsContext } from './Contex';
import { useContext } from 'react';
import { arrayUnion, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import MarketList from './MarketList';
import Input from './Input';

const Form = () => {
    const { userIn, setList, controltags, button, setButton, list, setSelectedTag } = useContext(AllItemsContext);
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('');

    useEffect(() => {
        setUser(prev => ({ ...prev, tags: list?.length ? button : 'Compras' }));
    }, [button]);

    const showMessage = (text) => {
        setMessage(text);
        setTimeout(() => {
            setMessage('');
        }, 2000);
    };

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
                console.log(user);
                setList(prev => [...prev, { ...user, isDone: false, priority: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }].sort((a, b) => a.name.localeCompare(b.name)));
                setSelectedTag(prev => [...prev, { ...user, isDone: false, id: newId, name: user.name.toLowerCase(), tags: user.tags.trim() }].sort((a, b) => a.name.localeCompare(b.name)));
                showMessage('Agregado');
                const newId = doc(collection(db, 'dummy')).id;
                await updateDoc(doc(db, 'users4', userIn.uid), {
                    markeList: arrayUnion({ ...user, tags: user.tags.trim(), isDone: false, id: newId, priority: false })
                });

                setButton(user.tags.trim());
            } else {
                showMessage('Repetido');
            }
        } catch (error) {
            console.error('Error al realizar la consulta:', error);
        }
    }

    return (
        <div className={userIn ? 'flex flex-col items-center pt-2 gap-2' : 'hidden'}>
            <form className={`flex items-center gap-2 ${controltags ? '' : ''}`} onSubmit={handleSubmit}>
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
                <Input
                    className={'w-20 px-1 h-9 py-0 text-white font-semibold text-base bg-slate-500 hover:bg-slate-700 hover:shadow-blue-800 shadow-md shadow-blue-950'}
                    type={'submit'}
                    value={'Agregar'}
                    required
                />
            </form>
            <div>
                <p className={`h-9 rounded flex w-fit items-center ${message.includes('Agregado') ? 'bg-green-500 p-1' : message.includes('Repetido') ? 'bg-red-700 text-white p-1' : ''}`}>{message}</p>
            </div>
            <MarketList userIn={userIn} />
        </div>
    );
}
export default Form;