import React, { useContext } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from '../utils/util';

const Danger = () => {
  const { button, setButton, setList, setDanger, userIn, setControlTags, setSelectedTag } = useContext(AllItemsContext);

  const handleClick = async () => {
    setDanger(false);
    setControlTags(false);
    const userDocRef = doc(db, 'users4', userIn.uid);
    const userDocSnapshot = await getDoc(userDocRef);

    if (userDocSnapshot.exists()) {
      const userDocData = userDocSnapshot.data();
      const updatedMarkeList = userDocData.markeList.filter(item => item.tags !== button);
      setList(updatedMarkeList);
      setSelectedTag(updatedMarkeList);

      await updateDoc(userDocRef, { markeList: updatedMarkeList });
      const tags = updatedMarkeList.reduce((acc, obj) => {
        if (obj.tags) {
          if (!acc.includes(obj.tags)) {
            acc.push(obj.tags);
          }
        }
        return acc
      }, []);

      if (tags.length >= 1) {
        setButton(tags[0])
      } else {
        setButton('Compras');
      }
    }
  }

  return (
    <>
      <div className='animate-jump p-3 flex flex-col bg-white absolute z-50 bottom-80 w-56 border-4 rounded-lg border-red-600 items-center justify-center gap-4 shadow-xl shadow-gray-900'>
        <h1 className='font-bold text-lg text-center break-all'>¿Deseas borrar la lista <span className='underline'>'{firstLetterUpperCase(button)}'</span>?</h1>
        <div className='flex gap-4'>
          <button onClick={() => handleClick()} className='w-10 p-1 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-500  bg-slate-400 hover:shadow-blue-800 shadow-md shadow-blue-950'>SI</button>
          <button onClick={() => setDanger(false)} className='w-10 p-1 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-500  bg-slate-400 hover:shadow-blue-800 shadow-md shadow-blue-950'>NO</button>
        </div>
      </div>
    </>
  )
}
export default Danger;