import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AllItemsContext = createContext();

const Context = ({ children, userIn, setUserIn }) => {
  const [list, setList] = useState([]);
  const [addTags, setAddTags] = useState(false);
  // const [button, setButton] = useState(userIn ? userIn?.markeList[0]?.tags : 'Compras'); asi estaba funcionando siempre
  const [button, setButton] = useState(userIn ? userIn?.last_tags : 'Compras');
  const [valueInputNewTags, setValueInputNewTags] = useState('');
  const [selectedTag, setSelectedTag] = useState([]);

  return (
    <AllItemsContext.Provider value={{ setUserIn, valueInputNewTags, setValueInputNewTags, list, setList, userIn, addTags, setAddTags, button, setButton, selectedTag, setSelectedTag }}>
      {children}
    </AllItemsContext.Provider>
  );
};

Context.propTypes = {
  children: PropTypes.node.isRequired,
  userIn: PropTypes.shape({
    nombre: PropTypes.string.isRequired,
    apellido: PropTypes.string.isRequired,
    email: PropTypes.string.isRequired,
    uid: PropTypes.string.isRequired,
    markeList: PropTypes.array.isRequired,
    last_tags: PropTypes.string.isRequired,
  }),
  setUserIn: PropTypes.func.isRequired,
};

export default Context;
