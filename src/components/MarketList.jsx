import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Tags from '../Tags';
import { firstLetterUpperCase } from '../utils/util';
import { ScrollArea } from "@/components/ui/scroll-area"
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';
import { SeparatorList } from './SeparatorList';

const MarketList = () => {
  const { userIn, list, setList, button, setAddTags, setButton, setSelectedTag } = useContext(AllItemsContext);
  const [lastTapTime, setLastTapTime] = useState(0);
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
        // setList(updatedMarkeList)
        setSelectedTag(updatedMarkeList)
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
      updatedList.filter(item => item.tags === button)
      return updatedList
    });

    if (timeSinceLastTap < 300) {
      const userDocSnapshot = await getDoc(doc(db, 'users4', userIn.uid));

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMarkeList = userData.markeList.filter(item => item.id !== objitem.id);
        await updateDoc(doc(db, 'users4', userIn.uid), { markeList: updatedMarkeList });
        console.log('Producto eliminado de Firestore correctamente.');
        if (updatedMarkeList.length === 0 || list.length === 0) {
          setAddTags(false)
          setButton('Compras')
        }

        setList(updatedMarkeList);
        setSelectedTag(updatedMarkeList)
        setAddTags(false);
        setButton(() => {
          const arrayStringTags = updatedMarkeList?.reduce((acc, item) => {
            if (item.tags) {
              if (!acc.includes(item.tags)) {
                acc.push(item.tags);
              }
            }
            return acc
          }, []);
          return arrayStringTags.length !== 1 && arrayStringTags.includes(button) ? button : arrayStringTags[0]
          // const arrayObjectTags = setSelectedTag?.filter(item => item.tags === button);
          // return arrayStringTags.includes(button) && arrayObjectTags.length !== 1 ? button : arrayStringTags[0]
        });
      } else {
        console.log('El documento no existe en Firestore.');
      }
    }
    setLastTapTime(new Date().getTime());
    await updateIsDoneInFirestore(userIn.uid, objitem.id, newIsDoneValue, objitem.priority);
  };

  const handleOrder = () => {
    const sortedList = list?.filter(item => item.tags === button).sort((a, b) => a.name.localeCompare(b.name));
    setList(sortedList);
  }
  const handleUrgente = () => {
    const urgentList = list?.filter(item => item.tags === button).sort((a, b) => (a.priority ? -1 : 1) - (b.priority ? -1 : 1));
    setList(urgentList);
  }
  useEffect(() => {
    setList(userIn?.markeList)
    setSelectedTag(userIn?.markeList)
  }, [])

  const listFilterTags = list?.filter(item => item.tags === button)

  return (
    <div className='flex flex-col items-center gap-4 h-full w-screen px-3'>
      <Tags />
      <SeparatorList handleOrder={handleOrder} handleUrgente={handleUrgente} />
      <ScrollArea
        style={{ height: `${Math.round(window.innerHeight / 2) + 50}px` }}
        className={`w-full rounded-md`}
      >
        {list?.length ?
          listFilterTags?.map((item, index) => {
            return <li
              key={index}
              className={`list-disc list-inside break-normal items-center justify-between flex gap-2 m-0.5 rounded py-1 px-2 ${item.priority ? 'bg-red-400' : index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}`}
            >
              <div className={`w-full text-lg ${item.isDone ? 'line-through' : ''}`} onClick={() => handleClick(item)}>{firstLetterUpperCase(item.name)}</div>
              <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-7 z-50 rounded-md text-sm text-center px-0.5 bg-slate-100 border border-gray-900`}>Urgente</div>
              <EditDialog item={item} />
            </li>
          })
          : <p className='text-base'>Lista vacia</p>}
      </ScrollArea>
      <DeleteDialog />
    </div >
  );
};

export default MarketList;