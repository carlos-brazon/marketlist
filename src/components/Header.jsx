import { useContext, useState, useEffect } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserConectedIcon from "../assets/user-svgrepo-com-green.svg";
import UserDisconectedIcon from "../assets/user-svgrepo-com-red.svg";
import { signOut } from 'firebase/auth';
import { auth, auth2 } from '../utils/firebase';
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

const Header = () => {
  const { userIn, setUserIn } = useContext(AllItemsContext);
  const [by, setBy] = useState(true);
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
    await signOut(auth2);
  }
  return (
    <div className='flex flex-col gap-2 items-center'>
      <header className="flex items-center justify-between relative text-white bg-neutral-800 py-2 px-3 w-full">
        <Link to={'/'}>
          <Button variant='secondary'>Inicio</Button>
        </Link>
        <div className='flex relative gap-3 items-center'>
          {!userIn ? <SingIn /> : ''}
          <div className='flex gap-2 items-center text-white' >
            <p className='text-sm'>{!userIn || `Hola, ${firstLetterUpperCase(userIn.nombre)}`}</p>

            <div className='relative'>
              <DropdownMenu>
                <DropdownMenuTrigger>
                  <img className='relative z-10 w-9 h-9' src={userIn ? UserConectedIcon : UserDisconectedIcon} alt='Aquí va un icono de usuario' />
                </DropdownMenuTrigger>
                <DropdownMenuContent className={'flex flex-col items-end'} >
                  <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className={`${userIn || 'hidden'}`}>{userIn?.email}</DropdownMenuItem>
                  <Link to={'HowToUse'}>
                    <DropdownMenuItem>
                      Como usar
                    </DropdownMenuItem>
                  </Link >
                  <Link to={'/'}>
                    <DropdownMenuItem onClick={() => handleClick()} className={`${userIn || 'hidden'}`}>Cerrar sesión</DropdownMenuItem>
                  </Link >
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
      <p className={`w-full text-right mb-2 mr-8 ${by && !userIn || 'hidden'}`}><span className='font-bold'>by:</span> Carlos Brazon...</p>
    </div>
  );
}

export default Header;
