import { useContext } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from '../utils/util';
import { Button } from './ui/button';

const DeleteDialog = () => {
    const { button, setButton, setList, userIn, setAddTags, setSelectedTag } = useContext(AllItemsContext);

    const handleClick = async () => {
        setAddTags(false);
        const userDocRef = doc(db, 'users4', userIn.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userDocData = userDocSnapshot.data();
            const updatedMarkeList = userDocData.markeList.filter(item => item.tags !== button);
            const tags = updatedMarkeList.reduce((acc, obj) => {
                if (obj.tags) {
                    if (!acc.includes(obj.tags)) {
                        acc.push(obj.tags);
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
            await updateDoc(userDocRef, { markeList: updatedMarkeList });
        }
    }

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button className="absolute bottom-3">Eliminar lista</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>¿Deseas borrar la lista? {firstLetterUpperCase(button ?? '')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la lista.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => handleClick()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog