import React, { Children, createContext, useEffect, useState } from 'react'

export const AllItemsContext = createContext();

const Contex = ({ children, userIn }) => {
  const [list, setList] = useState([]);
  const [marketData, setMarketData] = useState([]);
  const [controltags, setControlTags] = useState(false);
  const [ button, setButton] = useState('Compras');

  return (
    <AllItemsContext.Provider value={{ list, setList, marketData, setMarketData, userIn, controltags, setControlTags, button, setButton }}>
      {children}
    </AllItemsContext.Provider>
  );
};

export default Contex;