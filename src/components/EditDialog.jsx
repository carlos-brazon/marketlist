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
import chevronDown from "../assets/chevronDown.svg";
import chevronUp from "../assets/chevronUp.svg";

const EditDialog = ({ item, isEditControl }) => {
  const { userIn, setList, setSelectedTag } = useContext(AllItemsContext)
  const [user, setUser] = useState({});
  const [editBlocked, setEditBlocked] = useState(!item.name);
  const [isOpen, setIsOpen] = useState(false);
  const [amoundPixel, setAmoundPixel] = useState(40);

  EditDialog.propTypes = {
    item: PropTypes.object.isRequired,
    isEditControl: PropTypes.bool.isRequired
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
  const hScreen = Math.round(window.innerHeight - 250)
  return (
    <Dialog open={isOpen} onChange={isOpen} setIsOpen={setIsOpen}>
      <DialogTrigger onClick={() => [setUser(item), setIsOpen(true)]} className={`flex items-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 bg-slate-100 border border-gray-900 ${isEditControl || 'hidden'}`}>Editar</DialogTrigger>
      <DialogContent className={'rounded-lg top-1/2'}>
        <DialogHeader className={'flex flex-col gap-5'}>
          <DialogTitle className={'text-base'}>¿Estás seguro que deseas editar este Item?</DialogTitle>
          <form className={`flex flex-col gap-4`}>
            <div className='flex flex-col gap-2'>
              <div className={`relative ease-in-out duration-1000 flex items-start gap-1`} style={{ height: `${amoundPixel}px` }}>
                <Textarea
                  className={`w-[330px] md:w-full rounded-md border border-gray-500  focus:border-black focus:border-[3px] focus-visible:ring-0 focus:outline-0 focus:ring-offset-0 focus-visible:ring-offset-0 h-full break-words resize-none pr-8 overflow-hidden`}
                  type={'text'}
                  name={'name'}
                  onChange={handleInput}
                  onKeyDown={(event) => {
                    if (event.key === 'Enter') {
                      handleSubmit()
                    }
                  }}
                  value={user.name || ''}
                  placeholder={'Item'}
                  required
                />
                <div className='h-7 w-7 absolute right-0'>
                  <img className={`mt-[6px] ${amoundPixel > 40 ? 'hidden' : ''}`} onClick={() => setAmoundPixel(prev => prev + 50)} src={chevronDown} alt="" />
                  <div className='flex flex-col relative'>
                    <img className={`mt-[6px] h-7 w-7 ${amoundPixel == 40 ? 'opacity-0 blur-3xl' : 'opacity-100 duration-[1000ms]'}`} onClick={() => setAmoundPixel(prev => {
                      if (prev > 40) {
                        return prev - 50
                      }
                      if (prev == 40) {
                        return prev
                      }
                    })} src={chevronUp} alt="Icon of chervronUp" />

                    <img className={`mt-[6px] h-7 w-7 ${amoundPixel == 40 ? 'opacity-0 blur-3xl' : 'opacity-100 duration-[1000ms]'}`} onClick={() => setAmoundPixel(prev => {
                      if (amoundPixel < hScreen) {
                        return prev + 50
                      } else {
                        return prev
                      }
                    })} src={chevronDown} alt="Icon of chervronDown" />
                  </div>
                </div>
              </div>
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