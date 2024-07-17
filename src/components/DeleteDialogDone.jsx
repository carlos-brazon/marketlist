import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTrigger } from './ui/alert-dialog'
import { Button } from './ui/button'
import { AlertDialogTitle } from '@radix-ui/react-alert-dialog'
import { firstLetterUpperCase } from '../utils/util'
import { AllItemsContext } from './Contex'
import { useContext } from 'react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { db2 } from '../utils/firebase'

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
            <AlertDialogTrigger asChild>
                <div className='flex gap-2'>
                    <Button>Eliminar tachados</Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{"¿Deseas borrar todos los elementos tachados de la lista"} {firstLetterUpperCase(button + '?' ?? '')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente los elementos tachados.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleDeleteDone()}>Continuar</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialogDone