import { useContext } from 'react';

// contexts
import { Web3Context } from '../contexts/Web3Context';

const useWeb3 = () => {
  const web3Context = useContext(Web3Context);

  if (web3Context === null) {
    throw new Error('No parent <Web3ContextProvider />');
  }

  return web3Context.data;
};

export default useWeb3;
