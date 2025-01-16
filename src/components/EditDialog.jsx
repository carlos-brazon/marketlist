import { useContext, useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from './ui/button';
import { doc, updateDoc } from 'firebase/firestore';
import { AllItemsContext } from './Contex';
import { db } from '../utils/firebase';
import PropTypes from 'prop-types';
import { Textarea } from './ui/textarea';
import chevronDown from "../assets/chevronDown.svg";
import chevronUp from "../assets/chevronUp.svg";

const EditDialog = ({ item }) => {
  const { userIn, setList } = useContext(AllItemsContext)
  const [newValueInput, setNewValueInput] = useState({ name: item.name });
  const [editBlocked, setEditBlocked] = useState(!item.name);
  const [isOpen, setIsOpen] = useState(false);
  const [amoundPixel, setAmoundPixel] = useState(40);
  const hScreen = Math.round(window.innerHeight - 250)

  EditDialog.propTypes = {
    item: PropTypes.object.isRequired,
  }

  const handleInput = (event) => {
    const inputName = event.target.name;
    let inputValue = event.target.value;
    // Eliminar espacios iniciales
    inputValue = inputValue.replace(/^\s+/, '');
    // Reemplazar más de dos espacios consecutivos por un solo espacio
    inputValue = inputValue.replace(/\s{2,}/g, ' ');

    if (inputValue) {
      setEditBlocked(false)
    } else {
      setEditBlocked(true)

    }
    setNewValueInput({ [inputName]: inputValue });
  }

  const handleSubmit = async () => {
    event.preventDefault();

    try {
      await updateDoc(doc(db, "testlist", item.id), { name: newValueInput.name.trim() })
      setList(prev => prev.map(itemLocated => itemLocated.id == item.id ? { ...item, name: newValueInput.name.trim() } : itemLocated))
      setIsOpen(false)
    } catch (error) {
      console.error('Error al actualizar isDone en Firestore:', error);
    }
  }

  return (
    <Dialog open={isOpen} onChange={isOpen} setIsOpen={setIsOpen}>
      <DialogTrigger onClick={() => setIsOpen(true)} className={`flex items-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 bg-slate-100 border border-gray-900 ${userIn?.isEditControl || 'hidden'}`}>Editar</DialogTrigger>
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
                  value={newValueInput.name || ''}
                  placeholder={'Item'}
                  required
                />
                <div className='h-7 w-7 absolute right-0'>
                  <img className={`mt-[6px] ${amoundPixel > 40 ? 'hidden' : ''}`} onClick={() => setAmoundPixel(prev => prev + 50)} src={chevronDown} alt="" />
                  <div className={`flex flex-col relative ${amoundPixel == 40 ? '-z-20' : ''}`}>
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