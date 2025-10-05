import { useEffect } from 'react';
import { daoLinks } from '@config/dao-links';

export default function Voting() {
  useEffect(() => {
    window.location.href = daoLinks.DAO_VOTE_PLATFORM;
  }, []);
  return null;
}
