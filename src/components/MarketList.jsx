import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { auth2, db2 } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Tags from '../Tags';
import { firstLetterUpperCase } from '../utils/util';
import { ScrollArea } from "@/components/ui/scroll-area"
import DeleteDialog from './DeleteDialog';
import EditDialog from './EditDialog';
import { SeparatorList } from './SeparatorList';
import { Timestamp } from 'firebase/firestore';
import Input from './Input';


const MarketList = () => {
  const { userIn, list, setList, button, setAddTags, setButton, setSelectedTag } = useContext(AllItemsContext);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [amount, setAmount] = useState(0);

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
    try {
      const querySnapshot = await getDocs(query(collection(db2, 'usersMarketList'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];
      if (!querySnapshot.empty) {
        const updatedMarkeList = market.map(item => {
          if (item.id === objitem.id) {
            return { ...item, priority: newIsDoneValue2 };
          }
          return item;
        });
        await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
        console.log('isDone actualizado en Firestore correctamente.');
      } else {
        console.log('El documento no existe en Firestore.');
      }
    } catch (error) {
      console.error('Error al actualizar isDone en Firestore:', error);
    }

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
      return updatedList
    });


    if (timeSinceLastTap < 300) {
      const userDocSnapshot = await getDoc(doc(db2, 'usersMarketList', userIn.uid));

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMarkeList = userData.markeList.filter(item => item.id !== objitem.id);
        await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
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
          updateDoc(doc(db2, 'usersMarketList', userIn.uid), { last_tags: arrayStringTags.length > 1 && arrayStringTags.includes(button) ? button : arrayStringTags[0] || '' });
          return arrayStringTags.length > 1 && arrayStringTags.includes(button) ? button : arrayStringTags[0]
        });

      } else {
        console.log('El documento no existe en Firestore.');
      }
    }
    setLastTapTime(new Date().getTime());


    try {
      const querySnapshot = await getDocs(query(collection(db2, 'usersMarketList'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];
      if (!querySnapshot.empty) {
        const date = new Date();
        const timestamp = Timestamp.fromDate(date);
        const updatedMarkeList = market.map(item => {
          if (item.id === objitem.id) {
            if (newIsDoneValue) {
              return { ...item, isDone: newIsDoneValue, isDone_at: timestamp };
            } else {
              return { ...item, isDone: newIsDoneValue };
            }
          }
          return item;
        });
        await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
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
    const yyy = userIn.markeList.map(item => {
      console.log(item.amount);
      setAmount(prev => prev + item.amount / 2)
    })
  }, [])
  const listFilterTags = list?.filter(item => item.tags === button)
  const date = (item) => {
    if (item) {
      const date = item.toDate() || ' ';
      const day = String(date.getDate()).padStart(2, '0');
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const year = date.getFullYear().toString().slice(-2);
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');

      const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}`;
      return formattedDate
    }
  }
  // setTimeout(async () => {
  //   const userDocSnapshot = await getDoc(doc(db2, 'usersMarketList', userIn.uid));
  //   if (userDocSnapshot.exists()) {
  //     const userData = userDocSnapshot.data();
  //     const updatedMarkeList = userData.markeList.map(item2 => {
  //       if (item2.id == item.id) {
  //         console.log(event.target.value);
  //         return { ...item2 }
  //       }
  //       return item2
  //     });
  //     console.log(userData.markeList);
  //     // await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
  //     // console.log('Producto eliminado de Firestore correctamente.');
  //     console.log(updatedMarkeList);


  //   }

  //   // await updateDoc(doc(auth2, "marketList"))

  // }, 3000);

  return (
    <div className='flex flex-col items-center gap-4 h-full w-screen px-3'>
      <Tags />
      <SeparatorList handleOrder={handleOrder} handleUrgente={handleUrgente} />

      <div>
        <div>Total</div>
        <div>{amount}</div>
      </div>
      <ScrollArea
        style={{ height: `${Math.round(window.innerHeight - 340)}px` }}
        className={`w-full rounded-md`}
      >
        {list?.length ?
          listFilterTags?.map((item, index) => {
            return <li
              key={index}
              className={`list-disc list-inside break-normal items-center justify-end flex gap-2 m-0.5 rounded py-1 px-2 ${item.priority ? 'bg-red-400' : index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}`}
            >
              <div className={`flex w-full text-sm items-center ${item.isDone ? 'line-through' : ''}`} onClick={() => handleClick(item)}>
                <div>{firstLetterUpperCase(item.name)}</div>

              </div>
              <div className='flex gap-1 items-center'>
                <div className=' whitespace-nowrap justify-center text-[9px] w-auto'>
                  <div className='flex flex-col h-7'>
                    <div>{date(item.create_at)}</div>
                    <div className={`${item.isDone ? 'line-through' : 'hidden'} ${item.priority && !item.isDone ? 'hidden' : ''}`}>{date(item.isDone_at)}</div>
                  </div>
                </div>
                <form onSubmit={ } action=""
                >
                  <Input
                    onKeyPress={(event) => {
                      console.log(event);
                      if (event.key === "Enter") {
                        console.log(event.target.value);
                      }
                      // setTimeout(async () => {
                      //   const userDocSnapshot = await getDoc(doc(db2, 'usersMarketList', userIn.uid));
                      //   if (userDocSnapshot.exists()) {
                      //     const userData = userDocSnapshot.data();
                      //     const updatedMarkeList = userData.markeList.map(item2 => {
                      //       if (item2.id == item.id) {
                      //         return { ...item2, amount: Number(event.target.value) }
                      //       }

                      //       return item2
                      //     });


                      //     await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
                      //   }
                      // }, 1000);
                    }}
                    className={"w-10 h-6"}
                    type={"text"}
                    placeholder={item.amount} />
                </form>

                <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-7 z-50 rounded-md text-[10px] text-center px-0.5 bg-slate-100 border border-gray-900`}>Urgente</div>
                <EditDialog item={item} />
              </div>
            </li>
          })
          : <p className='text-base'>Lista vacia</p>}
      </ScrollArea>
      <DeleteDialog />
    </div >
  );
};

export default MarketList;
