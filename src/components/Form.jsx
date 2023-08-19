import React, { useState } from 'react'
import { AllItemsContext } from './Contex';
import { useContext } from 'react';
import { arrayUnion, doc, updateDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../utils/firebase';
import MarketList from './MarketList';

const Form = ({ userIn }) => {
    const [user, setUser] = useState([]);
    const [message, setMessage] = useState('')
    const { list, setList } = useContext(AllItemsContext);
    console.log(list);

    const showMessage = (text, duration) => {
        setMessage(text);
        setTimeout(() => {
          setMessage('');
        }, duration);
      };

    const handleInput = () => {
        const inputName = event.target.name;
        const inputValue = (event.target.value)
        setUser(prev => ({ ...prev, [inputName]: inputValue}));
    }
    const handleSubmit = async () => {
        event.preventDefault();

        const newProductName = user.name;
        try {
            const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
            const market = querySnapshot.docs[0]?.data().markeList || []

            const productExists = market.some(item => item.name === newProductName);

            if (!productExists) {
                const newId = doc(collection(db, 'dummy')).id;
                setList(prev => [...prev, { ...user, isDone: false, id: newId, name: user.name.toLowerCase() }])
                await updateDoc(doc(db, 'users4', userIn.uid), {
                    markeList: arrayUnion({ ...user, isDone: false, id: newId })
                });
                console.log('Producto agregado al markeList.');
                showMessage('Agregado a tu lista de compras', 2000)

            } else {
                console.log('El producto ya existe en el markeList.');
                showMessage('Ya está en tu lista de compras', 2000)

            }
        } catch (error) {
            console.error('Error al realizar la consulta:', error);
        }
        
    }
    return (
        <div className={userIn ? 'flex flex-col gap-2' : 'hidden'}>
            <form className='flex gap-2 pt-4' onSubmit={handleSubmit}>
                <input className={`rounded border border-red-700 w-48 p-1 hover:border-red-900 outline-red-400`} type="text" name='name' onChange={handleInput} value={user.name || ''} placeholder='Producto' required />
                <input className={`border p-1 rounded-md bg-red-50 hover:bg-red-400`} type="submit" />
            </form>
            <div>
                <p className={`h-9 rounded flex w-fit items-center ${message.includes('Agregado') ? 'bg-green-500 p-1' : message.includes('está') ? 'bg-red-700 text-white p-1' :''}`}>{message}</p>
            </div>
            <MarketList userIn={userIn} />
        </div>
    )
}

export default Form