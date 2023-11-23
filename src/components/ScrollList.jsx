// import { ScrollArea } from '@radix-ui/react-scroll-area'
// import React, { useContext } from 'react'
// import EditDialog from './EditDialog'
// import { AllItemsContext } from './Contex'
// import { firstLetterUpperCase } from '../utils/util'

// const ScrollList = () => {
//     const { list, button } = useContext(AllItemsContext)
//     return (
//         <ScrollArea className="h-[400px] w-full rounded-md border">
//             {list?.length ?
//                 list?.map((item, index) => {
//                     if (item.tags === button) {
//                         return <li
//                             className={`list-disc list-inside break-normal items-center justify-between flex gap-2 m-0.5 rounded py-1 px-2 ${item.isDone ? 'line-through' : ''} ${item.priority ? 'bg-red-300' : index % 2 === 0 ? 'bg-blue-200' : 'bg-slate-50'}`}
//                             key={index}
//                         >
//                             <div className='w-full text-lg' onClick={() => handleClick(item)}>{firstLetterUpperCase(item.name)}</div>
//                             <div onClick={() => handlePriority(item)} className={`flex items-center w-auto h-7 z-50 rounded text-xs text-center px-0.5 ${priority ? 'bg-red-400' : 'bg-slate-400'}`}>Urgente</div>
//                             <EditDialog item={item} />
//                         </li>
//                     }
//                 })
//                 : <p className='text-base'>Lista vacia</p>}
//         </ScrollArea>
//     )
// }

// export default ScrollList