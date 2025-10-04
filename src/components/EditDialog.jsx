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
import { DialogDescription } from '@radix-ui/react-dialog';
import { cleanInputValueWithNumberOrLetters, firstLetterUpperCase } from '../utils/util';

const EditDialog = ({ item }) => {
  const { userIn, setTemporalCloud, list } = useContext(AllItemsContext)
  const [newValueInput, setNewValueInput] = useState({ name: item.name });
  const [editBlocked, setEditBlocked] = useState(!item.name);
  const [itemRepeated, setItemRepeated] = useState(!item.name);
  const [isOpen, setIsOpen] = useState(false);
  const [amoundPixel, setAmoundPixel] = useState(40);
  const hScreen = Math.round(window.innerHeight - 250)

  EditDialog.propTypes = {
    item: PropTypes.object.isRequired,
  }

  const handleInput = (event) => {
    const inputName = event.target.name;
    let inputValue = cleanInputValueWithNumberOrLetters(event.target.value);

    if (inputValue) {
      setEditBlocked(false);
    } else {
      setItemRepeated(false);
      setEditBlocked(true);

    }
    setNewValueInput({ [inputName]: inputValue });
  }

  const handleSubmit = async () => {
    event.preventDefault();
    if (newValueInput.name.length) {// aqui miro si el valor del input es real
      const newNameItemLowerCase = newValueInput.name.trim().toLowerCase()
      const itemFounded = list.find(item => item.name === newNameItemLowerCase)

      if (itemFounded) { // aqui miro si el nuevo nombre del item que estoy intentando editar es el mismo o ya existe en la lista seleccionada
        setItemRepeated(true);
        setEditBlocked(true);
      } else {
        try {
          setTemporalCloud(prev => prev.map(itemLocated => itemLocated.id == item.id ? { ...item, name: newNameItemLowerCase } : itemLocated));
          await updateDoc(doc(db, "dataItemsMarketList", item.id), { name: newNameItemLowerCase });
          setIsOpen(false);
        } catch (error) {
          console.error('Error al actualizar isDone en Firestore:', error);
        }
      }
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      {userIn?.isEditControl && <DialogTrigger onClick={() => {setIsOpen(true), setNewValueInput({ name: item.name })}} className="flex items-center w-auto h-5 z-50 rounded-md text-[10px] text-center px-0.5 bg-slate-100 border border-gray-900">Editar</DialogTrigger>}
      <DialogContent className={'rounded-lg top-1/3 md:top-1/2 md:w-[800px] '}>
        <DialogHeader className={'flex flex-col gap-5'}>
          <DialogTitle className={'text-base'}>¿Estás seguro que deseas editar este Item?</DialogTitle>
          <DialogDescription asChild>
            <form className={`flex flex-col gap-4`}>
              <div className='flex flex-col gap-2'>
                <div className={`relative ease-in-out duration-1000 flex items-start gap-1`} style={{ height: `${amoundPixel}px` }}>
                  <Textarea
                    className={`rounded-md border border-gray-500  focus:border-black focus:border-[3px] focus-visible:ring-0 focus:outline-0 focus:ring-offset-0 focus-visible:ring-offset-0 h-full break-words resize-none pr-8 overflow-hidden`}
                    type={'text'}
                    name={'name'}
                    onChange={handleInput}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        handleSubmit()
                      }
                    }}
                    value={firstLetterUpperCase(newValueInput.name) || ''}
                    placeholder={firstLetterUpperCase(item.name)}
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
                  {editBlocked && <p className='text-red-700 text-[12px] text-start'>
                    {itemRepeated ?
                      "El valor ingresado ya está asociado a un artículo existente."
                      : "No se puede editar la información si el campo está vacío."}</p>}
                </div>
              </div>
              <div className='flex gap-2 justify-end'>
                <Button onClick={() => { setIsOpen(false), setEditBlocked(false) }} variant='outline'>Cancel</Button>
                <Button disabled={editBlocked && item.name} type="submit" onClick={() => handleSubmit()}>Editar</Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}

export default EditDialog