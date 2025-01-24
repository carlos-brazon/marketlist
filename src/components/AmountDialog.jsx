import { useContext, useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from './ui/button'
import { AllItemsContext } from './Contex'
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore'
import { db } from '../utils/firebase'

const AmountDialog = ({ item, setAmount }) => {
    AmountDialog.propTypes = {
        item: PropTypes.object,
        setAmount: PropTypes.func,
    };
    const { userIn, temporalCloud, setTemporalCloud } = useContext(AllItemsContext);
    const [isOpen, setIsOpen] = useState(false);
    const [numberFromInput, setNumberFromInput] = useState(item.amount);

    const handleInput = () => {
        const inputValue = event.target.value;
        const decimalRegex = /^\d*\.?\d*$/;
        if (decimalRegex.test(inputValue)) {
            setNumberFromInput(inputValue);
        }
    }

    const handleSubmit = async (event, item) => {
        event.preventDefault();
        await updateDoc(doc(db, "dataItemsMarketList", item.id), { amount: Number(numberFromInput) });
        const updateItemInTemporalCloud = temporalCloud.map((itemfound) => {
            if (itemfound.id === item.id) {
                return { ...itemfound, amount: Number(numberFromInput) };
            }
            return itemfound;
        });

        const totalAmountToPrint = updateItemInTemporalCloud.reduce((amountAccumulator, currentItem) => amountAccumulator + currentItem.amount, 0);
        setAmount(totalAmountToPrint);
        setTemporalCloud(updateItemInTemporalCloud);
        setIsOpen(false)
    }
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger>
                <div onClick={() => setIsOpen(true)} className={`text-center p-px text-xs w-14 border border-black rounded-md ${userIn?.addControl || 'hidden'}`}>{item.amount?.toFixed(2) || 0}</div>
            </DialogTrigger>
            <DialogContent className="flex flex-col items-center gap-6 justify-center rounded-lg">
                <DialogHeader>
                    <DialogTitle className="text-base">Agrega el monto deseado</DialogTitle>
                </DialogHeader>
                <DialogDescription asChild>
                    <form onSubmit={(event) => handleSubmit(event, item)} className="flex w-full gap-2 max-w-sm items-center justify-center space-x-2">
                        <Input
                            type={'text'}
                            name={item.id}
                            onChange={handleInput}
                            value={numberFromInput || 0}
                            placeholder={item.amount?.toFixed(2) || 0}
                            className={'w-24 h-9 p-1 text-black'}
                            maxLength="25"
                            required
                        />
                        <Button type="submit">Guardar</Button>
                    </form >
                </DialogDescription>
            </DialogContent>
        </Dialog>
    )
}

export default AmountDialog