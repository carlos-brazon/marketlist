import { useEffect, useState } from 'react'
import './App.css'
import SingIn from './components/SingIn'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckIn from './components/CheckIn'
import Header from './components/Header'
import { getAuth, onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { db } from './utils/firebase'
import Form from './components/Form'
import Contex from './components/Contex'
import HowUse from './components/HowUse'
import Danger from './components/Danger'

function App() {
  const [userIn, setUserIn] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);
  const [danger, setDanger] = useState(false)

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        const uid = user.uid;
        const userFirebase = await getDocs(query(collection(db, 'users4'), where('email', '==', user.email)))
        let userReal;
        userFirebase.forEach(user => {
          userReal = user.data()
        });
        setUserIn({ ...userReal, uid: uid })
        setUserLoaded(true);


      } else {
        setUserIn(null)
      }
    });
  }, []);

  return (

    <div className='flex relative items-start justify-center min-h-screen w-screen bg-gray-300'>
      {danger ? <Danger setDanger={setDanger} userIn={userIn} /> : ''}
      <Contex userIn={userIn}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Header userIn={userIn} />}>
              <Route index element={<Form userIn={userIn} />} />
              <Route path='HowToUse' element={<HowUse />}/>
              <Route path='singin' element={<SingIn userIn={userIn} />} />
              <Route path='checkIn' element={<CheckIn />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Contex>
      <button onClick={() => setDanger(true)} className={`p-2 font-semibold text-base leading-4 bg-red-600 text-white rounded absolute bottom-0 mb-3 ${userIn ? '' : 'hidden'}`}>Eliminar todos los productos</button>
    </div>
  )
}

export default App
