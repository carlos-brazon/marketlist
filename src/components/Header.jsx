import React, { useContext } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { AllItemsContext } from './Contex';
import UserConected from "../assets/user-add-svgrepo-com.svg";

const Header = ({ userIn }) => {
    const { setDanger } = useContext(AllItemsContext)
    return (
        <div className=' flex flex-col items-center p-2 h-full gap-2 '>
            <header className="flex items-center justify-between relative text-white bg-neutral-800 py-5 px-3 w-screen">
                <Link to={'/'} className={'py-2 px-5 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950'}>{'Inicio'} </Link>

                <div className='flex gap-3 items-center'>
                    <Link to={'singin'} className={`py-2 px-5 font-semibold text-sm leading-4 rounded text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950 ${!userIn ? '' : 'hidden'}`}>{'Iniciar sesión'} </Link>

                    {!userIn || <Link to={''} className={`py-2 px-5 font-semibold text-sm leading-4 rounded text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950`} onClick={() => signOut(auth)}>Cerrar sesión</Link>}

                    <img className='w-10 h-10' src={UserConected} alt="" />
                </div>


            </header>
            <p className='text-black text-lg'>{userIn ? `Hola, ${userIn?.nombre?.charAt(0).toUpperCase() + userIn?.nombre?.slice(1)} bienvenido` : ''}</p>
            <Outlet />
            <button onClick={() => setDanger(true)} className='p-2 font-semibold text-base leading-4 bg-red-600 text-white rounded absolute bottom-1'>Eliminar todos los productos</button>
        </div>
    )
}

export default Header;