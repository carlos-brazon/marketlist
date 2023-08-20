import React, { useContext, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';
import { AllItemsContext } from './Contex';

const Header = ({ userIn }) => {
    const { setDanger} = useContext(AllItemsContext)
    return (
        <div className=' flex flex-col items-center p-2 h-screen w-fit gap-2'>
            <h1 className='text-2xl font-bold'>Lista de compras</h1>
            <header className="flex items-center relative gap-10 p-1 text-white">
                <Link to={'/'} className={'py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950'}>{'Inicio'} </Link>

                <Link to={'singin'} className={`py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950 ${!userIn ? '' : 'hidden'}`}>{'Iniciar sesión'} </Link>

                {!userIn || <Link to={''} className={`py-3 px-6 font-semibold text-sm leading-4 rounded  text-white hover:bg-slate-700  bg-slate-600 hover:shadow-blue-800 shadow-md shadow-blue-950`} onClick={() => signOut(auth)}>Cerrar sesión</Link>}
            </header>
            <p className='text-black text-lg'>{userIn ? `Hola, ${userIn?.nombre?.charAt(0).toUpperCase() + userIn?.nombre?.slice(1)} bienvenido` : ''}</p>
            <Outlet />
            <button onClick={() => setDanger(true)} className='p-2 font-semibold text-base leading-4 bg-red-600 text-white rounded absolute bottom-1'>Eliminar todos los productos</button>
        </div>
    )
}

export default Header;