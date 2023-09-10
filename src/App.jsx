// import { useEffect, useState } from 'react'
// import './App.css'
// import SingIn from './components/SingIn'
// import { BrowserRouter, Route, Routes } from 'react-router-dom'
// import CheckIn from './components/CheckIn'
// import Header from './components/Header'
// import { getAuth, onAuthStateChanged } from 'firebase/auth'
// import { collection, getDocs, query, where } from 'firebase/firestore'
// import { db } from './utils/firebase'
// import Form from './components/Form'
// import Contex from './components/Contex'
// import HowUse from './components/HowUse'

// function App() {
//   const [userIn, setUserIn] = useState();
//   const [loading, setLoading] = useState(false)
//   const settime = () => {
//     setTimeout(() => {
//       setLoading(true)
//     }, 1700);
//   }

//   useEffect(() => {
//     const auth = getAuth();
//     const unsubscribe = onAuthStateChanged(auth, async (user) => {
//       if (user) {
//         const userFirebase = await getDocs(query(collection(db, 'users4'), where('email', '==', user.email)));
//         let userReal;
//         userFirebase.forEach(user => {
//           userReal = user.data();
//         });
//         setUserIn({ ...userReal, uid: user.uid });
//       } else {
//         setUserIn(null);
//       }
//     });

//     settime()
//     return () => {
//       unsubscribe();
//     }
//   }, []);

//   return (
//     <>{
//       loading ?
//         <div className='animate-fade flex items-start justify-center min-h-screen min-w-min bg-gray-300'>
//           <Contex userIn={userIn}>
//             <BrowserRouter>
//               <Routes>
//                 <Route path='/' element={<Header userIn={userIn || null} />}>
//                   <Route index element={<Form />} />
//                   <Route path='HowToUse' element={<HowUse />} />
//                   <Route path='singin' element={<SingIn userIn={userIn} />} />
//                   <Route path='checkIn' element={<CheckIn />} />
//                 </Route>
//               </Routes>
//             </BrowserRouter>
//           </Contex>
//         </div>
//         :
//         <div className='flex flex-col min-h-screen min-w-min items-center justify-center'>
//           <div className="lds-default"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
//           <div>Cargando...</div>
//         </div>
//     }
//     </>
//   );
// }

// export default App;

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

function App() {
  const [userIn, setUserIn] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userFirebase = await getDocs(query(collection(db, 'users4'), where('email', '==', user.email)));
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
  }, []);

  return (
    <>
      {loading ? (
        <div className='flex flex-col min-h-screen min-w-min items-center justify-center'>
          <div className="lds-default">
            <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
          </div>
          <div>Cargando...</div>
        </div>
      ) : (
        <div className='animate-fade flex items-start relative justify-center min-h-screen min-w-min bg-gray-300'>
          <Contex userIn={userIn}>
            <BrowserRouter>
              <Routes>
                <Route path='/' element={<Header />}>
                  <Route index element={<Form />} />
                  <Route path='HowToUse' element={<HowUse />} />
                  <Route path='singin' element={<SingIn/>} />
                  <Route path='checkIn' element={<CheckIn />} />
                </Route>
              </Routes>
            </BrowserRouter>
          </Contex>
        </div>
      )}
    </>
  );
}

export default App;
