// import React, { useContext } from 'react'
// import { useEffect, useState } from 'react';
// import { collection, query, where, getDocs, doc, updateDoc } from 'firebase/firestore';
// import { db } from '../utils/firebase';
// import { AllItemsContext } from './Contex';

// const MarketList = ({ userIn }) => {
//   const { list, setList } = useContext(AllItemsContext)
//   const [marketData, setMarketData] = useState([]);
//   const [controlDone, setControlDone] = useState(false)
//   console.log(controlDone);

//   const updateIsDoneInFirestore = async (userId, itemId, newIsDoneValue) => {
//     console.log(userId);
//     console.log(itemId);
//     try {
//       const docRef = doc(db, 'users4', userId);
//       const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
//           const market = querySnapshot.docs[0].data(); // Obtén el campo "markeList" (array de objetos)
      
//       if (!querySnapshot.empty) {
//         const updatedMarkeList = market.markeList.map(item => {
//           if (item.id === itemId) {
//             return { ...item, isDone: newIsDoneValue };
//           }
//           return item;
//         });
  
//         await updateDoc(docRef, { markeList: updatedMarkeList });
//         console.log('isDone actualizado en Firestore correctamente.');
//       } else {
//         console.log('El documento no existe en Firestore.');
//       }
//     } catch (error) {
//       console.error('Error al actualizar isDone en Firestore:', error);
//     }
//   };
//   const handleClick = (objitem) => {
//     updateIsDoneInFirestore(userIn.uid, objitem.id, objitem.isDone === false ? true : false)
//     setList(prev => {
//       const updatedList = prev.map(item => {
//         if (item.id === objitem.id) {
//           return { ...item, isDone: objitem.isDone === false ? true : false };
//         }
//         return item;
//       });
//       return updatedList;
//     });
//     setControlDone(prev => !prev)
//   };


//   useEffect(() => {
//     console.log(userIn);
//     const fetchMarketData = async () => {
//       try {
//         const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));

//         if (!querySnapshot.empty) {
//           const market = querySnapshot.docs[0].data().markeList || []; // Obtén el campo "markeList" (array de objetos)
//           setMarketData(market.sort((a, b) => a.name.localeCompare(b.name)));
//         } else {
//           console.log('No se encontraron documentos que cumplan con los criterios.');
//         }
//       } catch (error) {
//         console.error('Error al realizar la consulta:', error);
//       }
//     };

//     fetchMarketData();
//   }, [controlDone, list, userIn]);

//   return (
//     <div>
//       <div>
//         <h1>Market Data</h1>
//         <ul>
//           {marketData.map((item, index) => (
//             <li className={item.isDone ? 'line-through' : ''} onClick={() => handleClick(item)} key={index}>{item.name}</li>
//           ))}
//         </ul>
//       </div>

//     </div>
//   )
// }

// export default MarketList

import React, { useContext, useEffect, useState } from 'react';
import { collection, query, where, getDocs, getDoc, doc, updateDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { AllItemsContext } from './Contex';

const MarketList = ({ userIn }) => {
  const { list, setList } = useContext(AllItemsContext);
  const [marketData, setMarketData] = useState([]);
  const [lastTapTime, setLastTapTime] = useState(0);

  const deleteProduct = async (itemId) => {
  //   const currentTime = new Date().getTime();
  //   const timeSinceLastTap = currentTime - lastTapTime;

  //   if (timeSinceLastTap < 300) {
      
  //     const userDocRef = doc(db, 'users4', userIn.uid);
  //     const userDocSnapshot = await getDoc(userDocRef);

  //     if (userDocSnapshot.exists()) {
  //       const userData = userDocSnapshot.data();
  //       const updatedMarkeList = userData.markeList.filter(item => item.id !== itemId);

  //       await updateDoc(userDocRef, { markeList: updatedMarkeList });
  //       console.log('Producto eliminado de Firestore correctamente.');

  //       setList(prev => prev.filter(item => item.id !== itemId));
  //       setMarketData(prevMarketData => prevMarketData.filter(item => item.id !== itemId));
  //     } else {
  //       console.log('El documento no existe en Firestore.');
  //     }
  //   setLastTapTime(currentTime);
  // };
    // try {
    //   const userDocRef = doc(db, 'users4', userIn.uid);
    //   const userDocSnapshot = await getDoc(userDocRef);

    //   if (userDocSnapshot.exists()) {
    //     const userData = userDocSnapshot.data();
    //     const updatedMarkeList = userData.markeList.filter(item => item.id !== itemId);

    //     await updateDoc(userDocRef, { markeList: updatedMarkeList });
    //     console.log('Producto eliminado de Firestore correctamente.');

    //     setList(prev => prev.filter(item => item.id !== itemId));
    //     setMarketData(prevMarketData => prevMarketData.filter(item => item.id !== itemId));
    //   } else {
    //     console.log('El documento no existe en Firestore.');
    //   }
    // } catch (error) {
    //   console.error('Error al eliminar el producto en Firestore:', error);
    // }
  };

  const updateIsDoneInFirestore = async (userId, itemId, newIsDoneValue) => {
    try {
      const docRef = doc(db, 'users4', userId);
      const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
      const market = querySnapshot.docs[0]?.data()?.markeList || [];

      if (!querySnapshot.empty) {
        const updatedMarkeList = market.map(item => {
          if (item.id === itemId) {
            return { ...item, isDone: newIsDoneValue };
          }
          return item;
        });

        await updateDoc(docRef, { markeList: updatedMarkeList });
        console.log('isDone actualizado en Firestore correctamente.');
      } else {
        console.log('El documento no existe en Firestore.');
      }
    } catch (error) {
      console.error('Error al actualizar isDone en Firestore:', error);
    }
  };

  const handleClick = async (objitem) => {
    const currentTime = new Date().getTime();
    const timeSinceLastTap = currentTime - lastTapTime;

    if (timeSinceLastTap < 300) {
      
      const userDocRef = doc(db, 'users4', userIn.uid);
      const userDocSnapshot = await getDoc(userDocRef);

      if (userDocSnapshot.exists()) {
        const userData = userDocSnapshot.data();
        const updatedMarkeList = userData.markeList.filter(item => item.id !== objitem.id);

        await updateDoc(userDocRef, { markeList: updatedMarkeList });
        console.log('Producto eliminado de Firestore correctamente.');

        setList(prev => prev.filter(item => item.id !== objitem.id));
        setMarketData(prevMarketData => prevMarketData.filter(item => item.id !== objitem.id));
      } else {
        console.log('El documento no existe en Firestore.');
      }
    };
    setLastTapTime(currentTime);
    const newIsDoneValue = !objitem.isDone;
    await updateIsDoneInFirestore(userIn.uid, objitem.id, newIsDoneValue);

    setList(prev => {
      const updatedList = prev.map(item => {
        if (item.id === objitem.id) {
          return { ...item, isDone: newIsDoneValue };
        }
        return item;
      });
      return updatedList;
    });

    setMarketData(prevMarketData => {
      const updatedMarketData = prevMarketData.map(item => {
        if (item.id === objitem.id) {
          return { ...item, isDone: newIsDoneValue };
        }
        return item;
      });
      return updatedMarketData;
    });
  };

  useEffect(() => {
    const fetchMarketData = async () => {
      try {
        const querySnapshot = await getDocs(query(collection(db, 'users4'), where('email', '==', userIn.email)));
        if (!querySnapshot.empty) {
          const market = querySnapshot.docs[0].data().markeList || [];
          setMarketData(market.sort((a, b) => a.name.localeCompare(b.name)));
        } else {
          console.log('No se encontraron documentos que cumplan con los criterios.');
        }
      } catch (error) {
        console.error('Error al realizar la consulta:', error);
      }
    };

    fetchMarketData();
  }, [list, userIn]);

  return (
      <div>
        <h1 className='text-center text-3xl'>Artículos</h1>
        <ul className='flex flex-col text-2xl'>
          {marketData.map((item, index) => (
            <li
              className={`list-disc ${item.isDone ? 'line-through' : ''}`}
              onClick={() => handleClick(item)}
              onDoubleClick={() => deleteProduct(item.id)}
              key={index}
            >
              {item.name}
            </li>
          ))}
        </ul>
      </div>
  );
};

export default MarketList;
