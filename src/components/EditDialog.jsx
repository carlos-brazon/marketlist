import { useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { AllItemsContext } from './Contex';
import { db2 } from '../utils/firebase';
import PropTypes from 'prop-types';
import { Textarea } from './ui/textarea';

const EditDialog = ({ item }) => {
  const { userIn, setList, setSelectedTag } = useContext(AllItemsContext)
  const [user, setUser] = useState({});
  const [editBlocked, setEditBlocked] = useState(!item.name);
  const [isOpen, setIsOpen] = useState(false);

  EditDialog.propTypes = {
    item: PropTypes.any.isRequired,
  }

  const handleInput = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    if (inputValue) {
      setEditBlocked(false)
    } else {
      setEditBlocked(true)

    }
    setUser(prev => ({ ...prev, [inputName]: inputValue }));
  }

  const handleSubmit = async () => {
    event.preventDefault();
    try {
      if (user.name.trim()) {
        const querySnapshot = await getDocs(query(collection(db2, 'usersMarketList'), where('email', '==', userIn.email)));
        const market = querySnapshot.docs[0]?.data()?.markeList || [];
        if (!querySnapshot.empty) {
          const updatedMarkeList = market.map(itemListFromFirebase => {
            if (itemListFromFirebase.id === user.id) {
              return { ...itemListFromFirebase, name: user.name };
            }
            return itemListFromFirebase;
          });
          await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { markeList: updatedMarkeList });
          setList(updatedMarkeList)
          setSelectedTag(updatedMarkeList)
          console.log('isDone actualizado en Firestore correctamente.');
          setIsOpen(false)
        } else {
          console.log('El documento no existe en Firestore.');
        }
      } else {
        setEditBlocked(item.name)
      }
    } catch (error) {
      console.error('Error al actualizar isDone en Firestore:', error);
    }
  }
  return (
    <Dialog open={isOpen} onChange={isOpen} setIsOpen={setIsOpen}>
      <DialogTrigger onClick={() => [setUser(item), setIsOpen(true)]} className={'flex items-center w-auto h-7 z-50 rounded-md text-sm text-center px-0.5 bg-slate-100 border border-gray-900'}>Editar</DialogTrigger>
      <DialogContent className={'rounded-lg'}>
        <DialogHeader className={'flex flex-col gap-5'}>
          <DialogTitle className={'text-base'}>¿Estás seguro que deseas editar este Item?</DialogTitle>
          <form className={`flex flex-col gap-4`}>
            <div className='flex flex-col gap-2'>
              <Textarea
                className={'p-2 min-h-[40px] w-[330px] md:w-full'}
                type={'text'}
                name={'name'}
                onChange={handleInput}
                value={user.name}
                placeholder={'Item'}
                required
              />
              <div className='h-6'>
                {editBlocked && <p className='text-red-700 text-[12px]'>No se puede editar la información si el campo está vacío.</p>}
              </div>
            </div>
            <div className='flex gap-2 justify-end'>
              <Button onClick={() => setIsOpen(false)} variant='outline'>Cancel</Button>
              <Button disabled={editBlocked && item.name} type="submit" onClick={() => handleSubmit()}>Editar</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog