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
                    console.log(onlyOneTags);
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
        let totalAmount = 0
        const listFromFirebase = [...temporalCloud].filter(item => {//aqui saco de la temporal un array filtrado por etiquetas
            if (item.tags.toLowerCase() == button.toLowerCase()) {
                totalAmount = totalAmount + item.amount
                return item
            }
        });

        if (userIn?.sortAscending && userIn?.orderByUrgent) { // si los 2 son true
            // Filtrar elementos por el tag seleccionado
            const filteredList = [...temporalCloud]?.filter(item => item.tags.toLowerCase() === button.toLowerCase());

            // Ordenar primero por urgencia (prioridad) y luego por nombre en orden ascendente
            const sortedList = filteredList.sort((a, b) => {
                // Ordenar por prioridad primero (urgentes primero)
                if (a.priority !== b.priority) {
                    return b.priority - a.priority; // Los urgentes (true) van antes (1 > 0)
                }
                // Si tienen la misma prioridad, ordenar por nombre (A-Z)
                return a.name.localeCompare(b.name);
            });

            setList(sortedList);
            return;
        } else if (userIn?.sortAscending) {
            const filteredList = [...temporalCloud]?.filter(item => item.tags.toLowerCase() === button.toLowerCase());
            const sortedList = [...filteredList]?.sort((a, b) => {
                const nameA = isNaN(a.name) ? a.name : parseFloat(a.name);
                const nameB = isNaN(b.name) ? b.name : parseFloat(b.name);
                if (typeof nameA === "string" && typeof nameB === "string") {
                    return nameA.localeCompare(nameB); // Ordenar alfabéticamente
                }
                return nameA - nameB; // Ordenar numéricamente
            });
            setList(sortedList);

        } else if (userIn?.orderByUrgent) {
            const urgentList = [...temporalCloud]?.filter(item => item.tags.toLowerCase() === button.toLowerCase()).sort((a, b) => (a.priority ? -1 : 1) - (b.priority ? -1 : 1));
            setList(urgentList)
        } else {
            const sortedList = listFromFirebase.sort((a, b) => {
                const dateA = a.create_at.toDate ? a.create_at.toDate() : new Date(a.create_at);
                const dateB = b.create_at.toDate ? b.create_at.toDate() : new Date(b.create_at);
                return dateA - dateB;
            });
            setList(sortedList);
        }
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
                        <div className={`flex w-full text-xs items-center ${item.isDone ? 'line-through' : ''}`} onClick={() => handleClick(item)} >
                            <div>{firstLetterUpperCase(item.name)}</div>
                        </div>
                        <div className='flex gap-1 items-center'>
                            <div className=' whitespace-nowrap justify-center text-[9px] w-auto'>
                                <div className={`flex flex-col h-6 ${userIn?.isDateControl || 'hidden'}`}>
                                    <div>
                                        {new Date(item.create_at && item.create_at.toDate ? item.create_at.toDate() : item.create_at).toLocaleString()}
                                    </div>

                                    <div className={`${item.isDone ? 'line-through' : 'hidden'}`}>{new Date(item.isDone_at && item.isDone_at.toDate ? item.isDone_at.toDate() : item.isDone_at).toLocaleString()}</div>
                                </div>
                            </div>
                            <AmountDialog item={item} setAmount={setAmount} />

                            <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 py-0.5 bg-slate-100 border border-gray-900 ${userIn?.isDoneControl || 'hidden'}`}>Urgente</div>
                            <EditDialog item={item} />
                        </div>
                    </div>
                })
                : <p className='text-base'>Lista vacia</p>}
        </div>
    )
}

export default ItemsList
