import React, { useContext, useState } from 'react'
import { AllItemsContext } from './Contex';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import mercadonaIcon from "@/assets/mercadona.jpeg"
import Input from './Input';

const MercadonaDialog = () => {
  const { userIn, temporalCloud, setTemporalCloud } = useContext(AllItemsContext);
  const [isOpen, setIsOpen] = useState(false);
  const [productsFromMercadona, setProductsFromMercadona] = useState(null);
  const [inputSearch, setInputSearch] = useState(null);

  const getAllItems = async () => {

    const itemsFromLocalStorage = JSON.parse(localStorage.getItem('allItemsMercadona2'))
    setProductsFromMercadona(itemsFromLocalStorage);
    setInputSearch(itemsFromLocalStorage);

    if (!itemsFromLocalStorage) {
      try {
        const res = await fetch("https://tienda.mercadona.es/api/categories");
        const products = await res.json();

        console.log(products.results);

        // Extraemos todos los IDs de subcategorías
        const ids = products.results.flatMap(cat =>
          cat.categories.map(sub => sub.id)
        );

        console.log("Todos los IDs:", ids);

        // Hacer fetch para cada categoría y acumular resultados
        try {
          const allData = await Promise.all(
            ids.map(id =>
              fetch(`https://tienda.mercadona.es/api/${id}/`)
              // fetch(`http://localhost:3001/category/${id}/`)
                .then(res => {
                  if (!res.ok) throw new Error(`Error al obtener categoría ${id}`);
                  return res.json();
                })
                .catch(err => {
                  console.error(err);
                  return null; // para que no rompa Promise.all
                })
            )
          );
          const filteredData = allData.filter(item => item !== null);
          const allProducts = filteredData.flatMap(category => {
            let products = category.products ? [...category.products] : [];

            if (category.categories) {
              category.categories.forEach(sub => {
                if (sub.products) {
                  products.push(...sub.products);
                }
              });
            }

            return products;
          });
          localStorage.setItem('allItemsMercadona2', JSON.stringify(allProducts))// para set en localstorage

          setProductsFromMercadona(allProducts);
          setInputSearch(allProducts);
          console.log("Datos de todas las subcategorías:", filteredData);
        } catch (error) {
          console.error("Error al obtener productos:", error);
        }

        // Filtramos los nulls

      } catch (err) {
        console.error("Error al obtener productos:", err);
      }
    }

  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger>
        <div onClick={() => setIsOpen(true)} className='w-[27px] h-[27px] flex items-center justify-center bg-white border rounded-full'>
          <img className='w-6 h-6 rounded-full' src={mercadonaIcon} alt="" />
        </div>
      </DialogTrigger>
      <DialogContent className="flex flex-col items-center gap-6 justify-start rounded-lg">
        <DialogHeader>
          <DialogTitle className="text-base">Selecciona producto deseado</DialogTitle>
        </DialogHeader>
        <DialogDescription asChild>
          <div className='flex flex-col gap-2'>
            <div
              onClick={() => getAllItems()}
              className={`${userIn?.email === 'aa@gmail.com' ? '' : 'hidden'}`}
            >
              Obtener productos
            </div>

            <Input placeholder={"Buscar"} className={'w-fit'} onChange={(event) => {
              console.log(event.target.value);


              const filterSearch = [...productsFromMercadona].filter((elemnt) => {
                if (elemnt.display_name.toLowerCase().includes(event.target.value.toLowerCase())) {
                  return elemnt
                }
              })
              console.log(filterSearch);
              setInputSearch(filterSearch);

            }} />
            <div className='flex items-center justify-center gap-2 flex-wrap rounded-md p-2'>
              {inputSearch?.map((itemFromMercadona, i) => {
                return <div key={i} className='flex xs:w-40 xs:h-40 w-[100px] h-[140px] flex-col justify-between border items-center p-1 rounded-md'>
                  <div className={`${itemFromMercadona?.display_name.length > 20 ? 'line-clamp-4' : ''} text-[10px]  xs:text-sm`}>{itemFromMercadona?.display_name}</div>
                  <div className='flex items-center justify-center'>
                    <img className=' xs:w-16 xs:h-16 w-12 h-12' src={itemFromMercadona?.thumbnail} alt="" />
                    <div className='text-[10px] xs:text-sm'>€: {itemFromMercadona?.price_instructions?.unit_price}</div>
                  </div>
                </div>
              })}
            </div>
          </div>
        </DialogDescription>
      </DialogContent>
    </Dialog>
  )
}

export default MercadonaDialog
