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
    <div className='flex flex-col items-center gap-4 h-full w-full px-3'>
      <Tags setAmount={setAmount} />
      <h4 className="text-base text-center font-medium leading-none">{userIn?.email == 'aa@gmail.com' ? 'Liste' : 'Lista'}</h4>
      {/* <div>
        <button onClick={async () => {
          const dataFromFirebase = await getDocs(collection(db, "usersMarketList"));
          const userAndId = []
          dataFromFirebase.forEach(usuario => {
            userAndId.push({ ...usuario.data(), uid: usuario.ref.id })
          })

          setUsuariosOld(userAndId)

        }} className='bg-slate-400 p-2 rounded-md'> traer usuario</button>
      </div> */}
      {/* <div>
        <button onClick={async () => {
          usuariosOld.forEach(async (usuarioantiguo) => {
            try {
              const userId = doc(collection(db, 'newId')).id;
              const userToFirebase = {
                addControl: false,
                create_at: serverTimestamp(),
                email: usuarioantiguo.email.toLowerCase(),
                id: userId,
                isDateControl: false,
                isDoneControl: false,
                isEditControl: false,
                last_name: usuarioantiguo.apellido,
                last_tags: 'Compras',
                name_: usuarioantiguo.nombre,
                orderByUrgent: false,
                sortAscending: false,
              };
              await setDoc(doc(db, "userMarketList", usuarioantiguo.uid), userToFirebase)

              usuarioantiguo.markeList.forEach(async (untiem) => {

                console.log(untiem.amount);

                const itemTofirebase = {
                  amount: untiem.amount || 0,
                  create_at: untiem.create_at || serverTimestamp(),
                  id: untiem.id,//
                  isDone: untiem.isDone,//
                  isDone_at: untiem.isDone_at || serverTimestamp(),
                  name: untiem.name,//
                  priority: untiem.priority || false,
                  tags: untiem.tags,//
                  userUid: usuarioantiguo.uid
                };

                await setDoc(doc(db, "dataItemsMarketList", untiem.id), itemTofirebase)
              })
            } catch (error) {
              console.error('Error al actualizar newuser en Firestore:', error);
            }
          })

        }} className='bg-slate-400 p-2 rounded-md'> subir usuario a nueva coleccion</button>
      </div> */}
      <ListControls amount={amount} />
      <ScrollArea
        style={{ height: `${Math.round(window.innerHeight - 270)}px` }}
        className={`w-full rounded-md`}
      >
        <ItemsList setAmount={setAmount} />
      </ScrollArea >
    </div >
  );
};

export default MainView;
