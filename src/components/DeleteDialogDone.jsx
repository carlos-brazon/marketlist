import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from './ui/alert-dialog'
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import { firstLetterUpperCase } from '../utils/util'
import { AllItemsContext } from './Contex'
import { useContext } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db2 } from '../utils/firebase'
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const DeleteDialogDone = () => {
    const { userIn, button, setButton, setList, setSelectedTag, setAddTags } = useContext(AllItemsContext)

    const handleDeleteDone = async () => {
        setAddTags(false);
        const userDocRef = doc(db2, 'usersMarketList', userIn.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userDocData = userDocSnapshot.data();
            const updatedMarkeList = userDocData.markeList.filter(item => item.isDone == false);
            const tags = updatedMarkeList.reduce((acc, itemList) => {
                if (itemList.tags) {
                    if (!acc.includes(itemList.tags)) {
                        acc.push(itemList.tags);
                    }
                }
                return acc
            }, []);
            if (tags.length == 1) {
                setButton(tags[0])
            }
            setList(updatedMarkeList);
            setSelectedTag(updatedMarkeList);
            await updateDoc(userDocRef, { last_tags: tags.length > 1 && tags.includes(button) ? button : tags[0] || '', markeList: updatedMarkeList });
        }

    }
    return (
        <AlertDialog>
            <AlertDialogTrigger>
                <div className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm'>Eliminar Tachados</div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{"¿Deseas borrar todos los elementos tachados de la lista"} {firstLetterUpperCase(button + '?' ?? '')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente los elementos tachados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className={'flex items-center gap-1'}>
                    <DropdownMenuItem asChild><AlertDialogCancel className='w-24'>Cancel</AlertDialogCancel></DropdownMenuItem>
                    <AlertDialogAction className='w-24' onClick={() => handleDeleteDone()}><DropdownMenuItem className='focus:bg-gray-800 focus:text-white'>Continuar</DropdownMenuItem></AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialogDone