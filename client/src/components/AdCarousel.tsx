import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export const AdCarousel = () => {
  const { t } = useLanguage();
  const [currentAd, setCurrentAd] = useState(0);

  const ads = [
    {
      title: t('ad1Title') || 'Upgrade to VIP',
      content: t('ad1Content') || 'Unlock advanced search features and export options with our VIP plan!',
      cta: t('ad1CTA') || 'Learn More',
      link: '/pricing'
    },
    {
      title: t('ad2Title') || 'Invite Friends',
      content: t('ad2Content') || 'Earn bonus points by inviting your friends to join KnowBase.',
      cta: t('ad2CTA') || 'Invite Now',
      link: '/invite'
    },
    {
      title: t('ad3Title') || 'Secure Your Data',
      content: t('ad3Content') || 'Our platform uses industry-leading encryption to protect your searches.',
      cta: t('ad3CTA') || 'Explore Security',
      link: '/security'
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentAd((prev) => (prev + 1) % ads.length);
    }, 5000); // Rotate every 5 seconds
    return () => clearInterval(interval);
  }, [ads.length]);

  const handlePrev = () => {
    setCurrentAd((prev) => (prev - 1 + ads.length) % ads.length);
  };

  const handleNext = () => {
    setCurrentAd((prev) => (prev + 1) % ads.length);
  };

  return (
    <Card className="bg-blue-50 border-blue-200 mx-2 sm:mx-4 md:mx-6 lg:mx-8 my-4">
      <CardContent className="p-4 sm:p-6 relative">
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="icon"
            onClick={handlePrev}
            className="text-blue-500 hover:bg-blue-100 w-8 h-8 sm:w-10 sm:h-10"
          >
            <ChevronLeft className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
          <div className="flex-1 text-center px-2 sm:px-4">
            <h3 className="text-lg sm:text-xl md:text-2xl font-semibold text-blue-800">{ads[currentAd].title}</h3>
            <p className="text-blue-600 mt-2 text-sm sm:text-base">{ads[currentAd].content}</p>
            <Button
              className="mt-3 sm:mt-4 bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2"
              onClick={() => window.location.href = ads[currentAd].link}
            >
              {ads[currentAd].cta}
            </Button>
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleNext}
            className="text-blue-500 hover:bg-blue-100 w-8 h-8 sm:w-10 sm:h-10"
          >
            <ChevronRight className="h-5 w-5 sm:h-6 sm:w-6" />
          </Button>
        </div>
        <div className="flex justify-center mt-3 sm:mt-4">
          {ads.map((_, index) => (
            <div
              key={index}
              className={`h-2 w-2 sm:h-3 sm:w-3 rounded-full mx-1 transition-all duration-300 ${
                index === currentAd ? 'bg-blue-500' : 'bg-gray-300'
              }`}
            />
          ))}
        </div>
      </CardContent>
    
    </Card>
  );
};