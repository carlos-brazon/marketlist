import { useContext, useState } from 'react';
import { AllItemsContext } from './Contex';
import { ScrollArea } from "@/components/ui/scroll-area"
import Tags from './Tags';
import ListControls from './ListControls';
import ItemsList from './ItemsList';

const MainView = () => {
  const { userIn } = useContext(AllItemsContext);
  const [amount, setAmount] = useState(0);

  return (
    <div className='flex flex-col items-center gap-4 h-full w-screen px-3'>
      <Tags setAmount={setAmount} />
      <h4 className="text-base text-center font-medium leading-none">{userIn?.email == 'aa@gmail.com' ? 'Listu' : 'Lista'}</h4>
      <ListControls amount={amount} />
      <ScrollArea
        style={{ height: `${Math.round(window.innerHeight - 250)}px` }}
        className={`w-full rounded-md`}
      >
        <ItemsList setAmount={setAmount} />
      </ScrollArea >
    </div >
  );
};

export default MainView;
