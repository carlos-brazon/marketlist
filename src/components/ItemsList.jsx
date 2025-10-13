import { useContext, useEffect, useRef, useState } from 'react'
import { firstLetterUpperCase, formatDate } from '../utils/util'
import { AllItemsContext } from './Contex'
import EditDialog from './EditDialog'
import { deleteDoc, doc, serverTimestamp, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import PropTypes from 'prop-types';
import AmountDialog from './AmountDialog'
import { useToast } from "@/components/ui/use-toast"
import MercadonaDialog from './MercadonaDialog'
import add from '../assets/add.svg'
import less from '../assets/less.svg'

const ItemsList = ({ setAmount }) => {
    ItemsList.propTypes = {
        setAmount: PropTypes.func,
    };
    const { userIn, list, setList, button, setButton, temporalCloud, setTemporalCloud, setValueInputNewTags, setAddTags } = useContext(AllItemsContext);
    const { toast } = useToast();
    const [longPress, setLongPress] = useState(false);
    const tapCountRef = useRef(0);
    const lastTapDataRef = useRef(null);
    const clickTimeoutRef = useRef(null);

    const mercadonaActivator = "compras, compra, mercadona, mercado"

    const handleClick = async (itemSelected) => {
        if (longPress) return; // ignorar si se deja presionado mas de 3 segundos para copiar

        const newIsDoneValue = !itemSelected.isDone;

        tapCountRef.current += 1;
        if (tapCountRef.current === 2 && lastTapDataRef.current?.id === itemSelected.id) {// aqui entra doble click
            clearTimeout(clickTimeoutRef.current);
            tapCountRef.current = 0;

            try {
                const newCloud = [...temporalCloud].filter(item => item.id !== itemSelected.id);// aqui elimino el item
                setTemporalCloud(newCloud);

                if (list.length === 1) {
                    const onlyOneTags = newCloud[0]?.tags?.toLowerCase() || "compras";
                    setButton(onlyOneTags);//aqui cambio el nombre de la etiqueta con el set
                    setValueInputNewTags(onlyOneTags);// aqui hago el set para cambiar el valor del input de las tags
                    setAddTags(false);// aqui hago el set para que se cierre el input de las tags
                    await updateDoc(doc(db, "userMarketList", userIn.uid), { last_tags: onlyOneTags });
                } else {
                    setButton(itemSelected.tags.toLowerCase());
                }

                await deleteDoc(doc(db, "dataItemsMarketList", itemSelected.id));
            } catch (error) {
                console.error("Error al eliminar el producto:", error);
            }
            return; // salir para que no se ejecute click normal
        }

        // aqui guardo el tap para posible doble click
        lastTapDataRef.current = { id: itemSelected.id, time: Date.now() };

        clickTimeoutRef.current = setTimeout(async () => {//click normal
            if (tapCountRef.current === 1) {
                try {
                    await updateDoc(doc(db, "dataItemsMarketList", itemSelected.id), {
                        isDone: newIsDoneValue,
                        isDone_at: serverTimestamp()
                    });
                    setTemporalCloud(prev =>
                        [...prev].map(itemInCloud =>
                            itemInCloud.id === itemSelected.id ? { ...itemInCloud, isDone: newIsDoneValue, isDone_at: new Date() } : itemInCloud
                        )
                    );
                } catch (error) {
                    console.error("Error al actualizar isDone en Firestore:", error);
                }
            }
            tapCountRef.current = 0;
        }, 300);
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
                totalAmount += item.amount * item.quantity;
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

    const timerRef = useRef(null);

    const startPress = (event) => {// aqui hago el coiar nombre del item
        timerRef.current = setTimeout(() => {
            setLongPress(true);
            const text = event.target.innerText;
            navigator.clipboard.writeText(text).then(() => {
                toast({
                    className: "p-0",
                    title: <div className='p-1 flex gap-1 items-center justify-center font-light'><span>Item copiado</span></div>,
                    duration: '1000',
                })
            });
        }, 3000);
        setLongPress(false);
    };

    const cancelPress = () => {
        clearTimeout(timerRef.current);
    };

    const handleUpdateQuantity = async (item, delta) => {
        const newQuantity = Math.max(1, item.quantity + delta); 

        try {
            await updateDoc(doc(db, "dataItemsMarketList", item.id), {
                quantity: newQuantity,
            });
            setTemporalCloud(prev =>
                prev.map(itemInCloud =>
                    itemInCloud.id === item.id
                        ? { ...itemInCloud, quantity: newQuantity }
                        : itemInCloud
                )
            );
        } catch (error) {
            console.error("Error al actualizar quantity en Firestore:", error);
        }
    };

    return (
        <div>
            {list.length ?
                list.map((item, index) => {
                    return <div
                        key={index}
                        className={`break-normal w-full items-center  justify-between min-h-[30px] flex gap-1 m-0.5 rounded px-2 ${item.priority ? 'bg-red-400' : index % 2 === 0 ? 'bg-blue-100' : 'bg-blue-200'}`}
                    ><div className={`text-xs ${item.quantity == 1 && 'hidden'}`}>
                            {item.quantity}
                        </div>
                        <div
                            className={`flex w-full text-xs items-center ${item.isDone && 'line-through'}`}
                            onClick={() => handleClick(item)}
                            onMouseDown={startPress}
                            onMouseUp={cancelPress}
                            onMouseLeave={cancelPress}
                            onTouchStart={(e) => startPress(e)}
                            onTouchEnd={cancelPress}
                            onTouchCancel={cancelPress}
                        >
                            <div>{firstLetterUpperCase(item.name)}</div>
                        </div>
                        <div className='flex gap-1 items-center justify-end max-w-[310px] flex-shrink-0 w-auto'>

                         {
                               mercadonaActivator.includes(item.tags)&&<div className='flex gap-1 items-center justify-center'>
                                <img onClick={() => handleUpdateQuantity(item, 1)} className='w-7 h-7' src={add} alt="" />
                                <MercadonaDialog item={item} />
                                <img onClick={async () => handleUpdateQuantity(item, -1)} className='w-6 h-6' src={less} alt="" />
                            </div>

                         }
                            {item.isDone && item.create_at && item.isDone_at && userIn?.email === 'carlosbrazon.sp3@gmail.com' && (
                                <div className=" flex w-12 text-[10px] justify-start items-start">
                                    {(() => {// esto es para medir el tiempo de las horas de limpieza en la oficina 4-3
                                        const startTime = new Date(item.create_at && item.create_at.toDate ? item.create_at.toDate() : item.create_at);
                                        const endTime = new Date(item.isDone_at && item.isDone_at.toDate ? item.isDone_at.toDate() : item.isDone_at);
                                        const diffMs = endTime - startTime; // Diferencia en milisegundos
                                        const diffHours = Math.floor(diffMs / (1000 * 60 * 60)); // Horas
                                        const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60)); // Minutos
                                        return `${diffHours} h ${diffMinutes} m`;
                                    })()}
                                </div>
                            )}
                            {userIn?.isDateControl && <div className=' flex whitespace-nowrap text-[9px] w-auto'>
                                <div className="flex flex-col items-center justify-center h-6">
                                    <div>
                                        {formatDate(item.create_at)}
                                    </div>

                                    {item.isDone && <div className="line-through">{formatDate(item.isDone_at)}</div>}
                                </div>
                            </div>}
                            {<AmountDialog item={item} setAmount={setAmount} />}

                            {userIn?.isDoneControl &&
                                <div onClick={() => handlePriority(item)} className="flex items-center justify-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 py-0.5 bg-slate-100 border border-gray-900">Urgente</div>}
                            <EditDialog item={item} />
                        </div>
                    </div>
                })
                : <p className='text-base'>Lista vacia</p>}
        </div>
    )
}

export default ItemsList
