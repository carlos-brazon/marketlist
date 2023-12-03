import { useContext, useEffect, useState } from 'react'
import { AllItemsContext } from './components/Contex'
import { firstLetterUpperCase } from './utils/util';
import Add from "./assets/add-black.svg";


const Tags = () => {
    const { setList, setControlTags, button, setButton, list, selectedTag } = useContext(AllItemsContext);
    const [tags, setTags] = useState([]);

    const handleClic = (string) => {
        setButton(tags.length === 1 ? tags[0] : string)
        setList(() => {
            const yyy = selectedTag?.filter(item => {
                const array = []
                if (item.tags === string) {
                    array.push(item)
                }
                return array
            })
            return yyy
        })
    }

    useEffect(() => {
        setTags(() => {
            const tags2 = selectedTag?.reduce((acc, obj) => {
                if (obj.tags) {
                    if (!acc.includes(obj.tags)) {
                        acc.push(obj.tags);
                    }
                }
                return acc
            }, []);
            return tags2
        })
        if (tags?.length === 1) {
            setButton(tags[0]);
        }
    }, [list]);
    return (
        <div className='w-full flex gap-2 flex-wrap break-all'>
            <img onClick={() => setControlTags(prev => !prev)} className='w-8 h-8' src={Add} alt="Aquí va la imagen de un Add" />

            {tags?.map((string, i) => <button key={i} onClick={() => handleClic(string)} className={`p-1 font-semibold text-sm rounded-md ${button === string ? 'bg-blue-600 text-white hover:shadow-blue-800 shadow-md shadow-blue-950' : 'bg-blue-400 hover:shadow-blue-400 shadow-md shadow-gray-500'}`}>{firstLetterUpperCase(string)}</button>)}
        </div>
    )
}
export default Tags