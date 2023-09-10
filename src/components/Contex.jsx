import React, { Children, createContext, useEffect, useState } from 'react'

export const AllItemsContext = createContext();

const Contex = ({ children, userIn }) => {
  const [list, setList] = useState([]);
  const [controltags, setControlTags] = useState(false);
  const [ button, setButton] = useState(userIn ? userIn?.markeList[0]?.tags : 'Compras');

  return (
    <AllItemsContext.Provider value={{ list, setList, userIn, controltags, setControlTags, button, setButton }}>
      {children}
    </AllItemsContext.Provider>
  );
};

export default Contex;