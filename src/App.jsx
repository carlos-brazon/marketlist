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
import Settings from './components/Settings'
import getCroppedImg from './utils/cropImage'


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
        const realUrl = userConected?.cropp_pixel?.width ? await getCroppedImg(userConected.url_img_super_list, userConected.cropp_pixel) : null

        if (realUrl) {
          setUserIn({ ...userConected, uid: user.uid, url_img_super_list: realUrl });
        } else {
          setUserIn({ ...userConected, uid: user.uid, url_img_super_list: userConected.super_list_img_selected ? userConected.url_img_super_list : user.providerData[0].photoURL });
        }

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
      <div className="animate-fade flex items-start relative justify-center w-full pb-3">
        <Contex userIn={userIn} setUserIn={setUserIn} temporalCloud={temporalCloud} setTemporalCloud={setTemporalCloud}>
          <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <Routes>
              <Route path='/' element={<Header />}>
                <Route index element={<Form />} />
                <Route path='HowToUse' element={<HowUse />} />
                <Route path='singin' element={<SingIn />} />
                <Route path='checkIn' element={<CheckIn />} />
              </Route>
              <Route path='setting' element={<Settings />} />
            </Routes>
          </BrowserRouter>
        </Contex>
      </div>
      <Toaster />
    </RootLayout>
  );
}

export default App;
