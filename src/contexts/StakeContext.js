import { useContext, useMemo, createContext, useState, useCallback, useEffect } from 'react';
import { toast } from 'react-toastify';

// hooks
import useWeb3 from '../hooks/web3';

// services
import {
  approveTokensForStaking,
  canAddressUnstake,
  checkIfApprovedForStaking,
  getPlrBalanceForAddress,
  getRequiredStakeAmount,
  isPlrStakedByAddress,
  stakePlr,
  unstakePlr,
  waitForTransaction,
} from '../services/contract';

export const StakeContext = createContext(null);

const StakeContextProvider = ({ children }) => {
  const stakeContext = useContext(StakeContext);
  if (stakeContext !== null) {
    throw new Error('<StakeContextProvider /> has already been declared.');
  }

  const { connectedProvider, connectedAddress } = useWeb3();
  const [isStaking, setIsStaking] = useState(false);
  const [isUnstaking, setIsUnstaking] = useState(false);
  const [isApproving, setIsApproving] = useState(false);
  const [isApprovedForStaking, setIsApprovedForStaking] = useState(false);
  const [isUnstakeAvailable, setIsUnstakeAvailable] = useState(false);
  const [balanceAvailable, setBalanceAvailable] = useState(null);
  const [isStaked, setIsStaked] = useState(null);
  const [requiredStakeAmount, setRequiredStakeAmount] = useState(0);

  const stake = useCallback(async () => {
    setIsStaking(true);
    if (isStaking) return;

    const hash = await stakePlr(requiredStakeAmount, connectedProvider);
    if (!hash) {
      setIsStaking(false);
      return;
    }

    const receipt = await waitForTransaction(hash);
    if (receipt?.status === 0) {
      toast.error('Staking failed!');
      setIsStaking(false);
      return;
    }

    setIsStaking(false);
    setBalanceAvailable((current) => +current - +requiredStakeAmount);
    setIsStaked(true);
    // fetch membershipId and display
    // const membershipId = await getMembershipId(connectedProvider);
    toast.success('Successfully staked!');
  },[connectedProvider, isStaking, requiredStakeAmount]);

  const unstake = useCallback(async () => {
    setIsUnstaking(true);
    if (isUnstaking) return;

    const hash = await unstakePlr(connectedProvider);
    if (!hash) {
      setIsUnstaking(false);
      return;
    }

    const receipt = await waitForTransaction(hash);
    if (receipt?.status === 0) {
      toast.error('Unstaking failed!');
      setIsUnstaking(false);
      return;
    }

    setIsUnstaking(false);
    setBalanceAvailable((current) => +current + +requiredStakeAmount);
    setIsStaked(false);
    toast.success('Successfully unstaked!');
  },[connectedProvider, isUnstaking, requiredStakeAmount]);

  const updateApprovedForStaking = useCallback(async () => {
    if (!connectedAddress || requiredStakeAmount === 0) return;

    const isApproved = await checkIfApprovedForStaking(requiredStakeAmount, connectedAddress, connectedProvider);
    setIsApprovedForStaking(isApproved);
  },[connectedAddress, connectedProvider, requiredStakeAmount]);

  useEffect(() => {
    updateApprovedForStaking();
  }, [updateApprovedForStaking]);

  const approveForStaking = useCallback(async () => {
    setIsApproving(true);
    if (isApproving) return;

    const hash = await approveTokensForStaking(requiredStakeAmount, connectedProvider);
    console.log('Hash ',hash);
    if (!hash) {
      setIsApproving(false);
      return;
    }

    const receipt = await waitForTransaction(hash);
    if (receipt?.status === 0) {
      toast.error('Approving failed!');
      setIsApproving(false);
      return;
    }

    setIsApproving(false);
    setIsApprovedForStaking(true);
    toast.success('Successfully approved!');
  },[connectedProvider, isApproving, requiredStakeAmount]);

  const updateBalanceAvailable = useCallback(async () => {
    if (!connectedAddress) return;

    const currentTotalSupply = await getPlrBalanceForAddress(connectedAddress, connectedProvider);
    setBalanceAvailable(currentTotalSupply);
  }, [connectedAddress, connectedProvider]);

  useEffect(() => {
    updateBalanceAvailable();
  }, [updateBalanceAvailable]);

  const checkIfStaked = useCallback(async () => {
    if (!connectedAddress) return;

    const stakedState = await isPlrStakedByAddress(connectedAddress, connectedProvider);
    setIsStaked(stakedState);
  }, [connectedAddress, connectedProvider]);

  useEffect(() => {
    checkIfStaked();
  }, [checkIfStaked]);

  const checkIfUnstakeAvailable = useCallback(async () => {
    if (!connectedAddress) return;

    const unstakeAvailable = await canAddressUnstake(connectedAddress, connectedProvider);
    setIsUnstakeAvailable(unstakeAvailable);
  }, [connectedAddress, connectedProvider]);

  useEffect(() => {
    checkIfUnstakeAvailable();
  }, [checkIfUnstakeAvailable]);

  const updateRequiredStakeAmount = useCallback(async () => {
    const stakeAmount = await getRequiredStakeAmount(connectedProvider);
    setRequiredStakeAmount(stakeAmount);
  }, [connectedProvider]);

  useEffect(() => {
    updateRequiredStakeAmount();
  }, [updateRequiredStakeAmount]);

  const contextData = useMemo(() => ({
    stake,
    unstake,
    isStaking,
    isUnstaking,
    balanceAvailable,
    isStaked,
    isApprovedForStaking,
    isApproving,
    approveForStaking,
    isUnstakeAvailable,
    requiredStakeAmount,
  }), [
    stake,
    unstake,
    isStaking,
    isUnstaking,
    balanceAvailable,
    isStaked,
    isApprovedForStaking,
    isApproving,
    approveForStaking,
    isUnstakeAvailable,
    requiredStakeAmount,
  ]);

  return (
    <StakeContext.Provider value={{ data: contextData }}>
      {children}
    </StakeContext.Provider>
  );
};

export default StakeContextProvider;
