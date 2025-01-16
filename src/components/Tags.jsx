import { useContext, useEffect } from 'react'
import { AllItemsContext } from './Contex'
import { firstLetterUpperCase } from '../utils/util';
import Add from "../assets/add-black.svg";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { Separator } from "@/components/ui/separator"
import moremenu from "/src/assets/more-menu3.svg";
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
    const { userIn, setValueInputNewTags, setList, setAddTags, button, setButton, list, tags, setTags, temporalCloud } = useContext(AllItemsContext);


    const handleClic = async (string) => {
        await updateDoc(doc(db, 'test', userIn.uid), { last_tags: string });
        setButton(string)
        setValueInputNewTags(string)
        const listByTags = temporalCloud.filter(item => item.tags == string);
        const totalAmountToPrint = listByTags.reduce((amountAccumulator, currentItem) => amountAccumulator + currentItem.amount, 0);
        setList(listByTags);
        setAmount(totalAmountToPrint);
    }
    const handleOrder = async () => {
        const sortedList = list?.filter(item => item.tags === button).sort((a, b) => a.name.localeCompare(b.name));
        await setList(sortedList);
    }
    const handleUrgente = () => {
        const urgentList = list?.filter(item => item.tags === button).sort((a, b) => (a.priority ? -1 : 1) - (b.priority ? -1 : 1));
        setList(urgentList);
    }

    useEffect(() => {
        const itemsWithTagsAndDate = temporalCloud.map(doc => ({
            tag: doc.tags,
            createAt: doc.create_at || doc.create_at?.toDate(), // Asegurarse de que create_at sea un objeto de fecha
        }));

        // Ordenar los elementos por `create_at`
        itemsWithTagsAndDate.sort((a, b) => a.createAt - b.createAt);

        // Extraer las tags únicas en orden
        const uniqueTags = Array.from(new Set(itemsWithTagsAndDate.map(item => item.tag)));

        // Actualizar el estado `tags`
        setTags(uniqueTags);
        setButton(uniqueTags.length === 1 ? uniqueTags[0] : button);


    }, [temporalCloud]);
    return (
        <div className='w-full flex gap-2 flex-wrap break-all'>
            <img onClick={() => (setAddTags(prev => !prev), setValueInputNewTags(button))} className='w-8 h-8' src={Add} alt="Aquí va la imagen de un Add" />

            {tags?.map((string, i) =>
                <div key={i} className={`cursor-pointer font-semibold text-xs rounded-md flex items-center ${button === string ? 'bg-slate-700 text-white shadow-md shadow-gray-600' : 'bg-slate-400 shadow-md shadow-gray-300'}`}>

                    {button === string ?
                        <>
                            <button onClick={() => handleClic(string)}
                                className={`px-[10px]`}>
                                <p >{firstLetterUpperCase(string)}</p>
                            </button >
                            <Separator orientation="vertical" className='h-4 font-bold' />
                            <DropdownMenu asChild>
                                <DropdownMenuTrigger>
                                    <img className='h-5 my-1.5 mr-1.5 ml-1' src={moremenu} alt="" />
                                </DropdownMenuTrigger>
                                <DropdownMenuContent className={'flex flex-col items-end'} >
                                    <EditDialogList />
                                    <DeleteDialogDone />
                                    <DeleteDialog />
                                    <DropdownMenuItem className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm' onClick={() => setTimeout(() => {
                                        handleOrder()
                                    }, 10)}> Ordenar A-Z</DropdownMenuItem>
                                    <DropdownMenuItem className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm' onClick={() => setTimeout(() => {
                                        handleUrgente()
                                    }, 10)}> Ordenar Urgente</DropdownMenuItem>
                                </DropdownMenuContent>
                            </DropdownMenu>
                        </> : <button
                            onClick={() => handleClic(string)}
                            className={`px-2 h-8`}>
                            {firstLetterUpperCase(string)}
                        </button >}

                </div>

            )}
        </div>
    )
}
export default Tags
