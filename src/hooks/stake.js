import { useContext } from 'react';

// contexts
import { StakeContext } from '../contexts/StakeContext';

const useStake = () => {
  const stakeContext = useContext(StakeContext);

  if (stakeContext === null) {
    throw new Error('No parent <StakeContextProvider />');
  }

  return stakeContext.data;
};

export default useStake;
