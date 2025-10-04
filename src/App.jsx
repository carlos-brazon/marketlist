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
import { Toaster } from "@/components/ui/toaster"
import RootLayout from './components/Toaster'
import getCroppedImg from './utils/cropImage'
import SettingPage from './components/settings/SettingPage'
import { getNomalImageUrl } from './utils/util'
function App() {
  const [userIn, setUserIn] = useState(null);
  const [temporalCloud, setTemporalCloud] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingSingIn, setLoadingSingIn] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (loadingSingIn) {
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
          })
          const urlImgToCrop = getNomalImageUrl(userConected?.url_img_super_list);

          const urlBlobToprint = userConected?.cropp_pixel && Object.keys(userConected?.cropp_pixel).length > 0 ? await getCroppedImg(urlImgToCrop, userConected.cropp_pixel) : null;

          if (urlBlobToprint) {
            setUserIn({ ...userConected, uid: user.uid, url_img_super_list: urlBlobToprint });
          } else {
            setUserIn({ ...userConected, uid: user.uid, url_img_super_list: userConected?.super_list_img_selected ? userConected.url_img_super_list : user.providerData[0].photoURL });
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
        setLoadingSingIn(false);
      }
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
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <div className="animate-fade flex items-start relative justify-center w-full pb-3">
          <Contex userIn={userIn} setUserIn={setUserIn} temporalCloud={temporalCloud} setTemporalCloud={setTemporalCloud} setLoadingSingIn={setLoadingSingIn} setLoading={setLoading}>
            <Routes>
              <Route path='/' element={<Header />}>
                <Route index element={<Form />} />
                <Route path='HowToUse' element={<HowUse />} />
                <Route path='singin' element={<SingIn />} />
                <Route path='checkIn' element={<CheckIn />} />
              </Route>
              <Route path="setting" element={userIn && <SettingPage />} />

            </Routes>
          </Contex>
        </div>
      </BrowserRouter>
      <Toaster />
    </RootLayout>
  );
}

export default App;
