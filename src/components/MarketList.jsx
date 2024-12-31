import { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db2 } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Tags from '../Tags';
import { firstLetterUpperCase } from '../utils/util';
import { ScrollArea } from "@/components/ui/scroll-area"
import EditDialog from './EditDialog';
import { Timestamp } from 'firebase/firestore';
import iconEditFalse from "../assets/edit-false.svg";
import iconEditTrue from "../assets/edit-true.svg";
import iconUrgentFalse from "../assets/urgent-false.svg";
import iconUrgentTrue from "../assets/urgent-true.svg";
import iconCalculatorFalse from "../assets/calculator-false.svg";
import iconCalculatorTrue from "../assets/calculator-true.svg";
import iconCalendarFalse from "../assets/calendar-false.svg";
import iconCalendarTrue from "../assets/calendar-true.svg";

const MarketList = () => {
  const { userIn, list, setList, button, setAddTags, setButton, setSelectedTag } = useContext(AllItemsContext);
  const [lastTapTime, setLastTapTime] = useState(0);
  const [amount, setAmount] = useState(0);
  const [isEditControl, setIsEditControl] = useState(userIn?.isEditControl);
  const [isDoneControl, setIsDoneControl] = useState(userIn?.isDoneControl);
  const [addControl, setAddControl] = useState(userIn?.addControl);
  const [isDateControl, setIsDateControl] = useState(userIn?.isDateControl);



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
    setSelectedTag(prev => {
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

  const handleDoubleTap = async (objitem) => {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;

    if (timeSinceLastTap < 50 && timeSinceLastTap > 0) {
      const userDocSnapshot = await getDoc(doc(db2, 'usersMarketList', userIn.uid));
      // Doble toque detectado
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
  };
  const handleDoubleClick = async (objitem) => {
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

    setLastTapTime(new Date().getTime());
  };
  const handleClick = async (objitem) => {
    const newIsDoneValue = !objitem.isDone;
    setList(prev => {
      const updatedList = prev.map(item => {
        if (item.id === objitem.id) {
          return { ...item, isDone: newIsDoneValue, };
        }
        return item;
      });
      return updatedList
    });

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

  useEffect(() => {
    setList(userIn?.markeList)
    setSelectedTag(userIn?.markeList)
    const totalAmount = userIn?.markeList.reduce((acc, item) => {
      if (item.tags === userIn.last_tags && item.amount) {
        return acc + item.amount
      }
      return acc
    }, 0);
    setAmount(totalAmount?.toFixed(2) || 0);

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

  const handleSubmit = (numberFromInput, item) => {
    event.preventDefault();
    let numberToAmount = 0;
    setTimeout(async () => {
      const userDocSnapshot = await getDoc(doc(db2, 'usersMarketList', userIn.uid));
      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMarkeList = userData.markeList.map(item2 => {
          if (item2.id == item.id) {
            numberToAmount = numberToAmount + Number(numberFromInput)
            return { ...item2, amount: Number(numberFromInput) }
          }
          if (item2.tags == item.tags) {
            numberToAmount = numberToAmount + Number(item2.amount || 0)
          }

          return item2
        });
        setAmount(Number(numberToAmount.toFixed(2)))
        await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
      }
    }, 1000);
  }

  return (
    <div className='flex flex-col items-center gap-4 h-full w-screen px-3'>
      <Tags setAmount={setAmount} />
      <h4 className="text-base text-center font-medium leading-none">Lista</h4>

      <ScrollArea
        style={{ height: `${Math.round(window.innerHeight - 250)}px` }}
        className={`w-full rounded-md`}
      >
        <div className='flex gap-1 items-center justify-end pr-[10px] mb-2 '>
          <div className={`w-full items-center flex gap-2 justify-end ${addControl || 'hidden'}`}>
            <div className='text-md'>Total</div>
            <div className='w-16 border text-center text-sm border-black rounded-md px-1 py-0.5 '>{amount}</div>
          </div>

          <img onClick={async () => { setIsDateControl(prev => !prev), await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { isDateControl: !isDateControl }) }} className='w-8 h-w-8' src={isDateControl ? iconCalendarTrue : iconCalendarFalse} alt='Aquí va un icono de calendario' />

          <img onClick={async () => { setAddControl(prev => !prev), await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { addControl: !addControl }) }} className='w-8 h-w-8' src={addControl ? iconCalculatorTrue : iconCalculatorFalse} alt='Aquí va un icono de calculadora' />

          <img onClick={async () => { setIsDoneControl(prev => !prev), await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { isDoneControl: !isDoneControl }) }} className='w-8 h-w-8' src={isDoneControl ? iconUrgentTrue : iconUrgentFalse} alt='Aquí va un icono de urgente' />

          <img onClick={async () => { setIsEditControl(prev => !prev), await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { isEditControl: !isEditControl }) }} className='w-8 h-w-8' src={isEditControl ? iconEditTrue : iconEditFalse} alt='Aquí va un icono de editar' />

        </div>
        {list?.length ?
          listFilterTags?.map((item, index) => {
            return <li
              key={index}
              className={`list-disc list-inside break-normal items-center justify-end min-h-[30px] flex gap-2 m-0.5 rounded px-2 ${item.priority ? 'bg-red-400' : index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}`}
            >
              <div className={`flex w-full text-xs items-center ${item.isDone ? 'line-through' : ''}`} onClick={() => handleClick(item)} onDoubleClick={() => handleDoubleClick(item)} onTouchStart={() => handleDoubleTap(item)}>
                <div>{firstLetterUpperCase(item.name)}</div>

              </div>
              <div className='flex gap-1 items-center'>
                <div className=' whitespace-nowrap justify-center text-[9px] w-auto'>
                  <div className={`flex flex-col h-6 ${isDateControl || 'hidden'}`}>
                    <div>{date(item.create_at)}</div>
                    <div className={`${item.isDone ? 'line-through' : 'hidden'} ${item.priority && !item.isDone ? 'hidden' : ''}`}>{date(item.isDone_at)}</div>
                  </div>
                </div>

                <form className={`flex items-center`} onSubmit={handleSubmit}>
                  <input
                    className={`text-center p-px text-xs w-14 outline-1 border border-black rounded-md ${addControl || 'hidden'}`}
                    type={'text'}
                    name={item.id}
                    placeholder={item.amount?.toFixed(2) || 0}
                    onKeyDown={(event) => {
                      if (event.key === "Enter") {
                        handleSubmit(event.target.value, item)
                      }
                    }
                    }
                    step="0.01"
                  />
                </form>

                <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 py-0.5 bg-slate-100 border border-gray-900 ${isDoneControl || 'hidden'}`}>Urgente</div>
                <EditDialog item={item} isEditControl={isEditControl} />
              </div>
            </li>
          })
          : <p className='text-base'>Lista vacia</p>}
      </ScrollArea >
    </div >
  );
};

export default MarketList;
