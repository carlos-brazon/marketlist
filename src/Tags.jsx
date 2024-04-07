import { useContext, useEffect, useState } from 'react'
import { AllItemsContext } from './components/Contex'
import { firstLetterUpperCase } from './utils/util';
import Add from "./assets/add-black.svg";
import { doc, updateDoc } from 'firebase/firestore';
import { db2 } from './utils/firebase';

const Tags = () => {
    const { userIn, setValueInputNewTags, setList, setAddTags, button, setButton, list, selectedTag } = useContext(AllItemsContext);
    const [tags, setTags] = useState([]);

    const handleClic = async (string) => {
        setButton(tags.length === 1 ? tags[0] : string)
        setList(() => {
            const arrayTagsFilter = selectedTag?.filter(item => item.tags === string)
            return arrayTagsFilter
        })
        await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { last_tags: string })
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

            {tags?.map((string, i) => <button key={i} onClick={() => handleClic(string)} className={`p-1 font-semibold text-xs rounded-md ${button === string ? 'bg-slate-700 text-white shadow-md shadow-gray-600' : 'bg-slate-400 shadow-md shadow-gray-300'}`}>{firstLetterUpperCase(string)}</button >)}
        </div>
    )
}
export default Tags