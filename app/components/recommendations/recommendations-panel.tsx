
'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Sparkles, 
  MapPin, 
  Camera, 
  Utensils, 
  Music, 
  Flower,
  Palette,
  Heart,
  RefreshCw,
  TrendingUp,
  DollarSign
} from 'lucide-react';
import { toast } from 'sonner';
import type { Recommendation, MoodboardSuggestion } from '@/lib/recommendation-engine';

interface RecommendationsData {
  recommendations: Recommendation[];
  moodboard: MoodboardSuggestion;
  preferences: any;
}

const VENDOR_ICONS = {
  venue: MapPin,
  photographer: Camera,
  catering: Utensils,
  music: Music,
  florist: Flower,
  decoration: Palette
};

const PRIORITY_COLORS = {
  high: 'bg-red-100 text-red-800 border-red-200',
  medium: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  low: 'bg-green-100 text-green-800 border-green-200'
};

export function RecommendationsPanel() {
  const [data, setData] = useState<RecommendationsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchRecommendations = async () => {
    try {
      setRefreshing(true);
      const response = await fetch('/api/recommendations');
      
      if (!response.ok) {
        throw new Error('Failed to fetch recommendations');
      }
      
      const result = await response.json();
      setData(result);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      toast.error('Failed to load recommendations');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const formatCurrency = (amount: number, currency: string) => {
    const formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    });
    return formatter.format(amount);
  };

  if (loading) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <RefreshCw className="h-6 w-6 animate-spin text-rose-500" />
            <span className="ml-2 text-gray-600">Generating personalized recommendations...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return (
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span>AI Recommendations</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <p className="text-gray-600 mb-4">Unable to load recommendations</p>
            <Button onClick={fetchRecommendations} variant="outline">
              Try Again
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border-0 shadow-lg">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5 text-rose-500" />
            <span>AI Recommendations</span>
          </CardTitle>
          <Button 
            onClick={fetchRecommendations} 
            variant="outline" 
            size="sm"
            disabled={refreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="vendors" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="vendors">Vendor Recommendations</TabsTrigger>
            <TabsTrigger value="moodboard">Style & Moodboard</TabsTrigger>
          </TabsList>
          
          <TabsContent value="vendors" className="space-y-4">
            {data.recommendations.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">No recommendations available</p>
              </div>
            ) : (
              <div className="space-y-4">
                {data.recommendations.map((rec) => {
                  const IconComponent = VENDOR_ICONS[rec.type];
                  return (
                    <div key={rec.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div className="bg-rose-100 p-2 rounded-lg">
                            <IconComponent className="h-5 w-5 text-rose-600" />
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-800">{rec.title}</h4>
                            <p className="text-sm text-gray-600 capitalize">{rec.type}</p>
                          </div>
                        </div>
                        <Badge className={PRIORITY_COLORS[rec.priority]}>
                          {rec.priority} priority
                        </Badge>
                      </div>
                      
                      <p className="text-gray-700 mb-3">{rec.description}</p>
                      
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <DollarSign className="h-4 w-4" />
                          <span>
                            {formatCurrency(rec.estimatedCost.min, rec.estimatedCost.currency)} - {formatCurrency(rec.estimatedCost.max, rec.estimatedCost.currency)}
                          </span>
                        </div>
                      </div>
                      
                      {rec.reasons.length > 0 && (
                        <div className="mb-3">
                          <p className="text-sm font-medium text-gray-700 mb-1">Why this recommendation:</p>
                          <ul className="text-sm text-gray-600 space-y-1">
                            {rec.reasons.map((reason, index) => (
                              <li key={index} className="flex items-start space-x-2">
                                <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                                <span>{reason}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                      
                      {rec.suggestedVendors && rec.suggestedVendors.length > 0 && (
                        <div className="flex flex-wrap gap-2">
                          {rec.suggestedVendors.map((vendor, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {vendor}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="moodboard" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Wedding Style */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Heart className="h-5 w-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-800">Wedding Style</h4>
                </div>
                <p className="text-lg font-medium text-rose-600">{data.moodboard.style}</p>
              </div>
              
              {/* Color Palette */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Palette className="h-5 w-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-800">Color Palette</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.moodboard.colors.map((color, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {color}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Themes */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Sparkles className="h-5 w-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-800">Themes</h4>
                </div>
                <div className="flex flex-wrap gap-2">
                  {data.moodboard.themes.map((theme, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {theme}
                    </Badge>
                  ))}
                </div>
              </div>
              
              {/* Design Elements */}
              <div className="border border-gray-200 rounded-lg p-4">
                <div className="flex items-center space-x-2 mb-3">
                  <Flower className="h-5 w-5 text-rose-500" />
                  <h4 className="font-semibold text-gray-800">Design Elements</h4>
                </div>
                <div className="space-y-1">
                  {data.moodboard.elements.map((element, index) => (
                    <p key={index} className="text-sm text-gray-600">• {element}</p>
                  ))}
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
