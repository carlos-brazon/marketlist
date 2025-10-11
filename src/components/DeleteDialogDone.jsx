import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from './ui/alert-dialog'
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import { firstLetterUpperCase } from '../utils/util'
import { AllItemsContext } from './Contex'
import { useContext } from 'react'
import { deleteDoc, doc, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const DeleteDialogDone = () => {
    const { button, setButton, setAddTags, temporalCloud, setTemporalCloud, userIn } = useContext(AllItemsContext)

    const handleDeleteDone = async () => {
        setAddTags(false);
        if (temporalCloud.length) {
            try {
                let itemsToDelete = []

                const updateTemporalCloud = temporalCloud.filter(item => {
                    if (item.isDone == true && item.tags == button) {
                        itemsToDelete.push(item);
                    } else {
                        return item
                    }
                });
                const noFoundTagsInFirebase = updateTemporalCloud.find(item => item.tags == button)// si consigue un item no hay necesidad de cambiar el estado button

                if (itemsToDelete.length) {
                    if (!noFoundTagsInFirebase) {//sino consigue la tags en updateTemporalCloud lo hago true para cambiar el nuevo valor de button
                        const newValueLastTags = updateTemporalCloud[0]?.tags || "Compras";
                        setButton(newValueLastTags)
                        await updateDoc(doc(db, "userMarketList", userIn.uid), { last_tags: newValueLastTags })
                    }
                    await Promise.all(
                        itemsToDelete.map(async (item) => await deleteDoc(doc(db, "dataItemsMarketList", item.id)))
                    )
                    setTemporalCloud(updateTemporalCloud);
                }
            } catch (error) {
                console.error('Error al actualizar Firestore:', error);
            }
        }
    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm'>Eliminar Tachados</div>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-11/12 rounded-md top-1/2'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{"¿Deseas borrar todos los elementos tachados de la lista"} {firstLetterUpperCase((button ?? '') + '?')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente los elementos tachados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={'flex flex-row justify-end items-end gap-3'}>
                    <DropdownMenuItem asChild><AlertDialogCancel className='w-24'>Cancel</AlertDialogCancel></DropdownMenuItem>
                    <AlertDialogAction className='w-24' onClick={() => handleDeleteDone()}><DropdownMenuItem className='focus:bg-gray-800 focus:text-white'>Continuar</DropdownMenuItem></AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialogDone