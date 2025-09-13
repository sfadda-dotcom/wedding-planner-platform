

'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { 
  Sparkles, 
  MapPin, 
  Users, 
  Calendar,
  DollarSign,
  TrendingUp,
  Lightbulb,
  ArrowRight,
  Star,
  Clock,
  CheckCircle,
  AlertCircle,
  RefreshCw,
  Search
} from 'lucide-react';
import { VendorSearchService, Vendor } from '@/lib/vendor-search-service';

interface RecommendationData {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  reasoning: string;
  actionable_steps: string[];
  estimated_cost?: string;
  timeframe?: string;
  vendors?: Vendor[];
}

interface UserPreferences {
  location: string;
  guest_count: number;
  budget: number;
  date: string;
  style: string;
  priorities: string[];
}

export function RecommendationsPanel() {
  const { data: session } = useSession();
  const [recommendations, setRecommendations] = useState<RecommendationData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userPreferences, setUserPreferences] = useState<UserPreferences | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    if (session?.user) {
      loadRecommendations();
    }
  }, [session]);

  const loadRecommendations = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const response = await fetch('/api/recommendations');
      const data = await response.json();
      
      if (response.ok && data.success) {
        setRecommendations(data.recommendations || []);
        setUserPreferences(data.user_preferences);
      } else {
        throw new Error(data.error || 'Failed to load recommendations');
      }
    } catch (error) {
      console.error('Failed to load recommendations:', error);
      setError(error instanceof Error ? error.message : 'Failed to load recommendations');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshRecommendations = async () => {
    setRefreshing(true);
    await loadRecommendations();
    setRefreshing(false);
  };

  const handleVendorSearch = async (category: string) => {
    if (!userPreferences) return;
    
    try {
      const searchService = VendorSearchService.getInstance();
      const vendors = await searchService.searchVendors({
        category,
        location: userPreferences.location,
        budgetRange: getBudgetRange(userPreferences.budget),
        guestCount: userPreferences.guest_count,
        date: userPreferences.date
      });

      // Update the recommendation with vendor results
      setRecommendations(prev => 
        prev.map(rec => 
          rec.category === category 
            ? { ...rec, vendors: vendors.slice(0, 3) }
            : rec
        )
      );
    } catch (error) {
      console.error('Failed to search vendors for category:', category, error);
    }
  };

  const getBudgetRange = (budget: number): string => {
    if (budget < 1000) return 'Under £1,000';
    if (budget < 2500) return '£1,000 - £2,500';
    if (budget < 5000) return '£2,500 - £5,000';
    if (budget < 10000) return '£5,000 - £10,000';
    return 'Over £10,000';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-800 border-green-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return AlertCircle;
      case 'medium': return Clock;
      case 'low': return CheckCircle;
      default: return Lightbulb;
    }
  };

  if (isLoading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-red-200 bg-red-50">
        <CardContent className="p-6">
          <div className="text-center">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-red-800 mb-2">Unable to Load Recommendations</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <Button onClick={loadRecommendations} variant="outline" className="border-red-300 text-red-700">
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with User Context */}
      {userPreferences && (
        <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-rose-50">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Sparkles className="h-6 w-6 text-purple-500 mr-2" />
                Personalized Recommendations
              </h2>
              <Button 
                onClick={refreshRecommendations} 
                variant="outline" 
                size="sm"
                disabled={refreshing}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{userPreferences.location}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Users className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{userPreferences.guest_count} guests</span>
              </div>
              <div className="flex items-center space-x-2">
                <DollarSign className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">£{userPreferences.budget.toLocaleString()}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <span className="text-sm text-gray-700">{new Date(userPreferences.date).toLocaleDateString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recommendations */}
      <div className="space-y-4">
        {recommendations.length === 0 ? (
          <Card className="border-2 border-dashed border-gray-300">
            <CardContent className="text-center py-12">
              <Lightbulb className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-medium text-gray-700 mb-2">No Recommendations Yet</h3>
              <p className="text-gray-500 mb-4">
                Complete your wedding questionnaire to get personalized AI recommendations
              </p>
              <Button 
                onClick={() => window.location.href = '/questionnaire'} 
                className="rose-gradient text-white"
              >
                Complete Questionnaire
              </Button>
            </CardContent>
          </Card>
        ) : (
          recommendations.map((recommendation, index) => {
            const PriorityIcon = getPriorityIcon(recommendation.priority);
            
            return (
              <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-lg ${getPriorityColor(recommendation.priority)}`}>
                        <PriorityIcon className="h-5 w-5" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-bold text-gray-800">
                          {recommendation.title}
                        </CardTitle>
                        <Badge variant="outline" className="mt-1 capitalize">
                          {recommendation.category}
                        </Badge>
                      </div>
                    </div>
                    <Badge className={`${getPriorityColor(recommendation.priority)} capitalize`}>
                      {recommendation.priority} Priority
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-4">
                  <p className="text-gray-700">{recommendation.description}</p>
                  
                  {/* Reasoning */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                    <div className="flex items-center space-x-2 mb-2">
                      <TrendingUp className="h-4 w-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">Why This Matters</span>
                    </div>
                    <p className="text-sm text-blue-700">{recommendation.reasoning}</p>
                  </div>
                  
                  {/* Action Steps */}
                  {recommendation.actionable_steps.length > 0 && (
                    <div>
                      <h4 className="font-medium text-gray-800 mb-2 flex items-center">
                        <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                        Recommended Actions
                      </h4>
                      <ul className="space-y-1">
                        {recommendation.actionable_steps.map((step, stepIndex) => (
                          <li key={stepIndex} className="text-sm text-gray-600 flex items-start">
                            <ArrowRight className="h-3 w-3 text-gray-400 mt-1 mr-2 flex-shrink-0" />
                            <span>{step}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  
                  {/* Cost and Timeline */}
                  <div className="flex items-center justify-between text-sm text-gray-600">
                    {recommendation.estimated_cost && (
                      <div className="flex items-center space-x-1">
                        <DollarSign className="h-4 w-4" />
                        <span>{recommendation.estimated_cost}</span>
                      </div>
                    )}
                    {recommendation.timeframe && (
                      <div className="flex items-center space-x-1">
                        <Clock className="h-4 w-4" />
                        <span>{recommendation.timeframe}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Vendor Recommendations */}
                  {recommendation.vendors && recommendation.vendors.length > 0 ? (
                    <div className="space-y-3">
                      <Separator />
                      <div>
                        <h4 className="font-medium text-gray-800 mb-3 flex items-center">
                          <Star className="h-4 w-4 text-yellow-500 mr-2" />
                          Recommended Vendors
                        </h4>
                        <div className="grid gap-3">
                          {recommendation.vendors.map((vendor) => (
                            <div key={vendor.id} className="bg-gray-50 rounded-lg p-3">
                              <div className="flex items-center justify-between mb-2">
                                <h5 className="font-medium text-gray-800">{vendor.name}</h5>
                                <div className="flex items-center space-x-1">
                                  <Star className="h-3 w-3 text-yellow-400 fill-current" />
                                  <span className="text-xs text-gray-600">{vendor.rating}</span>
                                </div>
                              </div>
                              <p className="text-sm text-gray-600 mb-2">{vendor.location}</p>
                              <div className="flex items-center justify-between">
                                <span className="text-sm font-medium text-gray-700">{vendor.priceRange}</span>
                                <Button size="sm" variant="outline">
                                  View Details
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <Separator />
                      <Button 
                        onClick={() => handleVendorSearch(recommendation.category)}
                        className="w-full"
                        variant="outline"
                      >
                        <Search className="h-4 w-4 mr-2" />
                        Find {recommendation.category} Vendors
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })
        )}
      </div>
    </div>
  );
}

