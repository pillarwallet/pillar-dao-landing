export const pause = (multiplier) => new Promise(resolve => setTimeout(resolve, (multiplier || 1) * 1000));

export const chainIdToNetworkName = {
  1: 'homestead',
  137: 'matic',
  4: 'rinkeby',
};

export const chainIdToNetworkTitle = {
  1: 'Ethereum Mainnet',
  137: 'Polygon',
  4: 'Rinkeby',
};

export const chainIdToInfuraPrefix = {
  1: 'mainnet',
  137: 'polygon-mainnet',
  4: 'rinkeby',
};

export const chainIdToPlrAddress = {
  1: '0xe3818504c1b32bf1557b16c238b2e01fd3149c17',
  137: '0xa6b37fc85d870711c56fbcb8afe2f8db049ae774',
  4: '0xf4364d84014dfa96748a3329393e6b23aba9baee',
};

export const isMainnet = +process.env.NEXT_PUBLIC_NETWORK_ID === 137;

export const formatNumber = (value, maxDigits = 2) => new Intl.NumberFormat('en-US', { maximumFractionDigits: maxDigits }).format(value);

export const isCaseInsensitiveMatch = (a, b) => {
  if (a === b) return true;
  if (!a || !b) return false;
  return a.toLowerCase() === b.toLowerCase();
};
