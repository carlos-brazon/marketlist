import React, { useContext } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';

const Danger = ({ setDanger, userIn }) => {
  const { button, setButton } = useContext(AllItemsContext);
  
  const handleClick = async () => {
    const userDocRef = doc(db, 'users4', userIn.uid);
    const userDocSnapshot = await getDoc(userDocRef);
    
    if (userDocSnapshot.exists()) {
      const userDocData = userDocSnapshot.data();
      const updatedMarkeList = userDocData.markeList.filter(item => item.tags !== button);
      await updateDoc(userDocRef, { markeList: updatedMarkeList });
      const tags = updatedMarkeList.reduce((acc, obj) => {
        if (obj.tags) {
            if (!acc.includes(obj.tags)) {
                acc.push(obj.tags);
            }
        }
        return acc
    }, [])
    tags.length === 1 ? setButton(tags[0]) : ''
    }
    setDanger(false);
  }

  return (
    <div className='p-3 flex flex-col bg-white absolute top-0 h-40 w-72 border-4 rounded-lg border-red-600 items-center justify-center gap-4 shadow-xl shadow-gray-900'>
      <h1 className='font-bold text-xl text-center'>¿Deseas borrar los productos con la etiqueta 'Compras'?</h1>
      <div className='flex gap-4'>
        <button onClick={() => handleClick()} className='py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-500  bg-slate-400 hover:shadow-blue-800 shadow-md shadow-blue-950'>SI</button>
        <button onClick={() => setDanger(false)} className='py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-500  bg-slate-400 hover:shadow-blue-800 shadow-md shadow-blue-950'>NO</button>
      </div>
    </div>
  )
}

export default Danger;
