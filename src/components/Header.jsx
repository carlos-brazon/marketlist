import { useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserDisconectedIcon from "../assets/user-svgrepo-com-red.svg";
import { signOut } from 'firebase/auth';
import { auth, db } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { firstLetterUpperCase } from "../utils/util.js";
import { Button } from './ui/button.jsx';
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
  CommandGroup,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command"
import { useToast } from "@/components/ui/use-toast"
import loginIcon from "../assets/login.svg";
import logOutIcon from "../assets/logout.svg";
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';

const Header = () => {
  const { toast } = useToast()
  const { userIn, setUserIn } = useContext(AllItemsContext);
  const [by, setBy] = useState(true);
  const [temporalImg, setTemporalImg] = useState('');
  const [imgFromFirebase, setImgFromFirebase] = useState('');
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);

  const showMessage = () => {
    setTimeout(() => {
      setBy(false);
    }, 3000);
  };
  const ramdomDog = async () => {
    try {
      const response = await fetch('https://dog.ceo/api/breed/hound/images/random/6');
      const data = await response.json();
      setTemporalImg(data.message);
      return data.message
    } catch (error) {
      console.error("Error fetching the image:", error);
    }
  }
  const urlsFromFirebase = async () => {
    const urlArray = await getDoc(doc(db, "urlDogs", "one"))
    setImgFromFirebase(urlArray.data().urls)
    setTemporalImg([userIn.last_url || temporalImg[0]])
  }
  useEffect(() => {
    showMessage();
    if (userIn) {
      ramdomDog();
      urlsFromFirebase();
    }
  }, []);

  const handleClick = async () => {
    await setUserIn(null)
    await signOut(auth);
  }
  return (
    <div className='flex w-full flex-col gap-2 items-center'>
      <header className="flex items-center justify-between relative text-white bg-neutral-800 py-1 px-3 w-full">
        <Link to={'/'}>
          <Button size='xs' variant='secondary'>Inicio</Button>
        </Link>
        <div className='flex relative gap-3 items-center'>

          <div className='flex gap-2 items-center text-white' >
            <p className='text-sm'>{!userIn || `Hola, ${firstLetterUpperCase(userIn.name_)}`}</p>

            <div className='relative flex justify-center'>
              <Sheet open={isSheetOpen} onOpenChange={isDropMenuOpen ? setIsDropMenuOpen : setIsSheetOpen}>
                <SheetTrigger>
                  {userIn ? <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-10 h-10'>
                    {<img className={`relative rounded-full z-10 w-8 h-8`} src={userIn.last_url} alt='imagen redonda' />}
                  </div> : <img className='relative z-10 w-9 h-9' src={UserDisconectedIcon} alt='Aquí va un icono de usuario' />}
                </SheetTrigger>
                <SheetContent className="p-0 w-72 flex flex-col justify-between">
                  <SheetHeader className="space-y-0">

                    <SheetTitle><img className={`h-28 w-full relative ${userIn || 'pt-2'}`} src={userIn ? userIn.last_url : UserDisconectedIcon} alt="Imagen cuadrada de fondo" /></SheetTitle>


                    <DropdownMenu className=" absolute z-40" open={isDropMenuOpen} onOpenChange={setIsDropMenuOpen}>

                      <DropdownMenuTrigger className="pl-2">
                        {userIn ? <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-[106px] h-[106px] absolute top-[40px]'>
                          <img onClick={async () => {
                            urlsFromFirebase()
                          }} className={`absolute z-10 rounded-full w-24 h-24`} src={userIn.last_url} alt='imagen redonda' />
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

                    <SheetDescription asChild>
                      <div className='px-2 pt-2'>
                        <div className='flex'>
                          <div className='w-[38%]'></div>
                          <div className='flex items-center justify-end gap-1'>
                            <div>{userIn?.name_}</div>
                            <div>{userIn?.last_name}</div>
                          </div>
                        </div>
                        <Command>
                          <CommandList className="mt-2">
                            <CommandGroup className="text-center" heading="Sugerencias">
                              <Link to={'HowToUse'}>
                                <CommandItem >
                                  <SheetClose className="w-screen flex items-start">
                                    Como usar
                                  </SheetClose>
                                </CommandItem>
                              </Link >

                            </CommandGroup>
                            <CommandSeparator />
                            <CommandGroup className={`text-center ${userIn || "hidden"}`} heading="Ajustes">
                              <CommandItem>Perfil</CommandItem>
                            </CommandGroup>
                          </CommandList>
                        </Command>

                      </div>
                    </SheetDescription>
                  </SheetHeader>
                  <Link className={`relative ${!userIn || 'hidden'}`} to={'/singin'}>
                    <SheetClose>
                      <div onClick={() => handleClick()} className={`flex absolute z-10 bottom-5 left-2 `}>
                        <img className=' absolute  rounded-full p-0.5 w-10 h-10 bg-slate-500' src={loginIcon} alt="" />
                        <div className={` bg-slate-300 py-2 pl-12 pr-4 rounded-full  `}>Log In</div>
                      </div>
                    </SheetClose>
                  </Link >
                  <div className={`pl-2 gap-3 pb-10 flex flex-col relative ${userIn || 'hidden'}`}>
                    <div onClick={() => {
                      if (navigator.clipboard && navigator.clipboard.writeText) {
                        navigator.clipboard.writeText(userIn.email)
                          .then(() => {
                            toast({
                              className: "p-0",
                              title: <div className='p-1 flex gap-1 items-center justify-center'><span className=''>Email copiado en clipboard</span></div>,
                              duration: '1300',
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
                      <SheetClose className="flex items-start">
                        {userIn?.email}
                      </SheetClose>
                    </div>
                    <Link to={'/'}>
                      <SheetClose>
                        <div onClick={() => handleClick()}>
                          <img className=' absolute rounded-full p-0.5 w-10 h-10 bg-slate-500' src={logOutIcon} alt="" />
                          <div className={` bg-slate-300 py-2 pl-12 pr-4 rounded-full `}>Log Out</div>
                        </div>
                      </SheetClose>
                    </Link >
                  </div>
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