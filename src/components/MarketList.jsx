import React, { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Danger from './Danger';
import Tags from '../Tags';
import { firstLetterUpperCase } from '../utils/util';

const MarketList = () => {
  const { userIn, list, setList, button, setControlTags, controltags, setButton, danger, setDanger } = useContext(AllItemsContext);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [priority, setPriority] = useState(false);

  const updateIsDoneInFirestore = async (userId, itemId, newIsDoneValue, newIsDoneValue2) => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];

      if (!querySnapshot.empty) {
        const updatedMarkeList = market.map(item => {
          if (item.id === itemId) {
            return { ...item, isDone: newIsDoneValue, priority: newIsDoneValue2 };
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

  const handlePriority = async (objitem) => {
    const newIsDoneValue2 = !objitem.priority;
    setList(prev => {
      const updatedList = prev.map(item => {
        if (item.id === objitem.id) {
          return { ...item, priority: newIsDoneValue2 };
        }
        return item;
      });
      return updatedList;
    });
    await updateIsDoneInFirestore(userIn.uid, objitem.id, objitem.isDone, newIsDoneValue2);

  }
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
      setList(updatedList.filter(item => item.tags === button))
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
        setButton(updatedMarkeList[0]?.tags);
      } else {
        console.log('El documento no existe en Firestore.');
      }
    }
    setLastTapTime(new Date().getTime());

    await updateIsDoneInFirestore(userIn.uid, objitem.id, newIsDoneValue, objitem.priority);
  };

  const itemsCompra = list?.filter(item => item.tags === button);

  const handleOrder = () => {
    const yyy = list?.reduce((acc, obj) => {
      if (obj.tags) {
        if (obj.tags === button) {
          acc.push(obj);
        }
      }
      return acc
    }, []);

    const hhh = yyy.sort((a, b) => a.name.localeCompare(b.name));
    // setList(userIn?.markeList)
    setList(hhh)
    return hhh
  }
  const handleUrgente = () => {
    setList(prev => {
      const holdPrev = prev
      const array = holdPrev?.reduce((acc, obj) => {
        if (obj.tags) {
          if (obj.tags === button) {
            acc.push(obj);
          }
        }
        return acc
      }, []);
      return array.sort((a, b) => (a.priority ? -1 : 1) - (b.priority ? -1 : 1));

    })
  }

  useEffect(() => {
    // setList(userIn?.markeList?.sort((a, b) => a.name.localeCompare(b.name)))
    setList(userIn?.markeList)
  }, [])


  return (
    <div className='flex flex-col items-center relative gap-3 min-h-[580px] w-screen px-3 pb-10'>
      <Tags itemsCompra={itemsCompra} />
      <h1 className='text-center text-xl'>Lista</h1>
      <div className='flex gap-6'>
        <button onClick={() => handleOrder()} className='p-1 bg-yellow-500 rounded text-sm'>Ordenar A-Z</button>
        <button onClick={() => handleUrgente()} className='p-1 bg-yellow-500 rounded text-sm'>Ordenar Urgente</button>
      </div>
      {danger ? <Danger userIn={userIn} /> : ''}
      <ul className='flex flex-col gap-0.5 text-xl w-full'>
        {list?.length ?
          list?.map((item, index) => {
            if (item.tags === button) {
              return <li
                className={`list-disc list-inside break-normal items-center justify-between flex gap-4 rounded py-1 px-2 ${item.isDone ? 'line-through' : ''} ${item.priority ? 'bg-red-300' : index % 2 === 0 ? 'bg-blue-200' : 'bg-slate-50'}`}
                key={index}
              >
                <div className='w-full text-lg' onClick={() => handleClick(item)}>{firstLetterUpperCase(item.name)}</div>
                <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-7 z-50 rounded text-xs text-center px-0.5 ${priority ? 'bg-red-400' : 'bg-slate-400'}`}>Urgente</div>
              </li>
            }
          })
          : <p className='text-base'>Lista vacia</p>}
      </ul>
      {list?.length
        ? <button onClick={() => setDanger(true)} className={`p-2 font-semibold text-base leading-4 bg-red-600 text-white rounded absolute bottom-0 ${userIn ? '' : 'hidden'}`}>Eliminar lista</button>
        : ''}
    </div>
  );
};

export default MarketList;