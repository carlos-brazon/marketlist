import { useContext } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { deleteDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from '../utils/util';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const DeleteDialog = () => {
    const { button, userIn, setButton, setAddTags, setTemporalCloud, temporalCloud } = useContext(AllItemsContext);

    const handleClick = async () => {
        setAddTags(false);
        let updateTemporalCloud = [];
        let itemsToDelete = []

        if (temporalCloud.length) {
            temporalCloud.forEach((item) => {
                if (item.tags == button) {
                    itemsToDelete.push(item)
                } else {
                    updateTemporalCloud.push(item);
                }
            });

            const newValueLastTags = updateTemporalCloud.length ? updateTemporalCloud[0].tags : "Compras"
            try {
                await Promise.all(
                    itemsToDelete.map((e) => deleteDoc(doc(db, "testlist", e.id)))
                );
                await updateDoc(doc(db, "test", userIn.uid), { last_tags: newValueLastTags })
            } catch (error) {
                console.error('Error al actualizar o eliminar documentos en Firestore:', error);
            }
            setButton(newValueLastTags)
            setTemporalCloud(updateTemporalCloud)
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm'>Eliminar Lista</div>
            </AlertDialogTrigger>
            <AlertDialogContent className='w-11/12 rounded-md top-1/2'>
                <AlertDialogHeader>
                    <AlertDialogTitle>{'¿Deseas borrar la lista'} {firstLetterUpperCase(button + '?' ?? '')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la lista.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex flex-row justify-end items-end gap-3'>
                    <DropdownMenuItem asChild><AlertDialogCancel className='w-24'>Cancel</AlertDialogCancel></DropdownMenuItem>
                    <AlertDialogAction className='w-24' onClick={() => handleClick()}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog