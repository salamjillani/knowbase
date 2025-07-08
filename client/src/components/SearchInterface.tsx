import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { useConfig } from '@/hooks/useConfig';
import { useLanguage } from '@/hooks/useLanguage';
import {
  Search,
  Filter,
  Download,
  Eye,
  Mail,
  Phone,
  MapPin,
  Calendar,
  Loader2
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface SearchResult {
  id: string;
  email?: string;
  phone?: string;
  name?: string;
  address?: string;
  lastSeen?: string;
  source: string;
  confidence: number;
}

export const SearchInterface = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState<'email' | 'phone' | 'name' | 'mixed'>('email');
  const [isSearching, setIsSearching] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const { user, updatePoints } = useAuth();
  const { t } = useLanguage();
  const { showQueryPricing } = useConfig();

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a search query.',
        variant: 'destructive',
      });
      return;
    }

    if (user && user.points < 1) {
      toast({
        title: 'Insufficient Points',
        description: 'You need at least 1 point to perform a search.',
        variant: 'destructive',
      });
      return;
    }

    setIsSearching(true);

    try {
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockResults: SearchResult[] = [
        {
          id: '1',
          email: searchType === 'email' ? searchQuery : 'john.doe@example.com',
          phone: '+1234567890',
          name: 'John Doe',
          address: '123 Main St, City, State',
          lastSeen: '2024-01-15',
          source: 'Database Alpha',
          confidence: 85
        },
        {
          id: '2',
          email: 'jane.smith@example.com',
          phone: '+1987654321',
          name: 'Jane Smith',
          address: '456 Oak Ave, Town, State',
          lastSeen: '2024-01-10',
          source: 'Database Beta',
          confidence: 92
        }
      ];

      setResults(mockResults);
      setSearchHistory(prev => [searchQuery, ...prev.slice(0, 4)]);
      
      if (user) {
        updatePoints(user.points - 1);
      }

      toast({
        title: 'Search Complete',
        description: `Found ${mockResults.length} results. 1 point deducted.`,
      });

    } catch (error) {
      toast({
        title: 'Search Failed',
        description: 'Unable to complete search. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSearching(false);
    }
  };

  const exportResults = () => {
    const csvContent = results.map(result => 
      `${result.name},${result.email},${result.phone},${result.address},${result.lastSeen},${result.source},${result.confidence}`
    ).join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'search_results.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-4 sm:space-y-6 px-4 sm:px-6 lg:px-8">
      {/* Search Header */}
      <div className="flex flex-col sm:flex-row items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-2 sm:mb-0">Database Search</h2>
        {showQueryPricing && (
          <Badge variant="secondary" className="bg-blue-100 text-blue-500 text-xs sm:text-sm">
            Cost: 1 Point per Search
          </Badge>
        )}
      </div>

      {/* Search Form */}
      <Card className="bg-white border-gray-200">
        <CardHeader>
          <CardTitle className="text-gray-800 flex items-center text-lg sm:text-xl">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
            Advanced Search
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 sm:space-y-4">
          {/* Search Type Selection */}
          <div className="flex flex-wrap gap-2">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="border-gray-300 text-gray-600 text-sm sm:text-base">
                  {t(searchType.charAt(0).toUpperCase() + searchType.slice(1))}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => setSearchType('email')}>{t('email')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('phone')}>{t('phone')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('name')}>{t('name')}</DropdownMenuItem>
                <DropdownMenuItem onClick={() => setSearchType('mixed')}>{t('mixed')}</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Search Input */}
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
            <Textarea
              placeholder="Enter search query (email, phone, name, or multiple criteria)"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-white border-gray-200 text-gray-800 flex-1 text-sm sm:text-base"
              rows={3}
            />
          </div>

          {/* Search Button */}
          <Button
            onClick={handleSearch}
            disabled={isSearching || !user || user.points < 1}
            className="bg-blue-500 hover:bg-blue-600 text-white w-full text-sm sm:text-base py-2"
          >
            {isSearching && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isSearching ? 'Searching...' : 'Search Database'}
          </Button>
        </CardContent>
      </Card>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-gray-800 text-base sm:text-lg">Recent Searches</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {searchHistory.map((query, index) => (
                <Badge
                  key={index}
                  variant="secondary"
                  className="cursor-pointer bg-gray-100 text-gray-600 hover:bg-gray-200 text-xs sm:text-sm"
                  onClick={() => setSearchQuery(query)}
                >
                  {query}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results */}
      {results.length > 0 && (
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <div className="flex flex-col sm:flex-row items-center justify-between">
              <CardTitle className="text-gray-800 flex items-center text-base sm:text-lg">
                <Eye className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Search Results ({results.length})
              </CardTitle>
              <Button
                variant="outline"
                size="sm"
                onClick={exportResults}
                className="border-gray-300 text-gray-600 hover:bg-gray-100 mt-2 sm:mt-0 text-xs sm:text-sm"
              >
                <Download className="h-3 w-3 sm:h-4 sm:w-4 mr-2" />
                Export CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {results.map((result) => (
                <Card key={result.id} className="bg-white border-gray-200">
                  <CardContent className="p-3 sm:p-4">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-2 sm:mb-3">
                      <h3 className="text-gray-800 font-semibold text-sm sm:text-base">{result.name}</h3>
                      <div className="flex items-center space-x-2 mt-2 sm:mt-0">
                        <Badge 
                          variant="secondary" 
                          className={`${
                            result.confidence >= 90 ? 'bg-green-100 text-green-600' :
                            result.confidence >= 70 ? 'bg-yellow-100 text-yellow-600' :
                            'bg-red-100 text-red-600'
                          } text-xs sm:text-sm`}
                        >
                          {result.confidence}% Match
                        </Badge>
                        <Badge variant="outline" className="border-gray-300 text-gray-500 text-xs sm:text-sm">
                          {result.source}
                        </Badge>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        {result.email && (
                          <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm">
                            <Mail className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{result.email}</span>
                          </div>
                        )}
                        {result.phone && (
                          <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm">
                            <Phone className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{result.phone}</span>
                          </div>
                        )}
                      </div>
                      <div className="space-y-2">
                        {result.address && (
                          <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm">
                            <MapPin className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>{result.address}</span>
                          </div>
                        )}
                        {result.lastSeen && (
                          <div className="flex items-center space-x-2 text-gray-600 text-xs sm:text-sm">
                            <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span>Last seen: {result.lastSeen}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* No Results Message */}
      {!isSearching && results.length === 0 && searchQuery && (
        <Card className="bg-white border-gray-200">
          <CardContent className="text-center py-6 sm:py-8">
            <p className="text-gray-500 text-sm sm:text-base">No results found for your search query.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};