import { Button } from './ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useContext, useState } from 'react';
import { AllItemsContext } from './Contex';
import { DialogClose, DialogDescription } from '@radix-ui/react-dialog';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import PropTypes from 'prop-types';

const EditDialogList = ({ isDialogOpen, setIsDialogOpen }) => {
  EditDialogList.propTypes = {
    isDialogOpen: PropTypes.boolean,
    setIsDialogOpen: PropTypes.func,
  };

  const { button, setTemporalCloud, setButton, temporalCloud, userIn } = useContext(AllItemsContext);
  const [user, setUser] = useState({ name: button });
  const [isTagsRepeat, setIsTagsRepeat] = useState(false);

  const handleInput = (event) => {
    const inputName = event.target.name;
    const inputValue = event.target.value;
    setUser((prev) => ({ ...prev, [inputName]: inputValue }));
  };

  const handleSubmit = async (event, string) => {
    event?.preventDefault();
    let tagsRepeatedFounded = temporalCloud.find(elemento => elemento.tags === user.name)
    if (string) {
      tagsRepeatedFounded = false;
    } else {
      string = 'continue'
    }

    if (user.name && !tagsRepeatedFounded && string) {
      const updatedMarkeList = temporalCloud.map((itemListFromFirebase) => {
        if (itemListFromFirebase.tags === button) {
          return { ...itemListFromFirebase, tags: user.name };
        }
        return itemListFromFirebase;
      });
      await Promise.all(
        updatedMarkeList.map(async (item) =>
          await updateDoc(doc(db, "dataItemsMarketList", item.id), { tags: item.tags })
        )
      );
      await updateDoc(doc(db, "userMarketList", userIn.uid), { last_tags: user.name });
      setButton(user.name);
      setTemporalCloud(updatedMarkeList);
      setIsDialogOpen(false);
    } else {
      if (tagsRepeatedFounded) {
        setIsTagsRepeat(true)
      }
    }
  };

  return (
    <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
      <DialogContent className="rounded-lg top-1/2">
        <DialogHeader className="flex flex-col gap-5">
          <DialogTitle className="text-base">
            ¿Estás seguro que deseas editar el nombre de la lista?
          </DialogTitle>
          <DialogDescription asChild>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="flex flex-col gap-2">
                <input
                  className="p-2 min-h-[40px] w-[330px] md:w-full"
                  type="text"
                  name="name"
                  onChange={handleInput}
                  value={user?.name ? user.name : ''}
                  placeholder={button}
                  required
                />
                <div className="h-6">
                  {isTagsRepeat && (
                    <div className="text-red-700 text-[12px]">
                      {isTagsRepeat ?
                        <div>
                          <div className='flex gap-1 '>La lista esta repetida, si desea combinar ambas pulsa <div className='text-black underline font-semibold cursor-pointer' onClick={() => { setIsTagsRepeat(false), handleSubmit(event, 'continue') }}>aqui</div></div>

                        </div> : ''}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex gap-2 items-center justify-end">
                <DialogClose onClick={() => setIsDialogOpen(false)}>
                  <Button variant='outline'>Cancel</Button>
                </DialogClose>
                <Button className="w-24" type="submit">
                  Continuar
                </Button>
              </div>
            </form>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default EditDialogList;
