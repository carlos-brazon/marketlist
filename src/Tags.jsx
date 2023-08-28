import React, { useContext, useState } from 'react'
import { AllItemsContext } from './components/Contex'
import { Link } from 'react-router-dom';

const Tags = () => {
    const { marketData, setControlTags, button, setButton} = useContext(AllItemsContext);

    const tags = marketData.reduce((acc, obj) => {
        if (obj.tags) {
            if (!acc.includes(obj.tags)) {
                acc.push(obj.tags);
            }
        }

        return acc
    }, [])

  return (
    <div className='flex gap-2 justify-center'>
        <p onClick={() => setControlTags(prev =>!prev)  } className={`rounded-full w-8 h-8 bg-aquainput flex place-items-center border justify-center ${!marketData.length ? 'hidden' : ''}`}>+</p>
        {tags.map(string => <button onClick={() => setButton(tags.length==1 ? 'Compras' : string) } className={`p-1 font-semibold text-base rounded-md ${button === string ? 'bg-blue-800 text-white' : 'bg-blue-400'}`}>{string}</button>)}
    </div>
  )
}

export default Tags