import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, Outlet } from 'react-router-dom';
import UserConected from "../assets/user-svgrepo-com-green.svg";
import UserDisconected from "../assets/user-svgrepo-com-red.svg";
import ChevronUpWhite from "../assets/chevron-up-dot-svgrepo-com.svg";
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const Header = ({ userIn }) => {
  const [iconUser, setIconUser] = useState(false);
  const [by, setBy] = useState(true)
  const divRef = useRef(null);
  const iconRef = useRef(null);

  const showMessage = () => {
    setTimeout(() => {
        setBy(false);
    }, 3000);
};
  useEffect(() => {
    showMessage();
    const handleClickOutside = (event) => {
      if (
        divRef.current &&
        !divRef.current.contains(event.target) &&
        iconRef.current &&
        !iconRef.current.contains(event.target)
      ) {
        setIconUser(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className='flex flex-col gap-2 items-center h-full'>
      <header className="flex items-center justify-between relative text-white bg-neutral-800 py-5 px-3 w-screen">
        <Link onClick={() => setIconUser(false)} to={'/'} className={'py-2 px-2 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950'}>{'Inicio'} </Link>

        <div className='flex relative gap-3 items-center'>
          <Link onClick={() => setIconUser(false)} to={'singin'} className={`py-2 px-5 font-semibold text-sm leading-4 rounded text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950 ${!userIn ? '' : 'hidden'} `}>{'Iniciar sesión'} </Link>

          <div className='flex gap-2 items-center text-white' >
            <p className='text-sm'>{userIn ? `Hola, ${userIn?.nombre?.charAt(0).toUpperCase() + userIn?.nombre?.slice(1)}` : ''}</p>
            <img onClick={() => setIconUser(prev => !prev)} className='static z-10 w-9 h-9' ref={iconRef} src={!userIn ? UserDisconected : UserConected} alt='Aquí va un icono de usuario' />
          </div>

          <div className={`flex flex-col z-10 items-end absolute w-40 h-40 top-8 -right-1 rounded-md text-black ${iconUser ? '' : 'hidden'}`} ref={divRef}>
            <div className='pr-2'>
              <img className='w-7 h-7' src={ChevronUpWhite} alt="" />
            </div>
            <div className={`flex flex-col rounded-md items-end gap-2 p-2 w-auto h-auto border border-stone-400 shadow-md shadow-gray-700 bg-white ${iconUser ? '' : 'hidden'}`}>
              <div className={`flex w-full items-end hover:bg-slate-200 p-1 flex-col gap-2 ${userIn ? '' : 'hidden'}`}>
                <p>{userIn?.email}</p>
              </div>
              <div onClick={() => setIconUser(false)} className='flex w-full items-end hover:bg-slate-200 p-1 flex-col gap-2'>
                <Link to={'HowToUse'}>Como usar</Link >
              </div>
              <div onClick={() => { signOut(auth); setIconUser(false); }} className={`flex w-full items-end hover:bg-slate-200 p-1 flex-col gap-2 ${userIn ? '' : 'hidden'}`}>
                <p>Cerrar sesión</p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <Outlet />
      <p className={`w-full text-right mb-2 mr-8 ${by ? '' : 'hidden'}`}><span className='font-bold'>by:</span> Carlos Brazon</p>
    </div>
  );
}

export default Header;
