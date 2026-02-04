import React, { useEffect, useState } from 'react';
import Lottie from 'lottie-react';

const PricingAstronaut: React.FC = () => {
  const [animationData, setAnimationData] = useState<object | null>(null);

  useEffect(() => {
    let isMounted = true;
    fetch('/astronot.json')
      .then((res) => res.json())
      .then((data) => {
        if (isMounted) setAnimationData(data);
      })
      .catch(() => {
        if (isMounted) setAnimationData(null);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <div className="w-full h-[420px] md:h-[520px] flex items-center justify-center">
      {animationData ? (
        <Lottie animationData={animationData} loop autoplay />
      ) : (
        <div className="text-sm text-gray-400">Loading animation...</div>
      )}
    </div>
  );
};

export default PricingAstronaut;
