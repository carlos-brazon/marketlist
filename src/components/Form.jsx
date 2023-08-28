import React, { useState } from 'react'
import { AllItemsContext } from './Contex';
import { useContext } from 'react';
import { arrayUnion, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import MarketList from './MarketList';
import Input from './Input';

const Form = ({ userIn }) => {
    const { setList, controltags, setButton, marketData } = useContext(AllItemsContext);
    const [user, setUser] = useState({});
    const [message, setMessage] = useState('')

    const showMessage = (text, duration) => {
        setMessage(text);
        setTimeout(() => {
            setMessage('');
        }, duration);
    };

    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = (event.target.value)
        setUser(prev => ({ ...prev, [inputName]: inputValue }));
    }
    const handleSubmit = async () => {
        event.preventDefault();

        const newProductName = user.name;
        try {
            const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
            const market = querySnapshot.docs[0]?.data().markeList || []
            const productExists = market.some(item => item.name === newProductName);

            if (!productExists) {
                console.log(controltags);
                const newId = doc(collection(db, 'dummy')).id;
                setList(prev => [...prev, { ...user, isDone: false, id: newId, name: user.name.toLowerCase() }])
                await updateDoc(doc(db, 'users4', userIn.uid), {
                    markeList: arrayUnion({ ...user, isDone: false, id: newId, tags: controltags ? user.tags : 'Compras'})
                });
                showMessage('Agregado', 2000)

            } else {
                showMessage('Repetido', 2000)

            }
        } catch (error) {
            console.error('Error al realizar la consulta:', error);
        }
        setUser(prev => ({ ...prev, name: '', tags: controltags ? user.tags : '' }));
        setButton(controltags ? user.tags : 'Compras')
    }
    return (
        <div className={userIn ? 'flex flex-col items-center pt-2 gap-2' : 'hidden'}>
            <form className={`flex items-center gap-2 ${controltags ? 'flex-col' : ''}`} onSubmit={handleSubmit}>
                <Input
                    type={'text'}
                    name={'name'}
                    onChange={handleInput}
                    value={user.name || ''}
                    placeholder={'Producto'}
                    required
                />
                <Input 
                    type={'text'}
                    name={'tags'}
                    onChange={handleInput}
                    value={user.tags || ''}
                    placeholder={'Nueva lista'}
                    className={controltags && marketData.length || 'hidden'}
                />
                <Input
                    className={'w-fit px-2 h-9 py-0 text-white font-semibold text-base bg-slate-500 hover:bg-slate-700 hover:shadow-blue-800 shadow-md shadow-blue-950'}
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
    )
}

export default Form