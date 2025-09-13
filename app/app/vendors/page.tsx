
'use client';

import { motion } from 'framer-motion';
import { Search, MapPin, Star, Phone, Mail, Globe, Filter } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { useState } from 'react';

export default function VendorsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState('all');

  const vendorCategories = [
    { id: 'venues', name: 'Venues', icon: '🏛️', description: 'Wedding venues and reception halls' },
    { id: 'photography', name: 'Photography', icon: '📸', description: 'Wedding photographers and videographers' },
    { id: 'catering', name: 'Catering', icon: '🍽️', description: 'Food and beverage services' },
    { id: 'flowers', name: 'Flowers & Decor', icon: '🌸', description: 'Florists and decoration services' },
    { id: 'music', name: 'Music & Entertainment', icon: '🎵', description: 'DJs, bands, and entertainment' },
    { id: 'transport', name: 'Transportation', icon: '🚗', description: 'Wedding transport services' },
    { id: 'beauty', name: 'Beauty & Wellness', icon: '✨', description: 'Hair, makeup, and spa services' },
    { id: 'fashion', name: 'Fashion & Attire', icon: '👗', description: 'Bridal wear and formal attire' },
    { id: 'stationery', name: 'Stationery', icon: '💌', description: 'Invitations and wedding stationery' },
    { id: 'cakes', name: 'Cakes & Desserts', icon: '🎂', description: 'Wedding cakes and dessert services' },
  ];

  const ukLocations = [
    'London', 'Manchester', 'Birmingham', 'Liverpool', 'Edinburgh', 
    'Glasgow', 'Cardiff', 'Bristol', 'Leeds', 'Sheffield'
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-yellow-50">
      <DashboardHeader user={{ name: 'Wedding Planner' }} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Wedding <span className="text-orange-600">Vendor</span> Directory
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Discover trusted wedding vendors across the UK for your special day
            </p>
          </div>

          {/* Search and Filters */}
          <Card className="wedding-card mb-8">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <div className="relative">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <Input
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      placeholder="Search vendors by name or service..."
                      className="pl-10 h-12"
                    />
                  </div>
                </div>

                <div>
                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {vendorCategories?.map((category) => (
                        <SelectItem key={category?.id} value={category?.id}>
                          {category?.icon} {category?.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All UK</SelectItem>
                      {ukLocations?.map((location) => (
                        <SelectItem key={location} value={location?.toLowerCase()}>
                          {location}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
            {vendorCategories?.map((category, index) => (
              <motion.div
                key={category?.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.05 }}
              >
                <Card className="wedding-card hover:border-orange-200 group cursor-pointer">
                  <CardHeader className="text-center pb-3">
                    <div className="text-4xl mb-2">{category?.icon}</div>
                    <CardTitle className="text-lg group-hover:text-orange-600 transition-colors">
                      {category?.name}
                    </CardTitle>
                    <CardDescription className="text-sm">
                      {category?.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="pt-0 text-center">
                    <Badge variant="secondary" className="text-xs">
                      Coming Soon
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Integration Notice */}
          <Card className="wedding-card border-2 border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-400 to-amber-500 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="h-10 w-10 text-white" />
              </div>
              
              <h2 className="text-2xl font-display font-bold text-gray-800 mb-4">
                Vendor Discovery Coming Soon
              </h2>
              
              <p className="text-gray-600 max-w-2xl mx-auto mb-6">
                We're building an intelligent vendor discovery system that will connect you with the perfect 
                wedding professionals across the UK. Our AI-powered matching will consider your budget, 
                location, style preferences, and special requirements.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto mb-6">
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <MapPin className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 mb-1">Location-Based</h3>
                  <p className="text-sm text-gray-600">Find vendors near your venue</p>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Star className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 mb-1">Verified Reviews</h3>
                  <p className="text-sm text-gray-600">Real feedback from couples</p>
                </div>
                
                <div className="text-center p-4 bg-white/50 rounded-lg">
                  <Filter className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <h3 className="font-semibold text-gray-800 mb-1">Smart Matching</h3>
                  <p className="text-sm text-gray-600">AI-powered recommendations</p>
                </div>
              </div>

              <div className="space-y-3">
                <p className="text-sm text-gray-600">
                  In the meantime, you can still plan your perfect wedding with our other tools:
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  <Button variant="outline" size="sm" asChild>
                    <a href="/budget">Budget Planner</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/timeline">Timeline & Tasks</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/checklist">Planning Checklist</a>
                  </Button>
                  <Button variant="outline" size="sm" asChild>
                    <a href="/templates">Templates</a>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
