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


function App() {
  const [userIn, setUserIn] = useState([]);
  const [userLoaded, setUserLoaded] = useState(false);

  useEffect(() => {
    const auth = getAuth();
    onAuthStateChanged(auth, async (user) => {
      if (user) {
        console.log(user);
        const uid = user.uid;
        const userFirebase = await getDocs(query(collection(db, 'users4'), where('email', '==', user.email)))
        console.log(userFirebase);
        let userReal;
        userFirebase.forEach(user => {
          userReal = user.data()
        });
        setUserIn({ ...userReal, uid: uid })
        setUserLoaded(true);


      } else {
        console.log(userIn);
        setUserIn(null)
      }
    });
  }, []);


  return (

    <div className='flex items-center justify-center p-2'>
      <Contex userIn={userIn}>
        <BrowserRouter>
          <Routes>
            <Route path='/' element={<Header userIn={userIn} />}>
              <Route index element={<Form userIn={userIn} />} />
              {/* <Route index element={<MarketList />}/> */}
              <Route path='singin' element={<SingIn userIn={userIn} />} />
              <Route path='checkIn' element={<CheckIn />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </Contex>
    </div>
  )
}

export default App
