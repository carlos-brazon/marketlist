import React, { useContext, useEffect, useState } from 'react'
import { AllItemsContext } from './components/Contex'
import { firstLetterUpperCase } from './utils/util';

const Tags = () => {
    const { list, setControlTags, button, setButton } = useContext(AllItemsContext);

    const tags = list?.reduce((acc, obj) => {
        if (obj.tags) {
            if (!acc.includes(obj.tags)) {
                acc.push(obj.tags);
            }
        }
        return acc.sort((a , b) => a.localeCompare(b) )
    }, []);

    useEffect(() => {
        if (tags?.length === 1) {
            setButton(tags[0]);
        }
    }, [tags]);
    return (
        <div className='flex gap-2 justify-center flex-wrap break-all'>
            <p onClick={() => setControlTags(prev => !prev)} className={`rounded-full w-8 h-8 bg-aquainput flex place-items-center border justify-center shadow-md shadow-gray-950 ${list?.length == 0 ? 'hidden' : ''}`}>+</p>

            {tags?.map((string, i) => <button key={i} onClick={() => setButton(tags.length === 1 ? tags[0] : string)} className={`p-1 font-semibold text-base rounded-md ${button === string ? 'bg-blue-800 text-white hover:shadow-blue-800 shadow-md shadow-blue-950' : 'bg-blue-400 hover:shadow-blue-400 shadow-md shadow-gray-500'}`}>{firstLetterUpperCase(string)}</button>)}
        </div>
    )
}

export default Tags