import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';
import { useLanguage } from '@/hooks/useLanguage';

interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ = () => {
  const [expandedIndex, setExpandedIndex] = useState<number | null>(null);
  const { t } = useLanguage();

  const faqItems: FAQItem[] = [
    {
      question: t('faqQuestion1') || "What is a social engineering database query system?",
      answer: t('faqAnswer1') || "A social engineering database query system is a tool used by cybersecurity professionals to search for publicly available information that might be used in social engineering attacks. It helps identify potential security vulnerabilities and educate users about privacy risks."
    },
    {
      question: t('faqQuestion2') || "How do I earn points to use the system?",
      answer: t('faqAnswer2') || "You can earn points by purchasing them through our USDT payment system, or by receiving invitation rewards when you successfully invite new users to the platform."
    },
    {
      question: t('faqQuestion3') || "What types of information can I search for?",
      answer: t('faqAnswer3') || "Our system allows you to search for various types of publicly available information including email addresses, phone numbers, usernames, and associated data from public breaches and leaks."
    },
    {
      question: t('faqQuestion4') || "Is this system legal to use?",
      answer: t('faqAnswer4') || "Yes, our system only provides access to publicly available information and is intended for legitimate cybersecurity research, penetration testing, and educational purposes. Users must comply with local laws and regulations."
    },
    {
      question: t('faqQuestion5') || "How much do queries cost?",
      answer: t('faqAnswer5') || "Query costs vary depending on the type and complexity of the search. Basic queries typically cost 1-5 points, while comprehensive searches may cost 10-20 points."
    },
    {
      question: t('faqQuestion6') || "Can I export my search results?",
      answer: t('faqAnswer6') || "Yes, VIP users can export their search results in various formats including CSV and JSON for further analysis and reporting."
    },
    {
      question: t('faqQuestion7') || "What is the invitation system?",
      answer: t('faqAnswer7') || "Our invitation system allows existing users to invite new members to the platform. Both the inviter and invitee receive bonus points when the invitation is successfully used."
    },
    {
      question: t('faqQuestion8') || "How secure is my data on this platform?",
      answer: t('faqAnswer8') || "We implement industry-standard security measures including encryption, secure authentication, and regular security audits to protect user data and queries."
    },
    {
      question: t('faqQuestion9') || "What payment methods do you accept?",
      answer: t('faqAnswer9') || "We currently accept USDT (Tether) payments for purchasing points. This ensures fast, secure, and anonymous transactions."
    },
    {
      question: t('faqQuestion10') || "Can I use the API for automated queries?",
      answer: t('faqAnswer10') || "Yes, VIP users have access to our API endpoints for automated querying. API access requires special permissions and additional security verification."
    }
  ];

  const toggleExpanded = (index: number) => {
    setExpandedIndex(expandedIndex === index ? null : index);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-full sm:max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-3 sm:mb-4">Frequently Asked Questions</h1>
          <p className="text-gray-600 text-sm sm:text-base">Find answers to common questions about our social engineering database query system</p>
        </div>

        <div className="space-y-3 sm:space-y-4">
          {faqItems.map((item, index) => (
            <Card key={index} className="border border-gray-200">
              <CardHeader className="pb-2 sm:pb-3">
                <Button
                  variant="ghost"
                  className="w-full justify-between text-left p-0 h-auto"
                  onClick={() => toggleExpanded(index)}
                >
                  <CardTitle className="text-base sm:text-lg font-medium text-gray-800">
                    {item.question}
                  </CardTitle>
                  {expandedIndex === index ? (
                    <ChevronUp className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-4 w-4 sm:h-5 sm:w-5 text-gray-500" />
                  )}
                </Button>
              </CardHeader>
              {expandedIndex === index && (
                <CardContent className="pt-0">
                  <p className="text-gray-600 text-sm sm:text-base leading-relaxed">{item.answer}</p>
                </CardContent>
              )}
            </Card>
          ))}
        </div>

        <div className="mt-8 sm:mt-12 text-center">
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-semibold text-blue-800 mb-2">Still have questions?</h3>
              <p className="text-blue-600 text-sm sm:text-base mb-3 sm:mb-4">Contact our support team for additional assistance</p>
              <Button className="bg-blue-500 hover:bg-blue-600 text-white text-sm sm:text-base px-4 sm:px-6 py-2">
                Contact Support
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};