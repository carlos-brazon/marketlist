import { useContext, useEffect, useState } from 'react'
import { AllItemsContext } from './components/Contex'
import { firstLetterUpperCase } from './utils/util';
import Add from "./assets/add-black.svg";
import { doc, updateDoc } from 'firebase/firestore';
import { db2 } from './utils/firebase';
import { Separator } from "@/components/ui/separator"
import moremenu from "/src/assets/more-menu3.svg";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import EditDialogList from './components/EditDialogList';
import DeleteDialogDone from './components/DeleteDialogDone';
import DeleteDialog from './components/DeleteDialog';

const Tags = ({ setAmount }) => {
    const { userIn, setValueInputNewTags, setList, setAddTags, button, setButton, list, selectedTag, setSelectedTag } = useContext(AllItemsContext);
    const [tags, setTags] = useState([]);

    const handleClic = async (string) => {
        let numberToAmount = 0
        const arrayTagsFilter = selectedTag?.filter(item => {
            if (item.tags === string) {
                if (item.amount) {
                    numberToAmount = numberToAmount + item.amount
                }
                return item
            }
            return item
        })
        setSelectedTag(arrayTagsFilter)
        setAmount(Number(numberToAmount))
        setButton(tags.length === 1 ? tags[0] : string)
        setList(() => selectedTag.filter(item => item.tags === string))
        await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { last_tags: string })
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
        setTags(() => {
            const tagsToPrint = selectedTag?.reduce((acc, obj) => {
                if (obj.tags && !acc.includes(obj.tags)) {
                    acc.push(obj.tags);
                }
                return acc
            }, []);
            return tagsToPrint
        })

    }, [list]);
    return (
        <div className='w-full flex gap-2 flex-wrap break-all'>
            <img onClick={() => (setAddTags(prev => !prev), setValueInputNewTags(button))} className='w-8 h-8' src={Add} alt="Aquí va la imagen de un Add" />

            {tags?.map((string, i) =>
                <div key={i} onClick={() => handleClic(string)} className={`cursor-pointer font-semibold text-xs rounded-md flex items-center ${button === string ? 'bg-slate-700 text-white shadow-md shadow-gray-600' : 'bg-slate-400 shadow-md shadow-gray-300'}`}>

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
                            className={`px-2 h-6`}>
                            {firstLetterUpperCase(string)}
                        </button >}

                </div>

            )}
        </div>
    )
}
export default Tags
