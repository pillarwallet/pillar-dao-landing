import axios from 'axios';
import { ethers } from 'ethers';

export const verifyAndSubmit = async (provider, requestData) => {
  const signer = provider.getSigner();
  const messageBytes = ethers.utils.toUtf8Bytes('Pillar Verify Message');

  let signedMessage;
  let signedMessageErrorMessage;
  try {
    signedMessage = await signer.signMessage(messageBytes);
  } catch (e) {
    signedMessageErrorMessage = e?.message;
  }

  if (!signedMessage) {
    return { errorMessage: signedMessageErrorMessage || 'Failed to sign message!' }
  }

  try {
    const { data } = await axios.post(`${process.env.NEXT_PUBLIC_VERIFY_SERVICE_HOSTNAME}/submit`, {
      ...requestData,
      signedMessage,
    });
    return data;
  } catch (e) {
    return { errorMessage: e?.message || 'Unknown error!' }
  }
}
