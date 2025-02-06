import { useContext, useState } from 'react';
import { AllItemsContext } from './Contex';
import { ScrollArea } from "@/components/ui/scroll-area"
import Tags from './Tags';
import ListControls from './ListControls';
import ItemsList from './ItemsList';
import chevUp from "../assets/chevron-up-item.svg";
import chevDown from "../assets/chevron-down-item.svg";
import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';

const MainView = () => {
  const { userIn, setUserIn } = useContext(AllItemsContext);
  const [amount, setAmount] = useState(0);
  const [changeIcons, setChangeIcons] = useState(userIn?.control_items);

  return (
    <div className='flex flex-col items-center gap-2 h-full w-full px-3'>
      <Tags setAmount={setAmount} />
      <div className='flex justify-center items-center gap-3'>
        <h4 className="text-base text-center font-medium leading-none">{userIn?.email == 'aa@gmail.com' ? 'Listuuuu' : 'Lista'}</h4>
        <img onClick={() => {
          setUserIn(prev => ({ ...prev, control_items: !userIn.control_items })), setTimeout(async () => {
            setChangeIcons(prev => !prev)
            await updateDoc(doc(db, "userMarketList", userIn.uid), { control_items: !userIn.control_items })
          }, 1200);
        }} className='w-7 h-7 cursor-pointer z-10 absolute right-[10px]' src={changeIcons ? chevUp : chevDown} alt="" />
      </div>

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
      {/********************* /* esto es para agregar una nueva key a todos los usuarios de userMarketList  boton de abajo **********************************/}
      {/* {
        <button onClick={async () => {
          console.log('hola');

          const dataFromFirebase = await getDocs(collection(db, "userMarketList"));
          dataFromFirebase.forEach(async (usuario) => {
            await updateDoc(doc(db, 'userMarketList', usuario.id), {
              cropp_pixel: {},
              url_img_super_list: defaultSuperListImg,
              url_img_google: '',
            })
          })
        }} className='bg-slate-400 p-2 rounded-md'>
          agregar nueva key a todos los usuarios
        </button>
      } */}

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
