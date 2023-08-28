import React, { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Danger from './Danger';
import Tags from '../Tags';

const MarketList = ({ userIn }) => {
  const { list, setList, marketData, setMarketData, button, setControlTags  } = useContext(AllItemsContext);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [danger, setDanger] = useState(false);
  console.log(button);

  const updateIsDoneInFirestore = async (userId, itemId, newIsDoneValue) => {
    try {
      const docRef = doc(db, 'users4', userId);
      const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];

      if (!querySnapshot.empty) {
        const updatedMarkeList = market.map(item => {
          if (item.id === itemId) {
            return { ...item, isDone: newIsDoneValue };
          }
          return item;
        });

        await updateDoc(docRef, { markeList: updatedMarkeList });
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

    if (timeSinceLastTap < 300) {

      const userDocRef = doc(db, 'users4', userIn.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMarkeList = userData.markeList.filter(item => item.id !== objitem.id);
        
        await updateDoc(userDocRef, { markeList: updatedMarkeList });
        console.log('Producto eliminado de Firestore correctamente.');
        console.log(updatedMarkeList);
        updatedMarkeList.length===0 ? setControlTags(false) : ''

        setList(prev => prev.filter(item => item.id !== objitem.id));
        setMarketData(prevMarketData => prevMarketData.filter(item => item.id !== objitem.id));
      } else {
        console.log('El documento no existe en Firestore.');
      }
    };
    setLastTapTime(currentTime);
    const newIsDoneValue = !objitem.isDone;
    await updateIsDoneInFirestore(userIn.uid, objitem.id, newIsDoneValue);

    setList(prev => {
      const updatedList = prev.map(item => {
        if (item.id === objitem.id) {
          return { ...item, isDone: newIsDoneValue };
        }
        return item;
      });
      return updatedList;
    });

    setMarketData(prevMarketData => {
      const updatedMarketData = prevMarketData.map(item => {
        if (item.id === objitem.id) {
          return { ...item, isDone: newIsDoneValue };
        }
        return item;
      });
      return updatedMarketData;
    });
    console.log(marketData);
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
        if (!querySnapshot.empty) {
          const market = querySnapshot.docs[0].data().markeList || [];
          setMarketData(market.sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          console.log('No se encontraron documentos que cumplan con los criterios.');
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    };

    fetchMarketData();
  }, [list, userIn, danger]);

const itemsCompra = marketData.filter( item => item.tags === button)
  return (
    <div className='flex flex-col items-center relative gap-3 min-h-[580px] w-[300px] pb-10'>
      <Tags />
      <h1 className='text-center text-xl'>Artículos</h1>
      {danger ? <Danger setDanger={setDanger} userIn={userIn} /> : ''}
      <ul className='flex flex-col gap-0.5 text-xl w-full'>
        {itemsCompra.map((item, index) => (
          <li
            className={`list-disc list-inside break-all rounded py-0.5 px-2 ${item.isDone ? 'line-through' : ''} ${index%2 ===0 ? 'bg-blue-200' : 'bg-slate-50'}`}
            onClick={() => handleClick(item)}
            key={index}
            >
            {item.name}
          </li>
        ))}
      </ul>
      {marketData.length 
      ? <button onClick={() => setDanger(true)} className={`p-2 font-semibold text-base leading-4 bg-red-600 text-white rounded absolute bottom-0 ${userIn ? '' : 'hidden'}`}>Eliminar todos los productos</button>
    :''}
    </div>
  );
};

export default MarketList;