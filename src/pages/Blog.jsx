import { useEffect } from 'react';
import { daoLinks } from '@config/dao-links';

export default function Blog() {
  useEffect(() => {
    window.location.href = daoLinks.DAO_BLOG;
  }, []);
  return null;
}
