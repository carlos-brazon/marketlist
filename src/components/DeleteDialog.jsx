import { useContext } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db2 } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from '../utils/util';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const DeleteDialog = () => {
    const { button, setButton, setList, userIn, setAddTags, setSelectedTag } = useContext(AllItemsContext);

    const handleClick = async () => {
        setAddTags(false);
        const userDocRef = doc(db2, 'usersMarketList', userIn.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userDocData = userDocSnapshot.data();
            const updatedMarkeList = userDocData.markeList.filter(item => item.tags !== button);
            const tags = updatedMarkeList.reduce((acc, itemList) => {
                if (itemList.tags) {
                    if (!acc.includes(itemList.tags)) {
                        acc.push(itemList.tags);
                    }
                }
                return acc
            }, []);
            if (tags.length) {
                setButton(tags[0])
            } else {
                setButton('Compras');
            }
            setList(updatedMarkeList);
            setSelectedTag(updatedMarkeList);
            await updateDoc(userDocRef, { last_tags: tags[0] || '', markeList: updatedMarkeList });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <div className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm'>Eliminar Lista</div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{'¿Deseas borrar la lista'} {firstLetterUpperCase(button + '?' ?? '')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la lista.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className='flex flex-row-reverse items-end gap-2'>
                    <AlertDialogAction className='w-24' onClick={() => handleClick()}>Continuar</AlertDialogAction>
                    <DropdownMenuItem asChild><AlertDialogCancel className='w-24'>Cancel</AlertDialogCancel></DropdownMenuItem>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog