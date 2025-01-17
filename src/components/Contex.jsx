import { createContext, useState } from 'react';
import PropTypes from 'prop-types';

export const AllItemsContext = createContext();

const Context = ({ children, userIn, setUserIn, temporalCloud, setTemporalCloud }) => {
  const [list, setList] = useState([]);
  const [addTags, setAddTags] = useState(false);
  const [button, setButton] = useState(userIn?.last_tags?.length ? userIn?.last_tags : 'Compras');
  const [valueInputNewTags, setValueInputNewTags] = useState();
  const [tags, setTags] = useState([]);

  return (
    <AllItemsContext.Provider value={{ setUserIn, valueInputNewTags, setValueInputNewTags, list, setList, userIn, addTags, setAddTags, button, setButton, tags, setTags, temporalCloud, setTemporalCloud }}>
      {children}
    </AllItemsContext.Provider>
  );
};

Context.propTypes = {
  children: PropTypes.node.isRequired,
  userIn: PropTypes.shape({
    nombre: PropTypes.string,
    apellido: PropTypes.string,
    email: PropTypes.string,
    uid: PropTypes.string,
    markeList: PropTypes.array,
    last_tags: PropTypes.string,
  }),
  temporalCloud: PropTypes.array,
  setUserIn: PropTypes.func,
  setTemporalCloud: PropTypes.func,
};

export default Context;
