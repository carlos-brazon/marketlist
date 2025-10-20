import { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import mercadonaIcon from "@/assets/mercadona.jpeg"
import rotateIcon from "@/assets/rotate.svg"
import CardList from './CardList';
import CardProduct from './CardProduct';

const MercadonaDialog = ({ item }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [productsFromMercadona, setProductsFromMercadona] = useState(null);
  const [rotate, setRotate] = useState(false);

  const getAllItems = async () => {
    const itemsFromLocalStorage = JSON.parse(localStorage.getItem('allItemsMercadona'));
    const timeLatsFetch = JSON.parse(localStorage.getItem('timestamp'));

    const timeNow = Date.now();
    const timeDuration = 1000 * 60 * 60 * 24 * 1; // intervalos de 4 dias
    let doFetch = true;
    if (itemsFromLocalStorage?.length > 0) {
      const lapsedTime = timeNow - timeLatsFetch;
      if (lapsedTime < timeDuration) {
        // tiempo menor a 4 dias
        setProductsFromMercadona(itemsFromLocalStorage);
        doFetch = false;
      }
    }

    if (doFetch) {
      try {
        //se debe hacer node server.js en bash   
        // const res = await fetch("http://localhost:3001/categories");

        //se debe hacer vercel dev en bash y eliminar del vercel.json:
        //         {
        //   "src": "/((?!api|assets|favicon\\.ico|robots\\.txt|.*\\..*).*)",
        //   "dest": "/"
        // }
        const res = await fetch("/api/categories");
        const products = await res.json();
        const filteredData = products?.subcategories?.filter(item => item !== null);
        const allProducts = filteredData?.flatMap(category => {
          let products = category?.products ? [...category?.products] : [];

          if (category.categories) {
            category.categories.forEach(sub => {
              if (sub.products) {
                products.push(...sub.products);
              }
            });
          }
          return products;
        });

        localStorage.setItem('allItemsMercadona', JSON.stringify(allProducts))// para set en localstorage
        localStorage.setItem('timestamp', JSON.stringify(Date.now()))// para set en localstorage
        setProductsFromMercadona(allProducts);
      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    }
  }

  const ItemMercadonaToPrint = productsFromMercadona?.find(itemMercadona => itemMercadona.id === item.idMercadona);

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      setIsOpen(open);
      if (!open) {
        setRotate(false); // cuando se cierre el Dialog, resetea rotate
      }
    }}>
      <DialogTrigger>
        <div onClick={() => {
          setIsOpen(true), getAllItems();
        }} className={`w-[27px] h-[27px] flex items-center justify-center rounded-full bg-gray-300`}>
          <img className='w-6 h-6 rounded-full' src={item.urlMercadona?.length > 0 ? item.urlMercadona : mercadonaIcon} alt="" />
        </div>
      </DialogTrigger>
      <DialogContent className={`flex flex-col items-center gap-6 justify-start rounded-lg ${rotate || !ItemMercadonaToPrint ? 'w-11/12' : 'max-w-[360px] w-full'}`}>
        <DialogHeader>
          <DialogTitle className="text-base">Selecciona el precio para {item.name}</DialogTitle>
        </DialogHeader>
        <DialogDescription className='' asChild>
          <div>
            {rotate || !ItemMercadonaToPrint
              ?
              <CardList productsFromMercadona={productsFromMercadona} item={item} setIsOpen={setIsOpen} setRotate={setRotate} />
              :
              <div className='relative flex xs:w-[310px] xs:h-[310px] w-[290px] h-[290px] flex-col justify-between border items-center p-1 rounded-md'>
                <CardProduct oneItem={ItemMercadonaToPrint} />
                <img onClick={() => { setRotate(true) }} className='absolute bottom-0 right-2 w-8 h-8' src={rotateIcon} alt="" />
              </div>
            }
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default MercadonaDialog
