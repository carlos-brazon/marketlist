import { useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserConectedIcon from "../assets/user-svgrepo-com-green.svg";
import UserDisconectedIcon from "../assets/user-svgrepo-com-red.svg";
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from "../utils/util.js";
import { Button } from './ui/button.jsx';
import SingIn from './SingIn.jsx';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose
} from "@/components/ui/sheet"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast"
import loginIcon from "../assets/login.svg";
import logOutIcon from "../assets/login.svg";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';



const Header = () => {
  const { toast } = useToast()
  const { userIn, setUserIn } = useContext(AllItemsContext);
  const [by, setBy] = useState(true);
  const [temporalImg, setTemporalImg] = useState('');
  const [imgFromFirebase, setImgFromFirebase] = useState('');

  const showMessage = () => {
    setTimeout(() => {
      setBy(false);
    }, 3000);
  };
  const ramdomDog = async () => {
    try {
      // Realiza la solicitud
      const response = await fetch('https://dog.ceo/api/breed/hound/images/random/6');
      // const response = await fetch('https://dog.ceo/api/breed/hound/images/random');
      // Asegúrate de convertir la respuesta a JSON
      const data = await response.json();
      // Accede a la URL de la imagen en la respuesta
      setTemporalImg(data.message); // La URL está en la propiedad "message"
      return data.message
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  }
  const yyy = async () => {
    const urlImagenesFromFirebas = await getDoc(doc(db, "urlDogs", "one"))
    setImgFromFirebase(urlImagenesFromFirebas.data().urls)
    setTemporalImg([userIn.last_url || temporalImg[0]])

  }
  useEffect(() => {
    showMessage();
    if (userIn) {
      yyy()
      ramdomDog()
    }
  }, []);

  const handleClick = async () => {
    await setUserIn(null)
    await signOut(auth);
  }

  return (
    <div className='flex flex-col gap-2 items-center'>
      <header className="flex items-center justify-between relative text-white bg-neutral-800 py-1 px-3 w-full">
        <Link to={'/'}>
          <Button size='xs' variant='secondary'>Inicio</Button>
        </Link>
        <div className='flex relative gap-3 items-center'>

          <div className='flex gap-2 items-center text-white' >
            <p className='text-sm'>{!userIn || `Hola, ${firstLetterUpperCase(userIn.name_)}`}</p>

            <div className='relative'>
              <Sheet>
                <SheetTrigger >
                  {userIn ? <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-10 h-10'>
                    {<img className={`relative rounded-full z-10 w-8 h-8`} src={userIn.last_url || temporalImg[0]} alt='imagen redonda' />}
                  </div> : <img className='relative z-10 w-9 h-9' src={UserDisconectedIcon} alt='Aquí va un icono de usuario' />}
                </SheetTrigger>
                <SheetContent className="p-0 w-64 flex flex-col justify-between">
                  <SheetHeader>

                    <SheetTitle><img className='h-28 w-full relative' src={userIn ? userIn.last_url || temporalImg[0] : UserDisconectedIcon} alt="Imagen cuadrada de fondo" /></SheetTitle>


                    <DropdownMenu>

                      <DropdownMenuTrigger className="pl-2">
                        {userIn ? <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-[106px] h-[106px] absolute top-[40px]'>
                          <img onClick={async () => {
                            yyy()
                          }} className={`absolute z-10 rounded-full w-24 h-24`} src={userIn.last_url || temporalImg[0]} alt='imagen redonda' />
                        </div> : <img className='relative z-10 w-9 h-9' src={UserDisconectedIcon} alt='Aquí va un icono de usuario' />}
                      </DropdownMenuTrigger>

                      <DropdownMenuContent>
                        <DropdownMenuLabel className="text-center">Selecciona una nueva imagen</DropdownMenuLabel>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <div className='grid grid-cols-3 gap-2'>
                            {imgFromFirebase.length ? imgFromFirebase?.map(url => <img key={url} onClick={async () => { await updateDoc(doc(db, "userMarketList", userIn.uid), { last_url: url }), setUserIn(prev => ({ ...prev, last_url: url })) }} className='w-24 h-24 relative rounded-full' src={url} alt="" />) : ''}
                          </div>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                          <div className={userIn || 'hidden'} onClick={async () => {
                            const newArrayUrls = await ramdomDog()
                            await setDoc(doc(db, "urlDogs", "one"), { urls: newArrayUrls })
                          }}>
                            Cambiar imagenes de muestra
                          </div>


                        </DropdownMenuItem>

                      </DropdownMenuContent>
                    </DropdownMenu>

                    <SheetDescription asChild className="p-0">
                      <div className='px-2 pt-0'>
                        <div className='h-5 flex'>
                          <div className='w-[45%]'></div>
                          <div className='flex items-center justify-end gap-2'>
                            <div>{userIn?.name_}</div>
                            <div>{userIn?.last_name}</div>
                          </div>
                        </div>
                        <Command>
                          <CommandList className="">
                            <CommandGroup className="text-center" heading="Suggestions">
                              <CommandItem>
                                <div onClick={() => {
                                  if (navigator.clipboard && navigator.clipboard.writeText) {
                                    navigator.clipboard.writeText(userIn.email)
                                      .then(() => {
                                        toast({
                                          className: "p-0",
                                          title: <div className='p-1 flex gap-1 items-center justify-center'><span className=''>Email copiado en clipboard</span></div>,
                                          duration: '1000',
                                        })
                                      })
                                      .catch(err => {
                                        console.error("Error al copiar el correo:", err);
                                        alert("No se pudo copiar el correo. Por favor, intenta de nuevo.");
                                      });
                                  } else {
                                    console.warn("Clipboard API no es compatible con este navegador.");
                                    alert("Tu navegador no soporta la función de copiar al portapapeles.");
                                  }
                                }}>
                                  <SheetClose className="w-screen flex items-start">
                                    {userIn?.email}
                                  </SheetClose>
                                </div>
                              </CommandItem>

                              <Link to={'HowToUse'}>
                                <CommandItem >
                                  <SheetClose className="w-screen flex items-start">
                                    Como usar
                                  </SheetClose>
                                </CommandItem>
                              </Link >

                              {/* <CommandItem  >
                                <div className={userIn || 'hidden'} onClick={async () => {
                                  const newArrayUrls = await ramdomDog()
                                  await setDoc(doc(db, "urlDogs", "one"), { urls: newArrayUrls })
                                }}>
                                  Cambiar imagenes
                                </div>

                              </CommandItem> */}

                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup className="text-center" heading="Settings">
                              <CommandItem>Profile</CommandItem>
                              {/* <CommandItem>Settings</CommandItem> */}
                            </CommandGroup>
                          </CommandList>
                        </Command>

                      </div>
                    </SheetDescription>
                  </SheetHeader>
                  <Link className={`relative ${!userIn || 'hidden'}`} to={'/singin'}>
                    <SheetClose>
                      <div className={`flex absolute z-10 bottom-5 left-2 `}>
                        <div><img className=' absolute  rounded-full p-0.5 w-10 h-10 bg-slate-600' src={loginIcon} alt="" /></div>
                        <div onClick={() => handleClick()} className={` bg-slate-400 py-2 pl-12 pr-4 rounded-full  `}>Log In</div>
                      </div>
                    </SheetClose>
                  </Link >
                  <Link className={`relative ${userIn || 'hidden'}`} to={'/'}>
                    <SheetClose>
                      <div className={`flex absolute z-10 bottom-5 left-2`}>
                        <div><img className=' absolute  rounded-full p-0.5 w-10 h-10 bg-slate-600' src={logOutIcon} alt="" /></div>
                        <div onClick={() => handleClick()} className={` bg-slate-400 py-2 pl-12 pr-4 rounded-full `}>Log Out</div>
                      </div>
                    </SheetClose>
                  </Link >
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header >
      <Outlet />
      <p className={`w-full text-right mb-2 mr-8 ${by && !userIn || 'hidden'}`}><span className='font-bold'>by:</span> Carlos Brazon...</p>
    </div >
  );
}

export default Header;
// ASI ESTA FUNCIONANDO EN NAIM
// import { useContext, useState, useEffect } from 'react';
// import { Link, Outlet } from 'react-router-dom';
// import UserConectedIcon from "../assets/user-svgrepo-com-green.svg";
// import UserDisconectedIcon from "../assets/user-svgrepo-com-red.svg";
// import { signOut } from 'firebase/auth';
// import { auth } from '../utils/firebase';
// import { AllItemsContext } from './Contex';
// import { firstLetterUpperCase } from "../utils/util.js";
// import { Button } from './ui/button.jsx';
// import SingIn from './SingIn.jsx';
// import {
//   DropdownMenu,
//   DropdownMenuContent,
//   DropdownMenuItem,
//   DropdownMenuLabel,
//   DropdownMenuSeparator,
//   DropdownMenuTrigger,
// } from "@/components/ui/dropdown-menu"

// const Header = () => {
//   const { userIn, setUserIn } = useContext(AllItemsContext);
//   const [by, setBy] = useState(true);
//   const showMessage = () => {
//     setTimeout(() => {
//       setBy(false);
//     }, 3000);
//   };
//   useEffect(() => {
//     showMessage();
//   }, []);

//   const handleClick = async () => {
//     await setUserIn(null)
//     await signOut(auth);
//   }
//   return (
//     <div className='flex flex-col gap-2 items-center'>
//       <header className="flex items-center justify-between relative text-white bg-neutral-800 py-1 px-3 w-full">
//         <Link to={'/'}>
//           <Button size='xs' variant='secondary'>Inicio</Button>
//         </Link>
//         <div className='flex relative gap-3 items-center'>
//           {!userIn ? <SingIn /> : ''}
//           <div className='flex gap-2 items-center text-white' >
//             <p className='text-sm'>{!userIn || `Hola, ${firstLetterUpperCase(userIn.name_)}`}</p>

//             <div className='relative'>
//               <DropdownMenu>
//                 <DropdownMenuTrigger>
//                   <img className='relative z-10 w-9 h-9' src={userIn ? UserConectedIcon : UserDisconectedIcon} alt='Aquí va un icono de usuario' />
//                 </DropdownMenuTrigger>
//                 <DropdownMenuContent className={'flex flex-col items-end'} >
//                   <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
//                   <DropdownMenuSeparator />
//                   <DropdownMenuItem className={`${userIn || 'hidden'}`}>{userIn?.email}</DropdownMenuItem>
//                   <Link to={'HowToUse'}>
//                     <DropdownMenuItem>
//                       Como usar
//                     </DropdownMenuItem>
//                   </Link >
//                   <Link to={'/'}>
//                     <DropdownMenuItem onClick={() => handleClick()} className={`${userIn || 'hidden'}`}>Cerrar sesión</DropdownMenuItem>
//                   </Link >
//                 </DropdownMenuContent>
//               </DropdownMenu>
//             </div>
//           </div>
//         </div>
//       </header>
//       <Outlet />
//       <p className={`w-full text-right mb-2 mr-8 ${by && !userIn || 'hidden'}`}><span className='font-bold'>by:</span> Carlos Brazon...</p>
//     </div>
//   );
// }

// export default Header;
