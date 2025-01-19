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
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { DropdownMenuItem } from "@/components/ui/dropdown-menu"

const EditDialogList = () => {
  const { button, setTemporalCloud, setButton, temporalCloud, userIn } = useContext(AllItemsContext);
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
      const updatedMarkeList = temporalCloud.map(itemListFromFirebase => {
        if (itemListFromFirebase.tags === button) {
          return { ...itemListFromFirebase, tags: user.name };
        }
        return itemListFromFirebase;
      });
      await Promise.all(updatedMarkeList.map(async (item) => await updateDoc(doc(db, "dataItemsMarketList", item.id), { tags: item.tags })))
      await updateDoc(doc(db, "userMarketList", userIn.uid), { last_tags: user.name })
      setButton(user.name);
      setTemporalCloud(updatedMarkeList)
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
      <DialogContent aria-describedby="dialog-description" className="rounded-lg top-1/2">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle className="text-base">¿Estás seguro que deseas editar el nombre de la lista?</DialogTitle>
          <DialogDescription id="dialog-description">
            This is the description of the dialog, providing context to the user.
          </DialogDescription>
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
            <div className="flex gap-2 items-center justify-end">
              <DropdownMenuItem asChild className='border w-24 flex items-center justify-center'><DialogClose >Cancelar</DialogClose></DropdownMenuItem>
              <Button className='w-24' type="submit">Continuar</Button>
            </div>
          </form>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogList;