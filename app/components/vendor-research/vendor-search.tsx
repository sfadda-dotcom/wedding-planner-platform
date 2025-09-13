

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
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
  ExternalLink,
  Phone,
  Mail,
  Globe,
  Instagram,
  Facebook,
  CheckCircle,
  AlertCircle,
  Loader2,
  Filter,
  SortAsc
} from 'lucide-react';
import { Vendor } from '@/lib/vendor-search-service';

const VENDOR_CATEGORIES = [
  { id: 'venue', label: 'Venues', icon: Building },
  { id: 'photographer', label: 'Photography', icon: Camera },
  { id: 'catering', label: 'Catering', icon: Utensils },
  { id: 'florist', label: 'Florals', icon: Flower },
  { id: 'music', label: 'Music & DJ', icon: Music },
  { id: 'decoration', label: 'Decorations', icon: Palette },
];

const BUDGET_RANGES = [
  'Under £1,000',
  '£1,000 - £2,500',
  '£2,500 - £5,000',
  '£5,000 - £10,000',
  'Over £10,000'
];

export function VendorSearch() {
  const [selectedCategory, setSelectedCategory] = useState('venue');
  const [searchLocation, setSearchLocation] = useState('');
  const [budgetRange, setBudgetRange] = useState('');
  const [guestCount, setGuestCount] = useState('');
  const [searchRadius, setSearchRadius] = useState('50');
  const [preferences, setPreferences] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [searchMetadata, setSearchMetadata] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async () => {
    if (!searchLocation.trim()) {
      setError('Please enter a location to search');
      return;
    }

    setIsSearching(true);
    setError(null);
    
    try {
      const response = await fetch('/api/vendor-search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          category: selectedCategory,
          location: searchLocation.trim(),
          budget_range: budgetRange,
          guest_count: guestCount,
          search_radius: parseInt(searchRadius),
          preferences: preferences.split(',').map(p => p.trim()).filter(p => p)
        }),
      });
      
      const data = await response.json();
      
      if (response.ok && data.success) {
        setVendors(data.vendors || []);
        setSearchMetadata(data.search_metadata);
        console.log(`Found ${data.vendors?.length || 0} vendors using AI search`);
      } else {
        throw new Error(data.error || 'Search failed');
      }
    } catch (error) {
      console.error('Search failed:', error);
      setError(error instanceof Error ? error.message : 'Search failed. Please try again.');
      setVendors([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleVendorContact = (vendor: Vendor, contactType: string) => {
    switch (contactType) {
      case 'phone':
        window.open(`tel:${vendor.phone}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:${vendor.email}?subject=Wedding Inquiry`, '_blank');
        break;
      case 'website':
        window.open(vendor.website, '_blank');
        break;
      case 'instagram':
        window.open(vendor.socialMedia?.instagram, '_blank');
        break;
      case 'facebook':
        window.open(vendor.socialMedia?.facebook, '_blank');
        break;
    }
  };

  const getPriceColor = (indicator: string) => {
    switch (indicator) {
      case '$': return 'bg-green-100 text-green-800';
      case '$$': return 'bg-blue-100 text-blue-800';
      case '$$$': return 'bg-yellow-100 text-yellow-800';
      case '$$$$': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Enhanced Search Header */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Search className="h-5 w-5 text-rose-500" />
            <span>AI-Powered Vendor Search</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Category *</label>
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
              <label className="text-sm font-medium text-gray-700">Location *</label>
              <Input
                value={searchLocation}
                onChange={(e) => setSearchLocation(e.target.value)}
                placeholder="City, region, or postcode"
                className="w-full"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Budget Range</label>
              <Select value={budgetRange} onValueChange={setBudgetRange}>
                <SelectTrigger>
                  <SelectValue placeholder="Select budget" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Any budget</SelectItem>
                  {BUDGET_RANGES.map((range) => (
                    <SelectItem key={range} value={range}>
                      {range}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Guest Count</label>
              <Input
                type="number"
                value={guestCount}
                onChange={(e) => setGuestCount(e.target.value)}
                placeholder="Number of guests"
                min="1"
              />
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Search Radius</label>
              <Select value={searchRadius} onValueChange={setSearchRadius}>
                <SelectTrigger>
                  <SelectValue placeholder="Search radius" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="25">25 km</SelectItem>
                  <SelectItem value="50">50 km</SelectItem>
                  <SelectItem value="100">100 km</SelectItem>
                  <SelectItem value="200">200 km</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">&nbsp;</label>
              <Button 
                onClick={handleSearch}
                disabled={isSearching || !searchLocation.trim()}
                className="w-full rose-gradient text-white"
              >
                {isSearching ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
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
          
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-700">Special Requirements (optional)</label>
              <Textarea
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                placeholder="e.g., outdoor ceremony, vegan options, live music, specific style..."
                className="resize-none"
                rows={2}
              />
            </div>
          
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start space-x-3">
                <div className="bg-gradient-to-r from-blue-500 to-purple-500 p-2 rounded-lg">
                  <Search className="h-5 w-5 text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 mb-1">AI-Powered Real-Time Search</p>
                  <p className="text-sm text-gray-700 mb-2">
                    Our advanced AI system searches multiple sources including Google Places, wedding platforms, 
                    and social media to find the perfect vendors for your special day.
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="secondary" className="text-xs">
                      <Globe className="h-3 w-3 mr-1" />
                      Web Scraping
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <Star className="h-3 w-3 mr-1" />
                      AI Ranking
                    </Badge>
                    <Badge variant="secondary" className="text-xs">
                      <CheckCircle className="h-3 w-3 mr-1" />
                      Real-time Data
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <p className="text-red-700 font-medium">{error}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Search Results Metadata */}
      {searchMetadata && (
        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-5 w-5 text-green-500" />
                <span className="font-medium text-green-800">
                  Found {searchMetadata.total_results} vendors
                </span>
              </div>
              <div className="flex space-x-2">
                {searchMetadata.sources?.map((source: string, index: number) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {source.replace('_', ' ')}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Vendor Results */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {vendors.length === 0 && !isSearching && (
          <div className="col-span-full">
            <Card className="border-2 border-dashed border-gray-300">
              <CardContent className="text-center py-12">
                <Search className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-medium text-gray-700 mb-2">Ready to Find Your Perfect Vendors</h3>
                <p className="text-gray-500 mb-4">
                  Enter your location and preferences above to discover amazing wedding vendors in your area
                </p>
                <div className="flex justify-center space-x-2">
                  <Badge variant="secondary">AI-Powered</Badge>
                  <Badge variant="secondary">Real-time Search</Badge>
                  <Badge variant="secondary">Global Coverage</Badge>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {vendors.map((vendor) => (
          <Card key={vendor.id} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
            <div className="relative aspect-video bg-gradient-to-br from-gray-200 via-gray-100 to-gray-200 overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-rose-500/20 to-pink-500/20 flex items-center justify-center">
                <Camera className="h-12 w-12 text-white/80" />
              </div>
              
              {/* Price and Verification Badges */}
              <div className="absolute top-3 right-3 flex flex-col space-y-1">
                <Badge className={`text-xs font-bold ${getPriceColor(vendor.priceIndicator)}`}>
                  {vendor.priceIndicator}
                </Badge>
                {vendor.verified && (
                  <Badge className="bg-green-100 text-green-800 text-xs">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>

              {/* Rating Badge */}
              <div className="absolute top-3 left-3">
                <Badge className="bg-white/90 text-gray-800">
                  <Star className="h-3 w-3 mr-1 text-yellow-400 fill-current" />
                  {vendor.rating}
                </Badge>
              </div>
            </div>
            
            <CardContent className="p-5">
              <div className="space-y-4">
                {/* Header */}
                <div>
                  <h3 className="font-bold text-lg text-gray-800 group-hover:text-rose-600 transition-colors mb-1">
                    {vendor.name}
                  </h3>
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4" />
                    <span>{vendor.location}</span>
                  </div>
                </div>
                
                {/* Description */}
                <p className="text-sm text-gray-700 line-clamp-2">{vendor.description}</p>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-xs text-gray-500">
                  <span>{vendor.reviewCount} reviews</span>
                  <span>Responds {vendor.responseTime}</span>
                </div>
                
                {/* Price Range */}
                <div className="flex items-center space-x-2">
                  <DollarSign className="h-4 w-4 text-gray-500" />
                  <span className="text-sm font-medium text-gray-700">{vendor.priceRange}</span>
                </div>
                
                {/* Features */}
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-1">
                    {vendor.features?.slice(0, 3).map((feature, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                    {vendor.features?.length > 3 && (
                      <Badge variant="secondary" className="text-xs">
                        +{vendor.features.length - 3} more
                      </Badge>
                    )}
                  </div>
                  
                  {/* Specialties */}
                  {vendor.specialties && vendor.specialties.length > 0 && (
                    <div className="flex flex-wrap gap-1">
                      {vendor.specialties.map((specialty, index) => (
                        <Badge key={index} variant="outline" className="text-xs text-rose-600 border-rose-200">
                          {specialty}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>
                
                {/* Contact Actions */}
                <div className="grid grid-cols-2 gap-2 pt-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    className="group-hover:bg-rose-50 group-hover:border-rose-300"
                    onClick={() => handleVendorContact(vendor, 'website')}
                  >
                    <Globe className="h-4 w-4 mr-2" />
                    Visit Website
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    size="sm"
                    className="group-hover:bg-rose-50 group-hover:border-rose-300"
                    onClick={() => handleVendorContact(vendor, 'email')}
                  >
                    <Mail className="h-4 w-4 mr-2" />
                    Email
                  </Button>
                </div>
                
                {/* Social Links */}
                {(vendor.socialMedia?.instagram || vendor.socialMedia?.facebook) && (
                  <div className="flex justify-center space-x-3 pt-2 border-t">
                    {vendor.socialMedia.instagram && (
                      <button
                        onClick={() => handleVendorContact(vendor, 'instagram')}
                        className="text-gray-400 hover:text-rose-500 transition-colors"
                      >
                        <Instagram className="h-4 w-4" />
                      </button>
                    )}
                    {vendor.socialMedia.facebook && (
                      <button
                        onClick={() => handleVendorContact(vendor, 'facebook')}
                        className="text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Facebook className="h-4 w-4" />
                      </button>
                    )}
                    {vendor.phone && (
                      <button
                        onClick={() => handleVendorContact(vendor, 'phone')}
                        className="text-gray-400 hover:text-green-500 transition-colors"
                      >
                        <Phone className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}

