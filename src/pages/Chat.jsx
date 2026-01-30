import { useEffect } from 'react';
import { daoLinks } from '@config/dao-links';

export default function Chat() {
  useEffect(() => {
    window.location.href = daoLinks.DAO_SOCIAL_DISCORD;
  }, []);
  return null;
}
