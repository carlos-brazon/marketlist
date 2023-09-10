import React, { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Danger from './Danger';
import Tags from '../Tags';
import { firstLetterUpperCase } from '../utils/util';

const MarketList = () => {
  const { userIn, list, setList, button, setControlTags, setButton, danger, setDanger } = useContext(AllItemsContext);
  const [lastTapTime, setLastTapTime] = useState(0);


  const updateIsDoneInFirestore = async (userId, itemId, newIsDoneValue) => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];

      if (!querySnapshot.empty) {
        const updatedMarkeList = market.map(item => {
          if (item.id === itemId) {
            return { ...item, isDone: newIsDoneValue };
          }
          return item;
        });
        await updateDoc(doc(db, 'users4', userId), { markeList: updatedMarkeList });
        console.log('isDone actualizado en Firestore correctamente.');
      } else {
        console.log('El documento no existe en Firestore.');
      }
    } catch (error) {
      console.error('Error al actualizar isDone en Firestore:', error);
    }
  };

  const handleClick = async (objitem) => {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;

    const newIsDoneValue = !objitem.isDone;

    setList(prev => {
      const updatedList = prev.map(item => {
        if (item.id === objitem.id) {
          return { ...item, isDone: newIsDoneValue };
        }
        return item;
      });
      return updatedList;
    });

    if (timeSinceLastTap < 300) {
      const userDocSnapshot = await getDoc(doc(db, 'users4', userIn.uid));

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMarkeList = userData.markeList.filter(item => item.id !== objitem.id);

        await updateDoc(doc(db, 'users4', userIn.uid), { markeList: updatedMarkeList });
        console.log('Producto eliminado de Firestore correctamente.');
        if (updatedMarkeList.length === 0 || list.length === 0) {
          setControlTags(false)
          setButton('Compras')
        }
        setList(updatedMarkeList);
        // setButton(updatedMarkeList[0]?.tags);
      } else {
        console.log('El documento no existe en Firestore.');
      }
    };
    setLastTapTime(new Date().getTime());

    await updateIsDoneInFirestore(userIn.uid, objitem.id, newIsDoneValue);
  };
  useEffect(() => {
    setList(userIn?.markeList?.sort((a, b) => a.name.localeCompare(b.name)))
  }, [])
  const itemsCompra = list?.filter(item => item.tags === button);
  return (
    <div className='flex flex-col items-center relative gap-3 min-h-[580px] w-screen px-3 pb-10'>
      <Tags />
      <h1 className='text-center text-xl'>Lista</h1>
      {danger ? <Danger userIn={userIn} /> : ''}
      <ul className='flex flex-col gap-0.5 text-xl w-full'>
        {list?.length ?
          itemsCompra?.map((item, index) => (
            <li
              className={`list-disc list-inside break-normal rounded py-0.5 px-2 ${item.isDone ? 'line-through' : ''} ${index % 2 === 0 ? 'bg-blue-200' : 'bg-slate-50'}`}
              onClick={() => handleClick(item)}
              key={index}
            >
              {firstLetterUpperCase(item.name)}
            </li>
          ))
          : <p className='text-base'>Lista vacia</p>}
      </ul>
      {list?.length
        ? <button onClick={() => setDanger(true)} className={`p-2 font-semibold text-base leading-4 bg-red-600 text-white rounded absolute bottom-0 ${userIn ? '' : 'hidden'}`}>Eliminar todos los productos</button>
        : ''}
    </div>
  );
};

export default MarketList;