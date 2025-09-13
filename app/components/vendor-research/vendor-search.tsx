
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  MapPin, 
  Camera, 
  Utensils, 
  Music, 
  Flower,
  Palette,
  Building,
  Clock,
  DollarSign,
  Star,
  ExternalLink
} from 'lucide-react';

const VENDOR_CATEGORIES = [
  { id: 'venue', label: 'Venues', icon: Building },
  { id: 'photographer', label: 'Photography', icon: Camera },
  { id: 'catering', label: 'Catering', icon: Utensils },
  { id: 'florist', label: 'Florals', icon: Flower },
  { id: 'music', label: 'Music & DJ', icon: Music },
  { id: 'decoration', label: 'Decorations', icon: Palette },
];

// Mock vendor data - in production this would come from n8n scraping or real API
const MOCK_VENDORS = {
  venue: [
    {
      id: 'venue-1',
      name: 'Grand Ballroom Hotel',
      location: 'London, UK',
      rating: 4.8,
      priceRange: '£££',
      image: '/api/placeholder/300/200',
      description: 'Elegant ballroom with stunning chandeliers and capacity for up to 200 guests.',
      features: ['Full catering', 'In-house coordinator', 'Parking available']
    },
    {
      id: 'venue-2', 
      name: 'Garden Manor Estate',
      location: 'Cotswolds, UK',
      rating: 4.9,
      priceRange: '££££',
      image: '/api/placeholder/300/200',
      description: 'Romantic countryside estate with beautiful gardens and historic architecture.',
      features: ['Outdoor ceremony', 'Accommodation available', 'Pet-friendly']
    }
  ],
  photographer: [
    {
      id: 'photo-1',
      name: 'Emma Thompson Photography',
      location: 'London, UK',
      rating: 4.9,
      priceRange: '£££',
      image: '/api/placeholder/300/200',
      description: 'Award-winning wedding photographer specializing in natural, candid moments.',
      features: ['8-hour coverage', 'Engagement shoot', 'Online gallery']
    }
  ],
  catering: [
    {
      id: 'cater-1',
      name: 'Gourmet Wedding Catering',
      location: 'Manchester, UK',
      rating: 4.7,
      priceRange: '£££',
      image: '/api/placeholder/300/200',
      description: 'Premium catering service with customizable menus for all dietary requirements.',
      features: ['Custom menus', 'Dietary accommodations', 'Service staff included']
    }
  ]
};

export function VendorSearch() {
  const [selectedCategory, setSelectedCategory] = useState('venue');
  const [searchLocation, setSearchLocation] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    setIsSearching(true);
    
    // Simulate API call - in production this would trigger n8n workflow
    setTimeout(() => {
      setIsSearching(false);
    }, 2000);
  };

  const triggerN8nSearch = async () => {
    // This would be the actual n8n webhook call
    try {
      const response = await fetch('/api/vendor-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          location: searchLocation,
          trigger_n8n: true
        }),
      });
      
      if (response.ok) {
        // Handle response from n8n
        console.log('N8N search triggered successfully');
      }
    } catch (error) {
      console.error('Failed to trigger n8n search:', error);
    }
  };

  const currentVendors = MOCK_VENDORS[selectedCategory as keyof typeof MOCK_VENDORS] || [];

  return (
    <div className="space-y-6">
      {/* Search Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-rose-500" />
            <span>Vendor Research</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category</label>
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {VENDOR_CATEGORIES.map((category) => {
                    const IconComponent = category.icon;
                    return (
                      <SelectItem key={category.id} value={category.id}>
                        <div className="flex items-center space-x-2">
                          <IconComponent className="h-4 w-4" />
                          <span>{category.label}</span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Location</label>
              <Input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="Enter city or region"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <Button 
                onClick={handleSearch}
                disabled={isSearching}
                className="w-full rose-gradient text-white"
              >
                {isSearching ? (
                  <>
                    <Clock className="h-4 w-4 mr-2 animate-spin" />
                    Searching...
                  </>
                ) : (
                  <>
                    <Search className="h-4 w-4 mr-2" />
                    Search Vendors
                  </>
                )}
              </Button>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start space-x-2">
              <div className="bg-blue-100 p-1 rounded">
                <ExternalLink className="h-4 w-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">Powered by Real-Time Search</p>
                <p className="text-sm text-blue-700">
                  Our system searches the web in real-time to find the best vendors in your area. 
                  Results are updated continuously to ensure fresh, accurate information.
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Vendor Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {currentVendors.length === 0 ? (
          <div className="col-span-full">
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="text-center py-8">
                <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-700 mb-2">No vendors found</h3>
                <p className="text-gray-500">Try searching in a different location or category</p>
              </CardContent>
            </Card>
          </div>
        ) : (
          currentVendors.map((vendor) => (
            <Card key={vendor.id} className="border-0 shadow-lg hover:shadow-xl transition-shadow group">
              <div className="relative aspect-video bg-gray-200 rounded-t-lg overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                  <Camera className="h-12 w-12 text-white/80" />
                </div>
                <Badge className="absolute top-2 right-2 bg-white text-gray-800">
                  {vendor.priceRange}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="font-semibold text-gray-800 group-hover:text-rose-600 transition-colors">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span className="text-sm font-medium">{vendor.rating}</span>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2 text-sm text-gray-600 mb-3">
                  <MapPin className="h-4 w-4" />
                  <span>{vendor.location}</span>
                </div>
                
                <p className="text-sm text-gray-700 mb-4">{vendor.description}</p>
                
                <div className="space-y-3">
                  <div className="flex flex-wrap gap-1">
                    {vendor.features.map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                  
                  <Button variant="outline" className="w-full group-hover:bg-rose-50 group-hover:border-rose-300">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
