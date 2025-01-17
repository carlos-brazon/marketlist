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
  const [temporalCloud, setTemporalCloud] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userFirebase = await getDocs(query(collection(db, 'userMarketList'), where('email', '==', user.email)));
        const dataFromFirebase = await getDocs(query(collection(db, "dataItemsMarketList"), where("userUid", "==", user.uid)));
        let userConected;
        let dataUser = [];

        userFirebase.forEach(user => {
          userConected = user.data();
        });

        dataFromFirebase.forEach(item => {
          dataUser.push(item.data());
        });

        setUserIn({ ...userConected, uid: user.uid });

        const dataSorted = dataUser.sort((a, b) => {
          const dateA = a.create_at ? (a.create_at.toDate ? a.create_at.toDate() : new Date(a.create_at)) : new Date(0);
          const dateB = b.create_at ? (b.create_at.toDate ? b.create_at.toDate() : new Date(b.create_at)) : new Date(0);
          return dateA - dateB;
        });

        setTemporalCloud(dataSorted);
      } else {
        setUserIn(null);
        setTemporalCloud([]);
      }
      setLoading(false);
    });

    return () => {
      unsubscribe();
    };
  }, []);


  if (loading) {
    return (
      <div className='flex flex-col min-h-screen min-w-min items-center justify-center'>
        <div className="lds-default">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
        <div>Cargando...</div>
      </div>
    );
  }

  return (
    <RootLayout>
      <div className="animate-fade flex items-start relative justify-center min-h-screen min-w-min pb-3">
        <div className='w-screen'>
          <Contex userIn={userIn} setUserIn={setUserIn} temporalCloud={temporalCloud} setTemporalCloud={setTemporalCloud}>
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
      </div>
      <Toaster />
    </RootLayout>
  );
}

export default App;
