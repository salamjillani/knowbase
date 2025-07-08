import { Button } from '@/components/ui/button';
import { useLanguage } from '@/hooks/useLanguage';
import { Link } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';

export const NotFound = () => {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="text-center">
        <AlertCircle className="h-12 w-12 sm:h-16 sm:w-16 text-red-500 mx-auto mb-4" />
        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">404 - {t('pageNotFound')}</h1>
        <p className="text-base sm:text-lg text-gray-600 mb-8">{t('pageNotFoundDesc')}</p>
        <Link to="/">
          <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2 sm:py-3">
            {t('backToHome')}
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;