import { useContext } from 'react'
import { AllItemsContext } from './Contex'
import iconEditFalse from "../assets/edit-false.svg";
import iconEditTrue from "../assets/edit-true.svg";
import iconUrgentFalse from "../assets/urgent-false.svg";
import iconUrgentTrue from "../assets/urgent-true.svg";
import iconCalculatorFalse from "../assets/calculator-false.svg";
import iconCalculatorTrue from "../assets/calculator-true.svg";
import iconCalendarFalse from "../assets/calendar-false.svg";
import iconCalendarTrue from "../assets/calendar-true.svg";
import PropTypes from 'prop-types';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const ListControls = ({ amount }) => {
  ListControls.propTypes = {
    amount: PropTypes.number,
  };

  const { userIn, setUserIn } = useContext(AllItemsContext)
  const controls = [
    { stateKey: 'isDateControl', iconTrue: iconCalendarTrue, iconFalse: iconCalendarFalse },
    { stateKey: 'addControl', iconTrue: iconCalculatorTrue, iconFalse: iconCalculatorFalse },
    { stateKey: 'isDoneControl', iconTrue: iconUrgentTrue, iconFalse: iconUrgentFalse },
    { stateKey: 'isEditControl', iconTrue: iconEditTrue, iconFalse: iconEditFalse },
  ];

  const toggleControl = async (item) => {
    const newValue = !userIn[item.stateKey];
    const key = item.stateKey;
    try {
      setUserIn({ ...userIn, [key]: newValue })
      await updateDoc(doc(db, 'userMarketList', userIn.uid), { [key]: newValue });
    } catch (error) {
      console.error(`Error al actualizar ${key}:`, error);
    }
  };

  return (
    <div className="w-full flex gap-1 items-end justify-end pr-[10px]">
      <div className="w-full items-center flex gap-2 justify-end">
        <div className="text-md">Total</div>
        <div className="w-16 border text-center text-sm border-black rounded-md px-1 py-0.5">
          {amount}
        </div>
      </div>
      {controls.map(item => (
        <img
          key={item.stateKey}
          onClick={() => toggleControl(item)}
          className="w-8 h-w-8"
          src={userIn && userIn[item.stateKey] ? item.iconTrue : item.iconFalse}
          alt={`Icono de ${item.stateKey}`}
        />
      )
      )}
    </div>
  );
};
export default ListControls