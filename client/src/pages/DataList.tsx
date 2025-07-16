import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { PaymentModal } from "@/components/PaymentModal";
import { FAQ } from "@/components/FAQ";
import { LanguageSelector } from "@/components/LanguageSelector";
import { BulletinBoard } from "@/components/BulletinBoard";
import { AdCarousel } from "@/components/AdCarousel";
import { useConfig } from "@/hooks/useConfig";
import { Link } from "react-router-dom";
import {
  LogOut,
  Search,
  Coins,
  Crown,
  Shield,
  Users,
  Phone,
  Mail,
  MapPin,
  CreditCard,
  Car,
  Home,
  Building,
  Smartphone,
  Globe,
  FileText,
  MessageCircle,
  Banknote,
  HelpCircle,
  User,
  Lock,
  Database,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define proper types for search results
interface BaseSearchResult {
  id: number;
  name: string;
  type: string;
  source?: string;
  _id?: string;
}

interface PersonalInfoResult extends BaseSearchResult {
  email: string;
  phone: string;
  location: string;
}

interface LocationResult extends BaseSearchResult {
  address: string;
  coordinates: string;
}

interface CommunicationResult extends BaseSearchResult {
  email: string;
  phone: string;
  socialMedia: string;
}

interface PropertyResult extends BaseSearchResult {
  property: string;
  value: string;
}

type SearchResult =
  | PersonalInfoResult
  | LocationResult
  | CommunicationResult
  | PropertyResult;

interface Service {
  icon: any;
  nameKey: string;
  descKey: string;
  price: number;
}

interface ServiceCategory {
  title: string;
  services: Service[];
}

export const DataList = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { showBulletinBoard, showAdCarousel, showQueryPricing } = useConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState<
    "phoneNumber" | "qqNumber" | "idNumber" | "weChatID" | "weiboID" | "email"
  >("email");
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [currentView, setCurrentView] = useState<"dashboard" | "faq">("dashboard");
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeCategory, setActiveCategory] = useState("all");
  const [isSearching, setIsSearching] = useState(false);

  const categoryNavigation = [
    { id: "all", label: t("all") },
    { id: "other", label: t("otherEnquiries") },
    { id: "location", label: t("locationAddress") },
    { id: "property", label: t("propertyRelated") },
    { id: "identity", label: t("identityRelated") },
    { id: "communication", label: t("communicationRelated") },
  ];

  // Define services structure (you can populate this with your actual services)
  const services: ServiceCategory[] = [];

  // Filter services based on active category
  const filteredServices = services.filter((category) => {
    if (activeCategory === "all") return true;
    // Add your filtering logic here
    return true;
  });

  // Add the same renderResultField function like search information
  const renderResultField = (result: any, fieldNames: string[]) => {
    for (const field of fieldNames) {
      if (result[field]) {
        return result[field];
      }
    }
    return 'N/A';
  };

