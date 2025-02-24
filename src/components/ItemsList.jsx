import { useContext, useEffect, useState } from 'react'
import { firstLetterUpperCase } from '../utils/util'
import { AllItemsContext } from './Contex'
import EditDialog from './EditDialog'
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import PropTypes from 'prop-types';
import AmountDialog from './AmountDialog'

const ItemsList = ({ setAmount }) => {
    ItemsList.propTypes = {
        setAmount: PropTypes.func,
    };
    const { userIn, list, setList, button, setButton, temporalCloud, setTemporalCloud, setValueInputNewTags, setAddTags } = useContext(AllItemsContext);
    const [lastTapData, setLastTapData] = useState({ id: null, time: 0 });
    const [tapCount, setTapCount] = useState(0);

    const handleClick = async (itemSelected) => {
        const newIsDoneValue = !itemSelected.isDone;
        //entrada del doble click
        if (tapCount === 1 && lastTapData.id == itemSelected.id) {
            try {
                const deleteItemInTemporalCloud = [...temporalCloud].filter(item => item.id !== itemSelected.id);
                setTemporalCloud(deleteItemInTemporalCloud);// hago set con el array sin el item (item eliminado)
                if (list.length == 1) {
                    const onlyOneTags = deleteItemInTemporalCloud[0]?.tags?.toLowerCase() || 'compras'
                    setButton(onlyOneTags)//aqui cambio el nombre de la etiqueta con el set
                    setValueInputNewTags(onlyOneTags) // aqui hago el set para cambiar el valor del input de las tags
                    setAddTags(false) // aqui hago el set para que se cierre el input de las tags
                    await updateDoc(doc(db, "userMarketList", userIn.uid), { last_tags: onlyOneTags });
                } else {
                    setButton(itemSelected.tags.toLowerCase())
                }
                await deleteDoc(doc(db, "dataItemsMarketList", itemSelected.id))
            } catch (error) {
                console.error('Error al eliminar el producto:', error);
            }
        } else {
            setTapCount(1);
            setLastTapData({ id: itemSelected.id, time: 0 });
            setTimeout(() => {
                setTapCount(0);
            }, 300);
        }
        //entrada click normal
        try {
            await updateDoc(doc(db, "dataItemsMarketList", itemSelected.id), { isDone: newIsDoneValue, isDone_at: serverTimestamp() });
            setTemporalCloud(prev => [...prev].map(itemInCloud => itemInCloud.id === itemSelected.id ? { ...itemInCloud, isDone: newIsDoneValue, isDone_at: new Date() } : itemInCloud));
        } catch (error) {
            console.error('Error al actualizar isDone en Firestore:', error);
        }
    };


    const handlePriority = async (itemSelected) => {
        const newValuePriority = !itemSelected.priority;
        try {
            await updateDoc(doc(db, "dataItemsMarketList", itemSelected.id), { priority: newValuePriority });
            const updateItemPriorityInTemporalCloud = temporalCloud.map(itemInCloud => itemInCloud.id == itemSelected.id ? { ...itemInCloud, priority: newValuePriority } : itemInCloud);
            setTemporalCloud(updateItemPriorityInTemporalCloud)
        } catch (error) {
            console.error('Error al actualizar isDone en Firestore:', error);
        }
    }

    useEffect(() => {
        let totalAmount = 0;
        const filteredList = [...temporalCloud].filter(item => {
            if (item.tags.toLowerCase() === button.toLowerCase()) {
                totalAmount += item.amount;
                return true;
            }
            return false;
        });

        let sortedList = [...filteredList];

        if (userIn?.orderByUrgent && userIn?.sortAscending) {
            sortedList.sort((a, b) => {
                if (a.priority !== b.priority) {
                    return b.priority - a.priority;
                }
                return a.name.localeCompare(b.name);
            });
        } else if (userIn?.orderByUrgent) {
            sortedList.sort((a, b) => b.priority - a.priority);
        } else if (userIn?.sortAscending) {
            sortedList.sort((a, b) => a.name.localeCompare(b.name));
        }
        if (userIn?.orderByDone) {
            sortedList.sort((a, b) => a.isDone - b.isDone);
        }
        if (!userIn?.sortAscending && !userIn?.orderByUrgent && !userIn?.orderByDone) {
            sortedList.sort((a, b) => {
                const dateA = a.create_at.toDate ? a.create_at.toDate() : new Date(a.create_at);
                const dateB = b.create_at.toDate ? b.create_at.toDate() : new Date(b.create_at);
                return dateA - dateB;
            });
        }

        setList(sortedList);
        setAmount(totalAmount);
    }, [temporalCloud, userIn]);

    return (
        <div>
            {list.length ?
                list.map((item, index) => {
                    return <div
                        key={index}
                        className={`break-normal items-center justify-end min-h-[30px] flex gap-2 m-0.5 rounded px-2 ${item.priority ? 'bg-red-400' : index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}`}
                    >
                        <div className={`flex w-full text-xs items-center ${item.isDone && 'line-through'}`} onClick={() => handleClick(item)} >
                            <div>{firstLetterUpperCase(item.name)}</div>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <div className=' whitespace-nowrap justify-center text-[9px] w-auto'>
                                {userIn?.isDateControl && <div className="flex flex-col h-6">
                                    <div>
                                        {new Date(item.create_at && item.create_at.toDate ? item.create_at.toDate() : item.create_at).toLocaleString()}
                                    </div>

                                    {item.isDone && <div className="line-through">{new Date(item.isDone_at && item.isDone_at.toDate ? item.isDone_at.toDate() : item.isDone_at).toLocaleString()}</div>}
                                </div>}
                            </div>
                            <AmountDialog item={item} setAmount={setAmount} />

                            {userIn?.isDoneControl &&
                                <div onClick={() => handlePriority(item)} className="flex items-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 py-0.5 bg-slate-100 border border-gray-900">Urgente</div>}
                            <EditDialog item={item} />
                        </div>
                    </div>
                })
                : <p className='text-base'>Lista vacia</p>}
        </div>
    )
}

export default ItemsList
