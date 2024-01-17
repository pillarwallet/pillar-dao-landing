import { SessionStorage } from 'etherspot';

const storageVersion = 1;

const setItem = (key, value) =>
  localStorage.setItem(`@etherspotTransactionBuilder-storage-v${storageVersion}:${key}`, value);

const getItem = (key) => localStorage.getItem(`@etherspotTransactionBuilder-storage-v${storageVersion}:${key}`);

class LocalSessionStorage extends SessionStorage {
  constructor() {
    super();
  }

  setSession = async (walletAddress, session) => {
    if (walletAddress) {
      setItem(`session-${walletAddress}`, JSON.stringify(session));
    }
  };

  getSession = (walletAddress) => {
    let result = null;

    try {
      const raw = getItem(`session-${walletAddress}`);
      result = raw ? JSON.parse(raw) : null;
    } catch (err) {
      //
    }

    return result;
  };

  resetSession = (walletAddress) => {
    setItem(`session-${walletAddress}`, '');
  };
}

export const sessionStorageInstance = new LocalSessionStorage();
