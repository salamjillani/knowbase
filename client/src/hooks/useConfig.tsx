import { useState } from 'react';

export const useConfig = () => {
  const [showBulletinBoard, setShowBulletinBoard] = useState(true);
  const [showAdCarousel, setShowAdCarousel] = useState(true);
  const [showQueryPricing, setShowQueryPricing] = useState(true);

  return {
    showBulletinBoard,
    setShowBulletinBoard,
    showAdCarousel,
    setShowAdCarousel,
    showQueryPricing,
    setShowQueryPricing
  };
};