const handleSearch = async () => {
  if (!searchQuery.trim()) {
    alert('Please enter a search query');
    return;
  }
  
  setIsSearching(true);
  setSearchResults([]); // Clear previous results
  
  try {
    console.log('Searching for:', searchQuery, 'Type:', searchType);
    
    const response = await fetch('http://localhost:5000/api/search', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ 
        query: searchQuery.trim(), 
        type: searchType 
      })
    });
    
    const data = await response.json();
    
    console.log('Response status:', response.status);
    console.log('Response data:', data);
    
    if (!response.ok) {
      throw new Error(data.message || 'Search failed');
    }
    
    if (Array.isArray(data)) {
      setSearchResults(data);
      console.log('Search results set:', data.length, 'items');
    } else {
      console.error('Unexpected response format:', data);
      setSearchResults([]);
    }
    
  } catch (error) {
    console.error('Search error:', error);
    alert(`Search failed: ${error.message}`);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};

  if (currentView === "faq") {
    return <FAQ />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-blue-500" />
                <span className="text-lg sm:text-xl font-bold text-gray-800">KnowBase</span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              <Link to="/search-information">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-500 text-sm sm:text-base"
                >
                  {t("searchInformation") || "Search Information"}
                </Button>
              </Link>
              <Link to="/data-list">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-500 text-sm sm:text-base"
                >
                  {t("dataList") || "Data List"}
                </Button>
              </Link>
              <Link to="/hot-topics">
                <Button
                  variant="ghost"
                  className="text-gray-600 hover:text-blue-500 text-sm sm:text-base"
                >
                  {t("hotTopics") || "Hot Topics"}
                </Button>
              </Link>
              <LanguageSelector variant="blue" />
              <Badge className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm">
                {t("professionalService")}
              </Badge>
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-500 hover:text-blue-600 text-sm sm:text-base"
                onClick={() => setCurrentView("faq")}
              >
                <HelpCircle className="h-4 w-4 mr-1" />
                {t("faq")}
              </Button>
              <Card className="bg-blue-50 border-blue-200 px-3 py-1 sm:px-4 sm:py-2">
                <div className="flex items-center space-x-2">
                  <Coins className="h-4 w-4 text-blue-500" />
                  <span className="text-blue-800 font-medium text-sm sm:text-base">
                    {user?.points || 0} {t("points")}
                  </span>
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

      {/* Navigation */}
      <nav className="bg-blue-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap space-x-4 sm:space-x-8 py-3">
            {categoryNavigation.map((item) => (
              <button
                key={item.id}
                onClick={() => setActiveCategory(item.id)}
                className={`hover:text-blue-100 transition-colors text-sm sm:text-base ${
                  activeCategory === item.id
                    ? "text-blue-100 font-semibold border-b-2 border-blue-100"
                    : ""
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        </div>
      </nav>

      {/* Bulletin Board (Optional) */}
      {showBulletinBoard && <BulletinBoard />}

      {/* Ad Carousel (Optional) */}
      {showAdCarousel && <AdCarousel />}

      {/* Search Bar */}
      <div className="bg-gray-100 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={searchType === "phoneNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("phoneNumber")}
                  className={
                    searchType === "phoneNumber"
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  }
                >
                  Phone Number
                </Button>
                <Button
                  variant={searchType === "qqNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("qqNumber")}
                  className={
                    searchType === "qqNumber"
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  }
                >
                  QQ Number
                </Button>
                <Button
                  variant={searchType === "idNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("idNumber")}
                  className={
                    searchType === "idNumber"
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  }
                >
                  ID Number
                </Button>
                <Button
                  variant={searchType === "weChatID" ? "default" : "outline"}
                  onClick={() => setSearchType("weChatID")}
                  className={
                    searchType === "weChatID"
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  }
                >
                  WeChat ID
                </Button>
                <Button
                  variant={searchType === "weiboID" ? "default" : "outline"}
                  onClick={() => setSearchType("weiboID")}
                  className={
                    searchType === "weiboID"
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  }
                >
                  Weibo ID
                </Button>
                <Button
                  variant={searchType === "email" ? "default" : "outline"}
                  onClick={() => setSearchType("email")}
                  className={
                    searchType === "email"
                      ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm"
                      : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"
                  }
                >
                  Email
                </Button>
              </div>
              {showQueryPricing && (
                <Badge
                  variant="secondary"
                  className="bg-blue-100 text-blue-600 text-xs sm:text-sm"
                >
                  Cost: 1 Point per Search
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                placeholder={t("searchPlaceholder")}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-gray-300 text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 text-sm sm:text-base"
                onClick={handleSearch}
                disabled={isSearching}
              >
                <Search className="h-4 w-4 mr-2" />
                {isSearching ? "Searching..." : t("search")}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Search Results - Updated similarly to SearchInformation */}
      {searchResults.length > 0 && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
            {t("searchResults")} ({searchResults.length} {t("found")})
          </h3>
          <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {searchResults.map((result) => (
              <Card
                key={result._id || result.id}
                className="border border-gray-300 hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-2">
                    <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                      {renderResultField(result, ['姓名', '联系人', '企业名称', '产品名称', 'name'])}
                    </h4>
                    <Badge
                      variant="outline"
                      className="border-blue-200 text-blue-500 text-xs"
                    >
                      {result.source || result.type}
                    </Badge>
                  </div>
                  <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Mail className="h-3 w-3 mr-1" />
                      邮箱: {renderResultField(result, ['邮箱', 'email'])}
                    </div>
                    <div className="flex items-center">
                      <Phone className="h-3 w-3 mr-1" />
                      手机: {renderResultField(result, ['手机', '手机号', '联系方式', '电话', 'phone'])}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-3 w-3 mr-1" />
                      地址: {renderResultField(result, ['地址', '企业地址', '收货地址', 'address', 'location'])}
                    </div>
                    {/* Additional fields for other result types */}
                    {"socialMedia" in result && (
                      <div className="flex items-center">
                        <MessageCircle className="h-3 w-3 mr-1" />
                        {t("social")}: {result.socialMedia}
                      </div>
                    )}
                    {"property" in result && (
                      <div className="flex items-center">
                        <Building className="h-3 w-3 mr-1" />
                        {t("property")}: {result.property}
                      </div>
                    )}
                    {"coordinates" in result && (
                      <div className="flex items-center">
                        <MapPin className="h-3 w-3 mr-1" />
                        坐标: {result.coordinates}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}

      {/* Services Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        {filteredServices.map((category, categoryIndex) => (
          <div key={categoryIndex} className="mb-12">
            <div className="text-center mb-6">
              <h2 className="text-xl sm:text-2xl font-bold text-red-500 mb-2">
                {category.title}
              </h2>
              <div className="w-16 sm:w-24 h-1 bg-red-500 mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {category.services.map((service, index) => (
                <Card
                  key={index}
                  className="hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-blue-300"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3">
                      <div className="p-2 rounded-full bg-blue-50">
                        <service.icon className="h-5 w-5 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-gray-800 mb-1 text-sm sm:text-base leading-tight">
                          {t(service.nameKey)}
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-500 mb-3">
                          {t(service.descKey)}
                        </p>
                        <div className="flex items-center justify-between">
                          {showQueryPricing && (
                            <span className="text-red-500 font-bold text-base sm:text-lg">
                              ${service.price}
                            </span>
                          )}
                          <Button
                            size="sm"
                            className="bg-blue-500 hover:bg-blue-600 text-white text-xs sm:text-sm px-3 py-1"
                            onClick={() => setShowPaymentModal(true)}
                          >
                            {t("query")}
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {/* Special Call-to-Action Section */}
        <div className="bg-gradient-to-r from-red-500 to-orange-500 text-white rounded-lg p-6 sm:p-8 text-center mb-8">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">
            {t("investigateMistress")}
          </h2>
          <p className="text-base sm:text-lg mb-6">{t("investigateMistressDesc")}</p>
          <Button
            className="bg-white text-red-500 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-2 sm:py-3"
            onClick={() => setShowPaymentModal(true)}
          >
            {t("startInvestigation")}
          </Button>
        </div>

        {/* Find Someone Section */}
        <div className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg p-6 sm:p-8 text-center">
          <h2 className="text-xl sm:text-2xl font-bold mb-4">{t("findDebtCollector")}</h2>
          <p className="text-base sm:text-lg mb-6">{t("findDebtCollectorDesc")}</p>
          <Button
            className="bg-white text-purple-500 hover:bg-gray-100 font-semibold px-6 sm:px-8 py-2 sm:py-3"
            onClick={() => setShowPaymentModal(true)}
          >
            {t("contactService")}
          </Button>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">{t("footerText")}</p>
        </div>
      </footer>

      <PaymentModal
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
      />
    </div>
  );
};