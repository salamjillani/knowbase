import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Search, Shield, Database, Zap, Lock, Users } from "lucide-react";
import { AuthModal } from "@/components/AuthModal";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { LanguageSelector } from "@/components/LanguageSelector";
import { Link } from "react-router-dom";
import { SearchInformation } from "./SearchInformation";

const Index = () => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');
  const { user, isAuthenticated } = useAuth();
  const { t } = useLanguage();

  if (isAuthenticated) {
    return <SearchInformation />;
  }

  const handleAuthClick = (mode: 'login' | 'register') => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 via-blue-100 to-indigo-100">
      {/* Header */}
      <header className="relative z-10 px-4 sm:px-6 lg:px-8 py-6 bg-white shadow-sm">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
            <span className="text-lg sm:text-2xl font-bold text-gray-800">KnowBase</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-4">
            <LanguageSelector variant="blue" />
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-blue-500 text-sm sm:text-base"
              onClick={() => handleAuthClick('login')}
            >
              {t('signIn')}
            </Button>
            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base"
              onClick={() => handleAuthClick('register')}
            >
              {t('getStarted')}
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 sm:mb-6 bg-blue-100 text-blue-600 border-blue-300 text-xs sm:text-sm">
            {t('professionalService')}
          </Badge>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-bold text-gray-800 mb-4 sm:mb-6 leading-tight">
            {t('advancedDatabase')}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-500 to-purple-500"> {t('querySystem')}</span>
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-6 sm:mb-8 max-w-3xl mx-auto">
            {t('professionalGrade')}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
              onClick={() => handleAuthClick('register')}
            >
              {t('startResearch')}
              <Search className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
            <Link to="/home">
              <Button
                size="lg"
                className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
              >
                {t('learnMore')}
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">{t('powerfulFeatures')}</h2>
            <p className="text-base sm:text-lg md:text-xl text-gray-600">{t('everythingYouNeed')}</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-8">
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <Database className="h-10 w-10 sm:h-12 sm:w-12 text-blue-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{t('comprehensiveDatabase')}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t('comprehensiveDatabaseDesc')}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <Zap className="h-10 w-10 sm:h-12 sm:w-12 text-yellow-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{t('lightningFast')}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t('lightningFastDesc')}</p>
              </CardContent>
            </Card>
            <Card className="bg-white border-gray-200 hover:shadow-lg transition-all duration-300">
              <CardContent className="p-6 sm:p-8 text-center">
                <Lock className="h-10 w-10 sm:h-12 sm:w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">{t('secureAccess')}</h3>
                <p className="text-sm sm:text-base text-gray-600">{t('secureAccessDesc')}</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 text-center">
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-blue-500 mb-2">100GB+</div>
              <div className="text-sm sm:text-base text-gray-600">{t('databaseSize')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-purple-500 mb-2">50M+</div>
              <div className="text-sm sm:text-base text-gray-600">{t('records')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-green-500 mb-2">99.9%</div>
              <div className="text-sm sm:text-base text-gray-600">{t('uptime')}</div>
            </div>
            <div>
              <div className="text-2xl sm:text-3xl md:text-4xl font-bold text-yellow-500 mb-2">24/7</div>
              <div className="text-sm sm:text-base text-gray-600">{t('support')}</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 py-12 sm:py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-6">{t('readyToStart')}</h2>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8">
            {t('joinSecurity')}
          </p>
          <Button
            size="lg"
            className="bg-blue-500 hover:bg-blue-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-sm sm:text-lg"
            onClick={() => handleAuthClick('register')}
          >
            {t('getInvitationCode')}
            <Users className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>
      </section>

      {/* Background Effects */}
      <div className="fixed inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-100/20 to-purple-100/20"></div>
        <div className="absolute top-1/4 left-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-blue-300/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-32 sm:w-64 h-32 sm:h-64 bg-purple-300/10 rounded-full blur-3xl"></div>
      </div>

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </div>
  );
};

export default Index;