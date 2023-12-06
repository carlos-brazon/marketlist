import { useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { DialogClose } from '@radix-ui/react-dialog'
import { Button } from './ui/button';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { AllItemsContext } from './Contex';
import { db } from '../utils/firebase';
import PropTypes from 'prop-types';

const EditDialog = ({ item }) => {
  const { userIn, setList, setSelectedTag } = useContext(AllItemsContext)
  const [user, setUser] = useState({});
  EditDialog.propTypes = {
    item: PropTypes.any.isRequired,
  }


  const handleInput = () => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setUser(prev => ({ ...prev, [inputName]: inputValue }));
  }

  const handleSubmit = async () => {
    try {
      const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];
      if (!querySnapshot.empty) {
        const updatedMarkeList = market.map(itemListFromFirebase => {
          if (itemListFromFirebase.id === user.id) {
            return { ...itemListFromFirebase, name: user.name };
          }
          return itemListFromFirebase;
        });
        await updateDoc(doc(db, 'users4', userIn.uid), { markeList: updatedMarkeList });
        setList(updatedMarkeList)
        setSelectedTag(updatedMarkeList)
        console.log('isDone actualizado en Firestore correctamente.');
      } else {
        console.log('El documento no existe en Firestore.');
      }
    } catch (error) {
      console.error('Error al actualizar isDone en Firestore:', error);
    }
  }
  return (
    <Dialog>
      <DialogTrigger onClick={() => setUser(item)} className={'flex items-center w-auto h-7 z-50 rounded-md text-sm text-center px-0.5 bg-slate-100 border border-gray-900'}>Editar</DialogTrigger>
      <DialogContent>
        <DialogHeader className={'flex flex-col gap-5'}>
          <DialogTitle>¿Estás seguro que deseas editar este Item?</DialogTitle>
          <form className={`flex flex-col gap-4`}>
            <Input
              className={'w-28'}
              type={'text'}
              name={'name'}
              onChange={handleInput}
              value={user.name || ''}
              placeholder={'Item'}
              required
            />
            <DialogClose asChild className='flex justify-end gap-2'>
              <div><Button variant='outline'>Cancel</Button>
                <Button
                  onClick={() => { handleSubmit(), setUser(prev => ({ ...prev, id: item.id })) }}
                >Editar</Button></div>
            </DialogClose>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog