import { useContext, useEffect, useState } from 'react'
import { AllItemsContext } from './Contex'
import { firstLetterUpperCase } from '../utils/util';
import Add from "../assets/add-black.svg";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Separator } from "@/components/ui/separator"
import moremenu from "/src/assets/more-menu3.svg";
import check from "/src/assets/check-true.svg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditDialogList from './EditDialogList';
import DeleteDialogDone from './DeleteDialogDone';
import DeleteDialog from './DeleteDialog';
import PropTypes from 'prop-types';

const Tags = ({ setAmount }) => {
    Tags.propTypes = {
        setAmount: PropTypes.func,
    };
    const { userIn, setValueInputNewTags, setAddTags, button, setButton, tags, setTags, temporalCloud, setUserIn } = useContext(AllItemsContext);
    const [isDropOpen, setIsDropOpen] = useState(false)
    const [isDialogOpen, setIsDialogOpen] = useState(false)

    const handleClic = async (string) => {
        await updateDoc(doc(db, 'userMarketList', userIn.uid), { last_tags: string });
        setButton(string)
        setValueInputNewTags(string)
        const listByTags = temporalCloud.filter(item => item.tags.toLowerCase() == string);
        const totalAmountToPrint = listByTags.reduce((amountAccumulator, currentItem) => amountAccumulator + currentItem.amount, 0);
        setAmount(totalAmountToPrint);
        setUserIn(prev => ({ ...prev }));
    }
    const handleOrder = async () => {
        const newValueOrder = !userIn.sortAscending
        setUserIn(prev => ({
            ...prev,
            sortAscending: newValueOrder
        }));
        await updateDoc(doc(db, "userMarketList", userIn.uid), { sortAscending: newValueOrder });
    }
    const handleUrgente = async () => {
        const newValueUrgent = !userIn.orderByUrgent
        setUserIn(prev => ({
            ...prev,
            orderByUrgent: newValueUrgent
        }));
        await updateDoc(doc(db, "userMarketList", userIn.uid), { orderByUrgent: !userIn.orderByUrgent });
    }

    useEffect(() => {
        const itemsWithTagsAndDate = temporalCloud.map(doc => ({
            tag: doc.tags.toLowerCase(),
            createAt: doc.create_at || doc.create_at?.toDate(), // Asegurarse de que create_at sea un objeto de fecha
        }));

        // Ordenar los elementos por `create_at`
        itemsWithTagsAndDate.sort((a, b) => a.createAt - b.createAt);

        // Extraer las tags únicas en orden
        const uniqueTags = Array.from(new Set(itemsWithTagsAndDate.map(item => item.tag.toLowerCase())));

        // Actualizar el estado `tags`
        setTags(uniqueTags);
        setButton(uniqueTags.length === 1 ? uniqueTags[0].toLowerCase() : button.toLowerCase());


    }, [temporalCloud]);
    return (
        <div className='w-full flex gap-2 flex-wrap break-all'>
            <img onClick={() => (setAddTags(prev => !prev), setValueInputNewTags(button))} className='w-8 h-8' src={Add} alt="Aquí va la imagen de un Add" />

            {tags?.map((string, i) =>
                <div key={i} className={`cursor-pointer font-semibold text-xs rounded-md flex items-center ${button.toLowerCase() === string.toLowerCase() ? 'bg-slate-700 text-white shadow-md shadow-gray-600' : 'bg-slate-400 shadow-md shadow-gray-300'}`}>

                    {button.toLowerCase() === string.toLowerCase() ?
                        <>
                            <button onClick={() => handleClic(string.toLowerCase())}
                                className={`px-[10px]`}>
                                <p >{firstLetterUpperCase(string)}</p>
                            </button >
                            <div> {isDialogOpen ? <EditDialogList isDialogOpen={isDialogOpen} setIsDialogOpen={setIsDialogOpen} /> : <div></div>}</div>
                            <Separator orientation="vertical" className='h-4 font-bold' />
                            <DropdownMenu asChild open={isDropOpen} onOpenChange={setIsDropOpen}>
                                <DropdownMenuTrigger>
                                    <img className='h-5 my-1.5 mr-1.5 ml-1' src={moremenu} alt="" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={'flex flex-col items-end'} >
                                    <div >
                                        <div onClick={() => { setIsDropOpen(false), setIsDialogOpen(true), setIsDialogOpen(true) }} className="px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm">Editar Lista</div>
                                    </div>

                                    <DeleteDialogDone />
                                    <DeleteDialog setIsDropOpen={setIsDropOpen} />

                                    <DropdownMenuItem className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm' onClick={() => setTimeout(() => {
                                        handleOrder()
                                    }, 10)}>
                                        <div className='flex gap-2 items-center'>
                                            {userIn?.sortAscending && (
                                                <img className='w-4 h-4' src={check} alt="un check" />
                                            )}

                                            <div>Ordenar A-Z</div>
                                        </div>
                                    </DropdownMenuItem>

                                    <DropdownMenuItem className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm' onClick={() => setTimeout(() => {
                                        handleUrgente()
                                    }, 10)}>
                                        <div className='flex gap-2 items-center'>
                                            {userIn?.orderByUrgent && (
                                                <img className='w-4 h-4' src={check} alt="un check" />
                                            )}

                                            <div>Ordenar urgentes</div>
                                        </div>
                                    </DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </> : <button
                            onClick={() => handleClic(string.toLowerCase())}
                            className={`px-2 h-8`}>
                            {firstLetterUpperCase(string)}
                        </button >}

                </div>

            )}
        </div>
    )
}
export default Tags
