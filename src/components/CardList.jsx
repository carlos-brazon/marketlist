import { useContext, useEffect, useState } from 'react'
import { collection, doc, serverTimestamp, setDoc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import Input from './Input';
import CardProduct from './CardProduct';

const CardList = ({ productsFromMercadona, item, setIsOpen, setRotate }) => {
  const { temporalCloud, setTemporalCloud, userIn, setUserIn } = useContext(AllItemsContext);
  const [inputSearch, setInputSearch] = useState([]);

  const handleInput = (event) => {
    const filterSearch = [...productsFromMercadona].filter((elemnt) => {
      const textName = elemnt.display_name.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()
      if (textName.includes(event.target.value.toLowerCase())) {
        return elemnt
      }
    })
    setInputSearch(filterSearch);
  }

  const handleClik = async (itemFromMercadona) => {
    const priceFromMercadona = Number(itemFromMercadona?.price_instructions?.unit_price)
    await updateDoc(doc(db, "dataItemsMarketList", item.id), { amount: priceFromMercadona, urlMercadona: itemFromMercadona.thumbnail, idMercadona: itemFromMercadona.id });
    await updateDoc(doc(db, 'userMarketList', userIn.uid), { addControl: true, control_items: true });
    
    const itemToMarketList = {
      userUid: userIn.uid,
      isDone: false,
      priority: false,
      id: item.id,
      name: item.name.toLowerCase(),
      tags: item.tags.toLowerCase(),
      create_at: serverTimestamp(),
      amount: priceFromMercadona,
      urlMercadona: itemFromMercadona.thumbnail,
      idMercadona: itemFromMercadona.id
    };
    await setDoc(doc(db, "frequentItems", item.id), {
     ...itemToMarketList
    }, { merge: true });


    const updateItemInTemporalCloud = temporalCloud.map((itemfound) => {
      if (itemfound.id === item.id) {
        return { ...itemfound, amount: priceFromMercadona, urlMercadona: itemFromMercadona.thumbnail, idMercadona: itemFromMercadona.id };
      }
      return itemfound;
    });
    setTemporalCloud(updateItemInTemporalCloud);
    setUserIn({ ...userIn, addControl: true, control_items: true })
    setRotate(false)
    setIsOpen(false)
  }
  useEffect(() => {
    setInputSearch(productsFromMercadona)
  }, [productsFromMercadona]);
  return (
    <div className='flex flex-col gap-2 animate-fade animate-once animate-duration-[2000ms]'>
      <div>
        <Input placeholder={"Buscar"} className={'w-fit'} onChange={() => handleInput(event)} />
        <div>
          cantidad productos: {inputSearch?.length}
        </div>
      </div>
      <div className='flex items-center justify-center gap-2 flex-wrap rounded-md p-2'>
        {inputSearch?.map((itemFromMercadona, i) => {
          return <div className='flex xs:w-40 xs:h-40 w-[95px] h-[140px] flex-col justify-between border items-center p-1 rounded-md' onClick={() => handleClik(itemFromMercadona)} key={i} >
            <CardProduct product={itemFromMercadona} />
          </div>
        })}
      </div>
    </div>
  )
}

export default CardList