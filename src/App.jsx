import { useEffect, useState } from 'react'
import './App.css'
import SingIn from './components/SingIn'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import CheckIn from './components/CheckIn'
import Header from './components/Header'
import { onAuthStateChanged } from 'firebase/auth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { auth, db } from './utils/firebase'
import Form from './components/Form'
import Contex from './components/Contex'
import HowUse from './components/HowUse'
import { Toaster } from "@/components/ui/toaster";
import RootLayout from './components/Toaster'

function App() {
  const [userIn, setUserIn] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userFirebase = await getDocs(query(collection(db, 'usersMarketList'), where('email', '==', user.email)));
        let userReal;
        userFirebase.forEach(user => {
          userReal = user.data();
        });
        setUserIn({ ...userReal, uid: user.uid });
      } else {
        setUserIn(null);
      }
      setLoading(false);
    });
    return () => {
      unsubscribe();
    }
  }, [loading]);


  return (
    <RootLayout>
      <div className="animate-fade flex items-start relative justify-center min-h-screen min-w-min pb-3">
        {loading && !userIn ? (
          <div className='flex flex-col min-h-screen min-w-min items-center justify-center'>
            <div className="lds-default">
              <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
            </div>
            <div>Cargando...</div>
          </div>
        ) : (
          <div className='w-screen'>
            <Contex userIn={userIn} setUserIn={setUserIn}>
              <BrowserRouter>
                <Routes>
                  <Route path='/' element={<Header />}>
                    <Route index element={<Form />} />
                    <Route path='HowToUse' element={<HowUse />} />
                    <Route path='singin' element={<SingIn />} />
                    <Route path='checkIn' element={<CheckIn />} />
                  </Route>
                </Routes>
              </BrowserRouter>
            </Contex>
          </div>
        )}
      </div>
      <Toaster />
    </RootLayout>

  );
}

export default App;
