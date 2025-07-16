import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useLanguage } from "@/hooks/useLanguage";
import { useConfig } from "@/hooks/useConfig";
import { BulletinBoard } from "@/components/BulletinBoard";
import { AdCarousel } from "@/components/AdCarousel";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LanguageSelector } from "@/components/LanguageSelector";
import {
  Search,
  Shield,
  Coins,
  Crown,
  Mail,
  Phone,
  MapPin,
  MessageCircle,
  Home,
  Building,
  LogOut,
  HelpCircle,
} from "lucide-react";

export const SearchInformation = () => {
  const { user, logout } = useAuth();
  const { t } = useLanguage();
  const { showBulletinBoard, showAdCarousel, showQueryPricing } = useConfig();
  const [searchQuery, setSearchQuery] = useState("");
  const [searchType, setSearchType] = useState("email");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!searchQuery.trim()) return;
    setIsSearching(true);
    
    try {
      const response = await fetch('http://localhost:5000/api/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ query: searchQuery, type: searchType })
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(data.message);
      
      setSearchResults(data);
    } catch (error) {
      toast({ title: 'Search Failed', description: error.message, variant: 'destructive' });
    } finally {
      setIsSearching(false);
    }
  };

    const renderResultField = (result, fieldNames) => {
    for (const field of fieldNames) {
      if (result[field]) {
        return result[field];
      }
    }
    return 'N/A';
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {t("searchInformation") || "Search Information"}
                </Button>
              </Link>
              <Link to="/data-list">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  {t("dataList") || "Data List"}
                </Button>
              </Link>
              <Link to="/hot-topics">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  {t("hotTopics") || "Hot Topics"}
                </Button>
              </Link>
              <Link to="/faq">
                <Button variant="ghost" className="text-gray-600 hover:text-blue-500 text-sm sm:text-base">
                  <HelpCircle className="h-4 w-4 mr-1" />
                  {t("faq")}
                </Button>
              </Link>
              <LanguageSelector variant="blue" />
              <Badge className="bg-red-500 text-white px-2 py-1 sm:px-3 sm:py-1 text-xs sm:text-sm">
                {t("professionalService")}
              </Badge>
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

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            Professional Database Query System
          </h1>
          <p className="text-base sm:text-lg md:text-xl text-gray-600 mb-8">
            Comprehensive data queries for security professionals
          </p>

          <div className="max-w-3xl mx-auto space-y-4">
            <div className="flex flex-col sm:flex-row justify-center items-center gap-2 sm:gap-4">
              <div className="flex flex-wrap gap-2">
                <Button
                  variant={searchType === "phoneNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("phoneNumber")}
                  className={searchType === "phoneNumber" ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm" : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"}
                >
                  Phone Number
                </Button>
                <Button
                  variant={searchType === "qqNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("qqNumber")}
                  className={searchType === "qqNumber" ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm" : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"}
                >
                  QQ Number
                </Button>
                <Button
                  variant={searchType === "idNumber" ? "default" : "outline"}
                  onClick={() => setSearchType("idNumber")}
                  className={searchType === "idNumber" ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm" : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"}
                >
                  ID Number
                </Button>
                <Button
                  variant={searchType === "weChatID" ? "default" : "outline"}
                  onClick={() => setSearchType("weChatID")}
                  className={searchType === "weChatID" ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm" : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"}
                >
                  WeChat ID
                </Button>
                <Button
                  variant={searchType === "email" ? "default" : "outline"}
                  onClick={() => setSearchType("email")}
                  className={searchType === "email" ? "bg-blue-500 hover:bg-blue-600 text-white border-blue-500 text-xs sm:text-sm" : "text-gray-600 border-gray-300 hover:bg-gray-50 text-xs sm:text-sm"}
                >
                  Email
                </Button>
              </div>
              {showQueryPricing && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-600 text-xs sm:text-sm">
                  Cost: 1 Point per Search
                </Badge>
              )}
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2">
              <Input
                placeholder="Enter search query"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-gray-300 text-sm sm:text-base"
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
              />
              <Button
                onClick={handleSearch}
                disabled={isSearching}
                className="bg-blue-500 hover:bg-blue-600 text-white px-4 sm:px-6 text-sm sm:text-base"
              >
                {isSearching ? "Searching..." : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    {t("search")}
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

          {searchResults.length > 0 && (
      <div className="mb-12">
        <h3 className="text-lg sm:text-xl font-bold text-gray-800 mb-4">
          {t("searchResults")} ({searchResults.length} {t("found")})
        </h3>
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {searchResults.map((result) => (
            <Card key={result._id} className="border border-gray-300 hover:shadow-md transition-shadow">
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-semibold text-gray-800 text-sm sm:text-base">
                    {renderResultField(result, ['姓名', '联系人', '企业名称', '产品名称'])}
                  </h4>
                  <Badge variant="outline" className="border-blue-200 text-blue-500 text-xs">
                    {result.source}
                  </Badge>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    <Mail className="h-3 w-3 mr-1" />
                    邮箱: {renderResultField(result, ['邮箱', 'email'])}
                  </div>
                  <div className="flex items-center">
                    <Phone className="h-3 w-3 mr-1" />
                    手机: {renderResultField(result, ['手机', '手机号', '联系方式', '电话'])}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="h-3 w-3 mr-1" />
                    地址: {renderResultField(result, ['地址', '企业地址', '收货地址'])}
                  </div>
                  {/* Add more fields as needed */}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    )}

        {showBulletinBoard && <BulletinBoard />}
        {showAdCarousel && <AdCarousel />}
      </main>

      <footer className="bg-gray-800 text-white py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-gray-400 text-sm sm:text-base">© 2025 KnowBase. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

function toast(arg0: { title: string; description: any; variant: string; }) {
  throw new Error("Function not implemented.");
}
