import React, { useContext } from 'react'
import { AllItemsContext } from './Contex'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const Danger = () => {
    const {setDanger, userIn} = useContext(AllItemsContext);

      const handleClick = async () =>  {
        const userDocRef = doc(db, 'users4', userIn.uid);
        const userDocSnapshot = await getDoc(userDocRef);
  
        if (userDocSnapshot.exists()) {
          await updateDoc(userDocRef, { markeList: [] });
          console.log('Producto eliminado de Firestore correctamente.');
  
        } else {
          console.log('El documento no existe en Firestore.');
        }
        setDanger(false)
      }
        
    
    return (
        <div className='p-3 flex flex-col bg-white absolute h-40 w-72 border-4 rounded-lg border-red-600 items-center justify-center gap-4 shadow-xl shadow-gray-900'>
            <h1 className='font-bold text-xl text-center'>¿Deseas borrar toda la lista de productos?</h1>
            <div className='flex gap-4'>
                <button onClick={() => handleClick()} className='py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-500  bg-slate-400 hover:shadow-blue-800 shadow-md shadow-blue-950'>SI</button>
                <button onClick={() =>setDanger(false)} className='py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-500  bg-slate-400 hover:shadow-blue-800 shadow-md shadow-blue-950'>NO</button>
            </div>
        </div>
    )
}

export default Danger