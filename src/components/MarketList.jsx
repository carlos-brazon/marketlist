import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Tags from '../Tags';
import { firstLetterUpperCase } from '../utils/util';
import { ScrollArea } from "@/components/ui/scroll-area"
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';

const MarketList = () => {
  const { userIn, list, setList, button, setControlTags, setButton, selectedTag, setSelectedTag } = useContext(AllItemsContext);
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
        setList(updatedMarkeList)
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
        setSelectedTag(updatedMarkeList)
        setControlTags(false);
        setButton(() => {
          const arrayStringTags = selectedTag?.reduce((acc, item) => {
            if (item.tags) {
              if (!acc.includes(item.tags)) {
                acc.push(item.tags);
              }
            }
            return acc
          }, []);
          const arrayObjectTags = selectedTag.filter(item => item.tags === button);
          return arrayStringTags.includes(button) && arrayObjectTags.length !== 1 ? button : arrayStringTags[0]
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
    setButton(userIn ? userIn?.markeList[0]?.tags : 'Compras')
  }, [])


  return (
    <div className='flex flex-col items-center relative gap-3 h-full w-screen px-3 pb-10'>
      <Tags />
      <h1 className='text-center text-xl'>Lista</h1>
      <div className='flex gap-6'>
        <button onClick={() => handleOrder()} className='p-1 bg-yellow-500 rounded text-sm'>Ordenar A-Z</button>
        <button onClick={() => handleUrgente()} className='p-1 bg-yellow-500 rounded text-sm'>Ordenar Urgente</button>
      </div>
      <ScrollArea className="h-[400px] w-full rounded-md border">
        {list?.length ?
          list?.map((item, index) => {
            if (item.tags === button) {
              return <li
                className={`list-disc list-inside break-normal items-center justify-between flex gap-2 m-0.5 rounded py-1 px-2 ${item.isDone ? 'line-through' : ''} ${item.priority ? 'bg-red-300' : index % 2 === 0 ? 'bg-blue-200' : 'bg-slate-50'}`}
                key={index}
              >
                <div className='w-full text-lg' onClick={() => handleClick(item)}>{firstLetterUpperCase(item.name)}</div>
                <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-7 z-50 rounded text-xs text-center px-0.5 bg-slate-400`}>Urgente</div>
                <EditDialog item={item} />
              </li>
            }
          })
          : <p className='text-base'>Lista vacia</p>}
      </ScrollArea>
      <DeleteDialog />
    </div>
  );
};

export default MarketList;