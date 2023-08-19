import React, { useContext, useState } from 'react'
import { Link, Outlet } from 'react-router-dom'
import { signOut } from 'firebase/auth';
import { auth } from '../utils/firebase';

const Header = ({ userIn }) => {

    return (
        <div className=' flex flex-col items-center p-2 w-fit gap-2'>
            <h1>Lista de compras</h1>
            <header className="flex items-center relative gap-10 p-4 text-white">
                <Link to={'/'} className={`py-3 px-6 font-semibold text-sm leading-4 rounded bg-slate-400 text-white`}>{'Inicio'} </Link>
                <Link to={'singin'} className={`py-3 px-6 font-semibold text-sm leading-4 rounded bg-slate-400 text-white ${!userIn ? '' : 'hidden'}`}>{'Iniciar sesión'} </Link>
                {!userIn ? <button className={`${!userIn ? 'hidden' : ''}`}>Log In</button> : <button className={`bg-slate-400 text-white py-3 px-6 font-semibold text-sm leading-4 rounded ${!userIn ? '' : ''}`} onClick={() => signOut(auth)}>Cerrar sesión</button>}
            </header>
            <p className='text-black'>{userIn?.email}</p>
            <Outlet />
        </div>
    )
}

export default Header;