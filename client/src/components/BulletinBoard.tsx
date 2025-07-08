import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/hooks/useLanguage';
import { Megaphone } from 'lucide-react';

export const BulletinBoard = () => {
  const { t } = useLanguage();

  const announcements = [
    {
      title: t('announcement1') || 'New Feature Release!',
      content: t('announcement1Content') || 'We have added advanced search filters and export options for VIP users.',
      date: '2025-05-20'
    },
    {
      title: t('announcement2') || 'System Maintenance',
      content: t('announcement2Content') || 'Scheduled maintenance on May 30, 2025, from 2 AM to 4 AM UTC.',
      date: '2025-05-18'
    },
    {
      title: t('announcement3') || 'VIP Discount Offer',
      content: t('announcement3Content') || 'Get 20% off on VIP Pack purchases until June 1, 2025!',
      date: '2025-05-15'
    }
  ];

  return (
    <Card className="bg-white border-gray-200 mx-2 sm:mx-4 md:mx-6 lg:mx-8 my-4">
      <CardHeader>
        <CardTitle className="text-gray-800 flex items-center text-lg sm:text-xl">
          <Megaphone className="h-4 w-4 sm:h-5 sm:w-5 mr-2 text-blue-500" />
          {t('bulletinBoard') || 'Announcements'}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex overflow-x-auto space-x-4 pb-2 sm:pb-4 snap-x snap-mandatory" style={{ scrollbarWidth: 'thin', scrollbarColor: '#888 #f1f1f1' }}>
          {announcements.map((announcement, index) => (
            <div key={index} className="min-w-[250px] sm:min-w-[300px] p-3 sm:p-4 bg-gray-50 border border-gray-200 rounded-lg flex-shrink-0 snap-center">
              <h3 className="text-base sm:text-lg font-semibold text-gray-800">{announcement.title}</h3>
              <p className="text-gray-600 text-xs sm:text-sm mt-2">{announcement.content}</p>
              <p className="text-xs sm:text-sm text-gray-500 mt-1">{announcement.date}</p>
            </div>
          ))}
        </div>
      </CardContent>
   
    </Card>
  );
};