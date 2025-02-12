import { useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserDisconectedIcon from "../assets/user-svgrepo-com-red.svg";
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import { defaultSuperListImg, firstLetterUpperCase } from "../utils/util.js";
import { Button } from './ui/button.jsx';
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
import alert from "../assets/alert.svg";
import alert2 from "../assets/alert2.svg";

const Header = () => {
  const { toast } = useToast()
  const { userIn, setUserIn } = useContext(AllItemsContext);
  const [by, setBy] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const [isDropMenuOpen, setIsDropMenuOpen] = useState(false);

  const showMessage = () => {
    setTimeout(() => {
      setBy(false);
    }, 3000);
  };

  useEffect(() => {
    showMessage();
  }, []);

  const handleClick = async () => {
    await setUserIn(null)
    await signOut(auth);
  }
  const copyEmailClipboard = () => {

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

  }
  return (
    <div className='flex w-full flex-col gap-2 items-center'>
      <header className="flex items-center justify-between relative text-white bg-neutral-800 py-1 px-3 w-full">
        <Link to={'/'}>
          <Button size='xs' variant='secondary'>Inicio</Button>
        </Link>
        <div className='flex relative gap-3 items-center'>

          <div className='flex gap-2 items-center text-white' >
            {userIn && <p className='text-sm'>{`Hola, ${firstLetterUpperCase(userIn.name_)}`}</p>}

            <div className='relative flex justify-center'>
              <Sheet open={isSheetOpen} onOpenChange={isDropMenuOpen ? setIsDropMenuOpen : setIsSheetOpen}>
                <SheetTrigger>
                  {userIn //esta es la imagen redonda del header
                    ?
                    <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-10 h-10'>
                      {<img
                        className={`relative rounded-full z-10 w-8 h-8 ${userIn.url_img_super_list === defaultSuperListImg ? 'p-2 bg-imgBorder' : ''}`}
                        alt="imagen redonda header"
                        src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                      />}
                    </div>
                    :
                    <img className='relative z-10 w-9 h-9' src={UserDisconectedIcon} alt='Aquí va un icono de usuario' />
                  }
                  {userIn?.tem_pass &&
                    <img
                      className="absolute -top-1 -right-2 z-10 w-4 h-4"
                      src={alert} alt='Aquí va un icono de alert' />}
                </SheetTrigger>
                <SheetContent className="p-0 w-72 flex flex-col justify-between">
                  <SheetHeader className="space-y-0">
                    <SheetTitle>
                      {/* este es el cuadro gris detras de la imagen circulo en el shett content */}
                      <div className='h-28 w-full relative bg-gradient-to-br from-slate-200 to-slate-500'>
                      </div>
                    </SheetTitle>
                    <Link to={userIn ? '/setting' : '/'} className="pl-2">
                      <div className=' flex items-center justify-center rounded-full border-[2px] border-gray-500 bg-white w-[106px] h-[106px] absolute top-[40px]'>
                        {userIn //esta es la imagen redonda del sheet content
                          ?
                          <img
                            className={`absolute z-10 rounded-full w-24 h-24 ${userIn.url_img_super_list === defaultSuperListImg ? 'p-2 bg-imgBorder' : ''}`}
                            src={userIn.super_list_img_selected ? userIn?.url_img_super_list : userIn?.url_img_google}
                            alt="imagen redonda"
                          />
                          :
                          <img
                            className='relative z-10 w-9 h-9'
                            src={UserDisconectedIcon}
                            alt='Aquí va un icono de usuario' />
                        }
                      </div>
                    </Link>
                    <SheetDescription asChild>
                      <div className='px-2 pt-2'>
                        <div className='flex'>
                          <div className='w-[38%]'></div>
                          {userIn && <div className={`flex items-center justify-end gap-1`}>
                            <div>{firstLetterUpperCase(userIn.name_)}</div>
                            <div>{firstLetterUpperCase(userIn.last_name)}</div>
                          </div>}
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
                            {userIn && <CommandGroup className="text-center" heading="Ajustes">
                              <Link to={'setting'}>
                                <CommandItem >
                                  <SheetClose className="w-full flex items-center gap-1">
                                    Perfil
                                    {userIn.tem_pass &&
                                      <img className="w-5 h-5"
                                        src={alert2} alt="" />}
                                  </SheetClose>
                                </CommandItem>
                              </Link >
                            </CommandGroup>}
                          </CommandList>
                        </Command>
                      </div>
                    </SheetDescription>
                  </SheetHeader>
                  <div className={`pl-2 gap-3 pb-10 flex flex-col relative`}>
                    {userIn && <SheetClose onClick={() => copyEmailClipboard()} className="flex items-start">
                      {userIn.email}
                    </SheetClose>}
                    <Link to={userIn ? '/' : '/singin'}>
                      <SheetClose>
                        <div onClick={() => handleClick()}>
                          <img className=' absolute rounded-full p-0.5 w-10 h-10 bg-slate-500' src={userIn ? logOutIcon : loginIcon} alt="" />
                          <div className={` bg-slate-300 py-2 pl-12 pr-4 rounded-full `}>{userIn ? 'Cerrar sesión' : 'Iniciar sesión'}</div>
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
      {by && !userIn &&
        <p className="w-full text-right mb-2 mr-8">
          <span className='font-bold'>by:</span> Carlos Brazon...
        </p>}
    </div >
  );
}

export default Header;