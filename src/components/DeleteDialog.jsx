import { useContext, useState } from 'react'
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from './ui/alert-dialog';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { db2 } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from '../utils/util';
import { Button } from './ui/button';

const DeleteDialog = () => {
    const { button, setButton, setList, userIn, setAddTags, setSelectedTag } = useContext(AllItemsContext);
    const [done, setDone] = useState(false)

    const handleClick = async () => {
        setAddTags(false);
        const userDocRef = doc(db2, 'usersMarketList', userIn.uid);
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
            await updateDoc(userDocRef, { last_tags: tags[0] || '', markeList: updatedMarkeList });
        }
    }
    const handleDeleteDone = async () => {
        setAddTags(false);
        const userDocRef = doc(db2, 'usersMarketList', userIn.uid);
        const userDocSnapshot = await getDoc(userDocRef);

        if (userDocSnapshot.exists()) {
            const userDocData = userDocSnapshot.data();
            const updatedMarkeList = userDocData.markeList.filter(item => item.isDone == false);
            const tags = updatedMarkeList.reduce((acc, obj) => {
                if (obj.tags) {
                    if (!acc.includes(obj.tags)) {
                        acc.push(obj.tags);
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
                    <Button onClick={() => setDone(true)} className="">Eliminar lista</Button>
                    <Button onClick={() => setDone(false)} className="">Elimina tachados</Button>
                </div>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{done ? '¿Deseas borrar la lista' : "¿Deseas borrar todos los tachados de la lista"} {firstLetterUpperCase(button + '?' ?? '')}</AlertDialogTitle>
                    <AlertDialogDescription>
                        Esta acción no se puede deshacer. Esto eliminará permanentemente la lista.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={() => done ? handleClick() : handleDeleteDone()}>Continue</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}

export default DeleteDialog