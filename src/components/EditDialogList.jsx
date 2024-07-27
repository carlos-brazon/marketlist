import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useContext, useState } from 'react';
import { AllItemsContext } from './Contex';
import { DialogClose } from '@radix-ui/react-dialog';
import { collection, doc, getDocs, query, updateDoc, where } from 'firebase/firestore';
import { db2 } from '../utils/firebase';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const EditDialogList = () => {
  const { button, userIn, setList, setSelectedTag, setButton } = useContext(AllItemsContext);
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState({});
  const [editBlocked, setEditBlocked] = useState(false);

  const handleInput = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setUser(prev => ({ ...prev, [inputName]: inputValue }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (user.name) {
      const dataFirebase = await getDocs(query(collection(db2, 'usersMarketList'), where('email', '==', userIn.email)));
      const arrayMarketListFromFireBase = dataFirebase.docs[0]?.data()?.markeList || [];
      const updatedMarkeList = arrayMarketListFromFireBase.map(itemListFromFirebase => {
        if (itemListFromFirebase.tags === button) {
          return { ...itemListFromFirebase, tags: user.name };
        }
        return itemListFromFirebase;
      });
      setButton(user.name)
      setList(updatedMarkeList)
      setSelectedTag(updatedMarkeList)
      await updateDoc(doc(db2, 'usersMarketList', userIn.uid), { last_tags: user.name, markeList: updatedMarkeList });
      setIsOpen(false);
    } else {
      setEditBlocked(true)
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <div className='px-2 py-1.5 text-sm hover:bg-slate-100 rounded-sm'>Editar Lista</div>
      </DialogTrigger>
      <DialogContent className="rounded-lg">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle className="text-base">¿Estás seguro que deseas editar el nombre de la lista?</DialogTitle>
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <input
                className="p-2 min-h-[40px] w-[330px] md:w-full"
                type="text"
                name="name"
                onChange={handleInput}
                value={user.name || ''}
                placeholder={button}
                required
                onKeyDown={(event) => {
                  if (event.key === "Enter") {
                    event.preventDefault();
                    handleSubmit(event);
                  }
                }}
              />
              <div className="h-6">
                {editBlocked && <p className="text-red-700 text-[12px]">No se puede editar la información si el campo está vacío.</p>}
              </div>
            </div>
            <div className="flex gap-2 justify-end">

              <DropdownMenuItem asChild><DialogClose ><Button variant='ghost' className='border'>Cancelar</Button></DialogClose></DropdownMenuItem>
              <Button asChild type="submit">Continuar</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogList;
