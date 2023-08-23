import React, { Children, createContext, useEffect, useState } from 'react'

export const AllItemsContext = createContext();

const Contex = ({ children, userIn }) => {
  const [list, setList] = useState([]);
  const [marketData, setMarketData] = useState([]);

  return (
    <AllItemsContext.Provider value={{ list, setList, marketData, setMarketData, userIn }}>
      {children}
    </AllItemsContext.Provider>
  );
};

export default Contex;