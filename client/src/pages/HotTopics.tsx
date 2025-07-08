import { Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/hooks/useLanguage';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LanguageSelector } from '@/components/LanguageSelector';
import { Shield, Coins, Crown, LogOut, HelpCircle, TrendingUp } from 'lucide-react';

interface HotTopic {
  id: number;
  title: string;
  description: string;
  date: string;
  category: string;
}

export const HotTopics = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();

  const hotTopics: HotTopic[] = [
    {
      id: 1,
      title: 'Rising Demand for Real-Time Location Tracking',
      description: 'Explore how security researchers are increasingly using real-time location data to enhance their investigations.',
      date: '2025-05-20',
      category: 'Location',
    },
    {
      id: 2,
      title: 'New Background Query Features Unveiled',
      description: 'Our latest update introduces advanced background query tools for comprehensive personal data analysis.',
      date: '2025-05-18',
      category: 'Identity',
    },
    {
      id: 3,
      title: 'Top 5 Property Queries This Month',
      description: 'Discover the most popular property-related queries, including vehicle and real estate ownership searches.',
      date: '2025-05-15',
      category: 'Property',
    },
    {
      id: 4,
      title: 'Social Media Data: A New Frontier for Investigations',
      description: 'Learn how communication and social media queries are helping analysts uncover hidden connections.',
      date: '2025-05-10',
      category: 'Communication',
    },
    {
      id: 5,
      title: 'System Update: Enhanced Security Measures',
      description: 'We’ve upgraded our platform with new encryption protocols to ensure your data remains secure.',
      date: '2025-05-05',
      category: 'System Update',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
              <span className="text-lg sm:text-xl font-bold text-gray-800">KnowBase</span>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Link to="/search-information">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  {t('searchInformation') || 'Search Information'}
                </Button>
              </Link>
              <Link to="/data-list">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  {t('dataList') || 'Data List'}
                </Button>
              </Link>
              <Link to="/hot-topics">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  {t('hotTopics') || 'Hot Topics'}
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  {t('faq')}
                </Button>
              </Link>
              <LanguageSelector variant="blue" />
              <Badge className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm">
                {t('professionalService')}
              </Badge>
              <Card className="bg-blue-50 border-blue-200 px-3 py-1 sm:px-4 sm:py-2">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-800 font-medium text-sm sm:text-base">{user?.points || 0} {t('points')}</span>
                </div>
              </Card>
              {user?.isVip && (
                <Badge className="bg-yellow-500 text-white text-xs sm:text-sm">
                  <Crown className="h-3 w-3 mr-1" />
                  VIP
                </Badge>
              )}
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-600 hover:text-blue-500"
                onClick={logout}
              >
                <LogOut className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4 flex items-center justify-center">
            <TrendingUp className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500 mr-2" />
            {t('hotTopics') || 'Hot Topics'}
          </h1>
          <p className="text-base sm:text-lg text-gray-600">
            Stay updated with the latest trends and insights in database querying.
          </p>
        </div>

        {/* Hot Topics List */}
        <div className="space-y-6">
          {hotTopics.map((topic) => (
            <Card key={topic.id} className="border border-gray-200 hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="text-lg sm:text-xl font-semibold text-gray-800">{topic.title}</CardTitle>
                  <Badge variant="outline" className="border-blue-200 text-blue-500 text-xs sm:text-sm">
                    {topic.category}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm sm:text-base mb-4">{topic.description}</p>
                <div className="flex items-center justify-between">
                  <span className="text-xs sm:text-sm text-gray-500">{topic.date}</span>
                  <Button
                    variant="outline"
                    size="sm"
                    className="text-blue-500 hover:bg-blue-50 text-xs sm:text-sm"
                    onClick={() => alert(`Learn more about ${topic.title}`)}
                  >
                    Learn More
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">{t('footerText')}</p>
        </div>
      </footer>
    </div>
  );
};