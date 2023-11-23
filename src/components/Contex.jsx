import { createContext, useState } from 'react'
import PropTypes from 'prop-types';

export const AllItemsContext = createContext();

const Contex = ({ children, userIn }) => {
  const [list, setList] = useState([]);
  const [controltags, setControlTags] = useState(false);
  const [button, setButton] = useState(userIn ? userIn?.markeList[0]?.tags : 'Compras');
  const [selectedTag, setSelectedTag] = useState([]);

  return (
    <AllItemsContext.Provider value={{ list, setList, userIn, controltags, setControlTags, button, setButton, selectedTag, setSelectedTag }}>
      {children}
    </AllItemsContext.Provider>
  );
};
Contex.propTypes = {
  children: PropTypes.node.isRequired,
  userIn: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    markeList: PropTypes.array.isRequired,
  }).isRequired,
};

export default Contex;