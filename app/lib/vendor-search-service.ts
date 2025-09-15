
import { getRealVendorsByCategory, RealVendorData } from './real-vendors-data';

export interface VendorSearchParams {
  category: string;
  location: string;
  budgetRange?: string;
  guestCount?: number;
  date?: string;
  radius?: number;
  preferences?: string[];
}

export interface Vendor {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  address?: string;
  phone?: string;
  website?: string;
  email?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  priceIndicator: '$' | '$$' | '$$$' | '$$$$';
  images: string[];
  features: string[];
  businessHours?: {
    [key: string]: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  verified: boolean;
  specialties?: string[];
  availability?: boolean;
  responseTime?: string;
  languages?: string[];
}

export class VendorSearchService {
  private static instance: VendorSearchService;
  private cache: Map<string, { data: Vendor[]; timestamp: number }> = new Map();
  private readonly CACHE_DURATION = 30 * 60 * 1000; // 30 minutes

  static getInstance(): VendorSearchService {
    if (!VendorSearchService.instance) {
      VendorSearchService.instance = new VendorSearchService();
    }
    return VendorSearchService.instance;
  }

  private getCacheKey(params: VendorSearchParams): string {
    const budgetKey = params.budgetRange && params.budgetRange !== 'any-budget' ? params.budgetRange : 'any';
    return `${params.category}-${params.location}-${budgetKey}-${params.radius || 50}`;
  }

  private isValidCache(cacheKey: string): boolean {
    const cached = this.cache.get(cacheKey);
    if (!cached) return false;
    return Date.now() - cached.timestamp < this.CACHE_DURATION;
  }

  async searchVendors(params: VendorSearchParams): Promise<Vendor[]> {
    const cacheKey = this.getCacheKey(params);
    
    // Check cache first
    if (this.isValidCache(cacheKey)) {
      const cached = this.cache.get(cacheKey);
      if (cached) return cached.data;
    }

    try {
      // Combine multiple search strategies
      const results = await Promise.allSettled([
        this.searchGooglePlaces(params),
        this.searchWeddingWebsites(params),
        this.searchSocialMedia(params)
      ]);

      // Merge and deduplicate results
      const allVendors: Vendor[] = [];
      results.forEach(result => {
        if (result.status === 'fulfilled' && result.value) {
          allVendors.push(...result.value);
        }
      });

      // Remove duplicates and apply intelligent filtering
      const uniqueVendors = await this.deduplicateAndRank(allVendors, params);
      
      // Cache the results
      this.cache.set(cacheKey, {
        data: uniqueVendors,
        timestamp: Date.now()
      });

      return uniqueVendors;
    } catch (error) {
      console.error('Error in vendor search:', error);
      throw new Error('Failed to search for vendors');
    }
  }

  private async searchGooglePlaces(params: VendorSearchParams): Promise<Vendor[]> {
    // Get real vendors first
    const realVendors = this.getRealVendorsForCategory(params);
    
    // Then generate additional simulated vendors to fill the results
    const categoryKeywords = {
      venue: ['wedding venue', 'event hall', 'banquet hall', 'hotel ballroom', 'country club', 'manor house'],
      photographer: ['wedding photographer', 'photography studio', 'wedding photography'],
      catering: ['wedding catering', 'catering service', 'event catering'],
      florist: ['wedding florist', 'flower shop', 'floral design'],
      music: ['wedding dj', 'wedding band', 'music entertainment'],
      decoration: ['wedding decorator', 'event decoration', 'party supplies']
    };

    const keywords = categoryKeywords[params.category as keyof typeof categoryKeywords] || [params.category];
    
    // Generate additional simulated vendors (but fewer since we have real ones)
    const simulatedVendors = this.generateRealisticVendors(params, keywords, 5); // Reduced number
    
    // Combine real vendors (first) with simulated vendors
    return [...realVendors, ...simulatedVendors];
  }

  private async searchWeddingWebsites(params: VendorSearchParams): Promise<Vendor[]> {
    // This would scrape popular wedding websites like The Knot, WeddingWire, etc.
    // For demonstration, we'll return category-specific results
    
    const weddingPlatformResults = await this.scrapeWeddingPlatforms(params);
    return weddingPlatformResults;
  }

  private async searchSocialMedia(params: VendorSearchParams): Promise<Vendor[]> {
    // This would search Instagram, Facebook business pages, etc.
    // For now, we'll return social media enhanced vendor data
    
    return this.getSocialMediaVendors(params);
  }

  private getRealVendorsForCategory(params: VendorSearchParams): Vendor[] {
    const realVendorsData = getRealVendorsByCategory(params.category);
    
    // Convert RealVendorData to Vendor interface and apply all filters
    return realVendorsData
      .filter(vendor => this.isVendorRelevantToLocation(vendor, params.location))
      .filter(vendor => this.isVendorInBudgetRange(vendor, params.budgetRange))
      .filter(vendor => this.isVendorSuitableForGuestCount(vendor, params.guestCount))
      .map(realVendor => this.convertRealVendorToVendor(realVendor));
  }

  private isVendorRelevantToLocation(vendor: RealVendorData, searchLocation: string): boolean {
    if (!searchLocation) return true;
    
    const searchLower = searchLocation.toLowerCase();
    const vendorLocationLower = vendor.location.toLowerCase();
    
    // Check if search location matches or is contained in vendor location
    return (
      vendorLocationLower.includes(searchLower) ||
      searchLower.includes(vendorLocationLower) ||
      this.areLocationsNearby(searchLower, vendorLocationLower)
    );
  }

  private areLocationsNearby(searchLocation: string, vendorLocation: string): boolean {
    // Define location proximity rules for major cities/regions globally
    const locationProximity = {
      // European regions
      'london': ['central london', 'west london', 'east london', 'north london', 'south london', 'greater london', 'england'],
      'manchester': ['greater manchester', 'northwest england', 'england'],
      'birmingham': ['west midlands', 'midlands', 'england'],
      'edinburgh': ['scotland'],
      'glasgow': ['scotland'],
      'cardiff': ['wales'],
      
      // US regions
      'new york': ['nyc', 'manhattan', 'brooklyn', 'queens', 'bronx', 'ny', 'new york city'],
      'los angeles': ['la', 'hollywood', 'beverly hills', 'santa monica', 'california', 'ca'],
      'chicago': ['illinois', 'il'],
      'miami': ['florida', 'fl'],
      'san francisco': ['sf', 'bay area', 'california', 'ca'],
      
      // Other major cities
      'paris': ['ile-de-france', 'france'],
      'rome': ['lazio', 'italy'],
      'barcelona': ['catalonia', 'spain'],
      'sydney': ['nsw', 'new south wales', 'australia'],
      'toronto': ['ontario', 'canada'],
      'vancouver': ['british columbia', 'canada']
    };

    for (const [city, nearby] of Object.entries(locationProximity)) {
      if (searchLocation.includes(city) && nearby.some(n => vendorLocation.includes(n))) {
        return true;
      }
      if (vendorLocation.includes(city) && nearby.some(n => searchLocation.includes(n))) {
        return true;
      }
    }
    
    return false;
  }

  private isVendorInBudgetRange(vendor: RealVendorData, budgetRange?: string): boolean {
    if (!budgetRange || budgetRange === 'any-budget') return true;
    
    // Convert vendor price range to comparable format
    const vendorPriceRange = vendor.priceRange.toLowerCase();
    const searchBudget = budgetRange.toLowerCase();
    
    // Extract numeric values for comparison
    const vendorMin = this.extractMinPrice(vendorPriceRange);
    const vendorMax = this.extractMaxPrice(vendorPriceRange);
    const searchMin = this.extractMinPrice(searchBudget);
    const searchMax = this.extractMaxPrice(searchBudget);
    
    // Check if there's any overlap between price ranges
    return vendorMax >= searchMin && vendorMin <= searchMax;
  }

  private isVendorSuitableForGuestCount(vendor: RealVendorData, guestCount?: number): boolean {
    if (!guestCount) return true;
    
    // For venues, check capacity suitability
    if (vendor.category === 'venue') {
      const features = vendor.features.join(' ').toLowerCase();
      
      // Large venues for big weddings
      if (guestCount > 200 && (
        features.includes('ballroom') || 
        features.includes('large capacity') ||
        features.includes('grand') ||
        vendor.priceIndicator === '$$$$'
      )) {
        return true;
      }
      
      // Medium venues for medium weddings
      if (guestCount >= 50 && guestCount <= 200 && (
        features.includes('hall') ||
        features.includes('reception') ||
        vendor.priceIndicator === '$$$' ||
        vendor.priceIndicator === '$$$$'
      )) {
        return true;
      }
      
      // Small venues for intimate weddings
      if (guestCount < 50 && (
        features.includes('intimate') ||
        features.includes('private dining') ||
        vendor.priceIndicator === '$' ||
        vendor.priceIndicator === '$$'
      )) {
        return true;
      }
      
      // Default: all venues are suitable unless clearly specified otherwise
      return true;
    }
    
    // For other categories, all vendors are suitable
    return true;
  }

  private extractMinPrice(priceRange: string): number {
    const match = priceRange.match(/£?(\d+(?:,\d+)?)/);
    return match ? parseInt(match[1].replace(',', '')) : 0;
  }

  private extractMaxPrice(priceRange: string): number {
    const matches = priceRange.match(/£?(\d+(?:,\d+)?)/g);
    if (matches && matches.length > 1) {
      return parseInt(matches[1].replace(/[£,]/g, ''));
    }
    if (priceRange.includes('over') || priceRange.includes('+')) {
      return 999999; // Very high number for "over X" ranges
    }
    const match = priceRange.match(/£?(\d+(?:,\d+)?)/);
    return match ? parseInt(match[1].replace(',', '')) * 2 : 999999; // Double the min for single value ranges
  }

  private convertRealVendorToVendor(realVendor: RealVendorData): Vendor {
    return {
      id: realVendor.id,
      name: realVendor.name,
      category: realVendor.category,
      description: realVendor.description,
      location: realVendor.location,
      address: realVendor.address,
      phone: realVendor.phone,
      website: realVendor.website,
      email: realVendor.email,
      rating: realVendor.rating,
      reviewCount: realVendor.reviewCount,
      priceRange: realVendor.priceRange,
      priceIndicator: realVendor.priceIndicator,
      images: realVendor.images,
      features: realVendor.features,
      businessHours: realVendor.businessHours,
      socialMedia: realVendor.socialMedia,
      verified: realVendor.verified,
      specialties: realVendor.specialties,
      availability: realVendor.availability,
      responseTime: realVendor.responseTime,
      languages: realVendor.languages
    };
  }

  private generateRealisticVendors(params: VendorSearchParams, keywords: string[], maxCount?: number): Vendor[] {
    const vendors: Vendor[] = [];
    const locations = this.getLocationVariations(params.location);
    
    // Generate fewer simulated vendors since we now have real ones
    const vendorCount = maxCount || Math.min(3, Math.floor(Math.random() * 3) + 1); // 1-3 vendors only
    
    for (let i = 0; i < vendorCount; i++) {
      const vendor = this.createRealisticVendor(params.category, locations, i);
      // Apply the same filters to simulated vendors
      if (this.isSimulatedVendorValid(vendor, params)) {
        vendors.push(vendor);
      }
    }
    
    return vendors;
  }

  private isSimulatedVendorValid(vendor: Vendor, params: VendorSearchParams): boolean {
    // Apply budget filter
    if (params.budgetRange && params.budgetRange !== 'any-budget') {
      const vendorMin = this.extractMinPrice(vendor.priceRange);
      const vendorMax = this.extractMaxPrice(vendor.priceRange);
      const searchMin = this.extractMinPrice(params.budgetRange);
      const searchMax = this.extractMaxPrice(params.budgetRange);
      
      if (vendorMax < searchMin || vendorMin > searchMax) {
        return false;
      }
    }
    
    // Apply guest count filter for venues
    if (params.guestCount && vendor.category === 'venue') {
      const features = vendor.features.join(' ').toLowerCase();
      
      if (params.guestCount > 200 && !(
        features.includes('ballroom') || 
        features.includes('large') ||
        vendor.priceIndicator === '$$$$'
      )) {
        return false;
      }
      
      if (params.guestCount < 50 && !(
        features.includes('intimate') ||
        vendor.priceIndicator === '$' ||
        vendor.priceIndicator === '$$'
      )) {
        return false;
      }
    }
    
    return true;
  }

  private createRealisticVendor(category: string, locations: string[], index: number): Vendor {
    const vendorNames = this.getVendorNames(category);
    const location = locations[Math.floor(Math.random() * locations.length)];
    
    return {
      id: `${category}-${Date.now()}-${index}`,
      name: vendorNames[Math.floor(Math.random() * vendorNames.length)],
      category,
      description: this.getVendorDescription(category),
      location,
      address: this.generateAddress(location),
      phone: this.generatePhoneNumber(),
      website: `https://${this.generateWebsite(category)}.com`,
      email: `info@${this.generateWebsite(category)}.com`,
      rating: Number((4.0 + Math.random() * 1.0).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 200) + 20,
      priceRange: this.generatePriceRange(),
      priceIndicator: this.generatePriceIndicator(),
      images: this.generateImageUrls(category, 3),
      features: this.getVendorFeatures(category),
      businessHours: this.generateBusinessHours(),
      socialMedia: {
        facebook: `https://facebook.com/${this.generateWebsite(category)}`,
        instagram: `https://instagram.com/${this.generateWebsite(category)}`,
      },
      verified: Math.random() > 0.3,
      specialties: this.getVendorSpecialties(category),
      availability: Math.random() > 0.2,
      responseTime: this.generateResponseTime(),
      languages: ['English', ...(Math.random() > 0.7 ? ['Spanish', 'French'] : [])]
    };
  }

  private getVendorNames(category: string): string[] {
    const names = {
      venue: ['Grand Ballroom', 'Rose Manor Estate', 'Crystal Palace Hotel', 'Garden View Hall', 'Riverside Manor', 'Golden Oak Country Club', 'The Victorian', 'Lakeside Lodge', 'Sunset Terrace', 'Ivy House'],
      photographer: ['Emma Stone Photography', 'Golden Hour Studios', 'Candid Moments', 'Perfect Day Photos', 'Artistic Vision Photography', 'Love Story Pictures', 'Timeless Memories', 'Modern Romance Photo', 'Classic Portraits', 'Dream Wedding Photos'],
      catering: ['Gourmet Wedding Catering', 'Elegant Eats', 'Fine Dining Catering', 'Culinary Delights', 'Artisan Kitchen', 'Premium Catering Co', 'Royal Feast Catering', 'Garden Fresh Catering', 'Signature Cuisine', 'Divine Dining'],
      florist: ['Bloom & Blossom', 'Petal Perfect Florist', 'Garden Dreams Floral', 'Rose & Lily Designs', 'Enchanted Flowers', 'Wildflower Wedding Co', 'Elegant Blooms', 'Floral Fantasy', 'Natural Beauty Flowers', 'Wedding Petals'],
      music: ['Harmony Wedding Band', 'Elite DJ Services', 'Music & Memories', 'Wedding Rhythms', 'Sound Perfection', 'Love Songs Entertainment', 'Premier Music Co', 'Melody Makers', 'Wedding Beats', 'Celebration Sounds'],
      decoration: ['Dream Wedding Decor', 'Elegant Events Design', 'Magical Moments Decor', 'Artistic Celebrations', 'Wedding Wonders', 'Perfect Setting Design', 'Romance & Style Decor', 'Enchanted Events', 'Luxe Wedding Design', 'Timeless Decorations']
    };
    return names[category as keyof typeof names] || ['Professional Wedding Services'];
  }

  private getVendorDescription(category: string): string {
    const descriptions = {
      venue: 'Stunning wedding venue with elegant architecture and beautiful surroundings. Perfect for intimate ceremonies and grand celebrations.',
      photographer: 'Professional wedding photographer specializing in capturing your most precious moments with artistic flair and attention to detail.',
      catering: 'Premium catering service offering exquisite cuisine and exceptional service for your special day.',
      florist: 'Creative floral designer creating beautiful arrangements that perfectly complement your wedding theme and style.',
      music: 'Professional wedding entertainment providing the perfect soundtrack for your celebration.',
      decoration: 'Expert wedding decorators transforming venues into magical spaces that reflect your unique style.'
    };
    return descriptions[category as keyof typeof descriptions] || 'Professional wedding service provider';
  }

  private getVendorFeatures(category: string): string[] {
    const features = {
      venue: ['On-site catering', 'Bridal suite', 'Parking available', 'Garden ceremony space', 'Indoor backup option', 'Dance floor', 'Full bar service'],
      photographer: ['8-hour coverage', 'Engagement shoot included', 'Online gallery', 'Same-day sneak peeks', 'Wedding album', 'USB with high-res images'],
      catering: ['Custom menu planning', 'Dietary accommodations', 'Professional service staff', 'Equipment rental', 'Tastings available', 'Late-night snacks'],
      florist: ['Bridal bouquet', 'Ceremony arrangements', 'Reception centerpieces', 'Boutonniere included', 'Setup service', 'Fresh seasonal flowers'],
      music: ['Professional sound system', 'Wireless microphones', 'LED lighting', 'Music requests', 'Ceremony music', 'Reception entertainment'],
      decoration: ['Theme consultation', 'Setup & breakdown', 'Centerpieces', 'Ceremony arch', 'Lighting design', 'Linens & tableware']
    };
    return features[category as keyof typeof features] || ['Professional service'];
  }

  private getVendorSpecialties(category: string): string[] {
    const specialties = {
      venue: ['Outdoor ceremonies', 'Historic venues', 'Garden weddings', 'Luxury events'],
      photographer: ['Natural light', 'Candid photography', 'Fine art', 'Documentary style'],
      catering: ['Italian cuisine', 'Vegan options', 'Buffet style', 'Plated dinners'],
      florist: ['Rustic arrangements', 'Modern designs', 'Tropical flowers', 'Seasonal bouquets'],
      music: ['Jazz band', 'Classical music', 'Modern pop', 'Cultural music'],
      decoration: ['Vintage style', 'Modern elegance', 'Bohemian', 'Classic romantic']
    };
    return specialties[category as keyof typeof specialties]?.slice(0, 2) || [];
  }

  private getLocationVariations(location: string): string[] {
    // Generate realistic location variations
    const baseLocations = [location];
    
    if (location.toLowerCase().includes('london')) {
      baseLocations.push('Central London', 'West London', 'East London', 'South London', 'North London');
    } else if (location.toLowerCase().includes('manchester')) {
      baseLocations.push('Greater Manchester', 'Manchester City Centre', 'Salford', 'Stockport');
    } else if (location.toLowerCase().includes('birmingham')) {
      baseLocations.push('Birmingham City Centre', 'West Midlands', 'Solihull');
    } else {
      // Generic variations
      baseLocations.push(`${location} City Centre`, `Greater ${location}`, `${location} Suburbs`);
    }
    
    return baseLocations;
  }

  private generateAddress(location: string): string {
    const streetNumbers = Math.floor(Math.random() * 999) + 1;
    const streetNames = ['High Street', 'Church Lane', 'Mill Road', 'Victoria Street', 'King\'s Road', 'Queen\'s Avenue', 'Park Lane', 'Oak Street'];
    const streetName = streetNames[Math.floor(Math.random() * streetNames.length)];
    return `${streetNumbers} ${streetName}, ${location}`;
  }

  private generatePhoneNumber(): string {
    return `+44 ${Math.floor(Math.random() * 9000) + 1000} ${Math.floor(Math.random() * 900000) + 100000}`;
  }

  private generateWebsite(category: string): string {
    const adjectives = ['elegant', 'perfect', 'divine', 'royal', 'premium', 'luxury'];
    const adjective = adjectives[Math.floor(Math.random() * adjectives.length)];
    return `${adjective}${category}${Math.floor(Math.random() * 100)}`;
  }

  private generatePriceRange(): string {
    const ranges = ['£500-£1,000', '£1,000-£2,500', '£2,500-£5,000', '£5,000-£10,000', '£10,000+'];
    return ranges[Math.floor(Math.random() * ranges.length)];
  }

  private generatePriceIndicator(): '$' | '$$' | '$$$' | '$$$$' {
    const indicators: ('$' | '$$' | '$$$' | '$$$$')[] = ['$', '$$', '$$$', '$$$$'];
    return indicators[Math.floor(Math.random() * indicators.length)];
  }

  private generateImageUrls(category: string, count: number): string[] {
    const images: string[] = [];
    for (let i = 0; i < count; i++) {
      images.push(`/api/placeholder/400/300?category=${category}&index=${i}`);
    }
    return images;
  }

  private generateBusinessHours(): { [key: string]: string } {
    return {
      'Monday': '9:00 AM - 5:00 PM',
      'Tuesday': '9:00 AM - 5:00 PM',
      'Wednesday': '9:00 AM - 5:00 PM',
      'Thursday': '9:00 AM - 5:00 PM',
      'Friday': '9:00 AM - 5:00 PM',
      'Saturday': '10:00 AM - 4:00 PM',
      'Sunday': 'By appointment only'
    };
  }

  private generateResponseTime(): string {
    const times = ['Within 1 hour', 'Within 2 hours', 'Within 4 hours', 'Within 24 hours', 'Within 2 days'];
    return times[Math.floor(Math.random() * times.length)];
  }

  private async scrapeWeddingPlatforms(params: VendorSearchParams): Promise<Vendor[]> {
    // This would implement scraping from wedding-specific websites
    // For now, return enhanced realistic data
    return this.generatePlatformSpecificVendors(params);
  }

  private generatePlatformSpecificVendors(params: VendorSearchParams): Vendor[] {
    // Simulate fewer vendors from wedding platforms since we have real vendors
    const vendors: Vendor[] = [];
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 vendors only
    
    for (let i = 0; i < count; i++) {
      const vendor = this.createRealisticVendor(params.category, [params.location], i);
      // Apply filters and enhance with platform-specific features
      if (this.isSimulatedVendorValid(vendor, params)) {
        vendor.verified = true;
        vendor.rating = Number((4.5 + Math.random() * 0.5).toFixed(1));
        vendor.reviewCount = Math.floor(Math.random() * 100) + 50;
        vendor.responseTime = 'Within 1 hour';
        vendors.push(vendor);
      }
    }
    
    return vendors;
  }

  private async getSocialMediaVendors(params: VendorSearchParams): Promise<Vendor[]> {
    // This would search social media for wedding vendors
    // For now, return vendors with strong social presence
    return this.generateSocialMediaEnhancedVendors(params);
  }

  private generateSocialMediaEnhancedVendors(params: VendorSearchParams): Vendor[] {
    const vendors: Vendor[] = [];
    const count = Math.floor(Math.random() * 2) + 1; // 1-2 vendors only
    
    for (let i = 0; i < count; i++) {
      const vendor = this.createRealisticVendor(params.category, [params.location], i);
      // Apply filters and add social media enhancements
      if (this.isSimulatedVendorValid(vendor, params)) {
        vendor.socialMedia = {
          facebook: `https://facebook.com/${vendor.name.replace(/\s+/g, '').toLowerCase()}`,
          instagram: `https://instagram.com/${vendor.name.replace(/\s+/g, '').toLowerCase()}`,
          twitter: `https://twitter.com/${vendor.name.replace(/\s+/g, '').toLowerCase()}`
        };
        vendor.images = this.generateImageUrls(params.category, 5); // More images from social
        vendors.push(vendor);
      }
    }
    
    return vendors;
  }

  private async deduplicateAndRank(vendors: Vendor[], params: VendorSearchParams): Promise<Vendor[]> {
    // Remove duplicates based on name and location similarity
    const unique = new Map<string, Vendor>();
    
    vendors.forEach(vendor => {
      const key = `${vendor.name.toLowerCase()}-${vendor.location.toLowerCase()}`;
      if (!unique.has(key) || vendor.rating > (unique.get(key)?.rating || 0)) {
        unique.set(key, vendor);
      }
    });
    
    const uniqueVendors = Array.from(unique.values());
    
    // Use AI to rank vendors based on user preferences
    return this.rankVendorsWithAI(uniqueVendors, params);
  }

  private async rankVendorsWithAI(vendors: Vendor[], params: VendorSearchParams): Promise<Vendor[]> {
    try {
      // Create a prompt for AI ranking
      const vendorSummaries = vendors.map(v => ({
        id: v.id,
        name: v.name,
        rating: v.rating,
        priceRange: v.priceRange,
        features: v.features.slice(0, 3),
        specialties: v.specialties
      }));

      const response = await fetch('https://apps.abacus.ai/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.ABACUSAI_API_KEY}`
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [{
            role: 'user',
            content: `Rank these wedding ${params.category} vendors for a couple getting married in ${params.location}. 
            Budget range: ${params.budgetRange && params.budgetRange !== 'any-budget' ? params.budgetRange : 'Not specified'}
            Guest count: ${params.guestCount || 'Not specified'}
            
            Vendors: ${JSON.stringify(vendorSummaries)}
            
            Please respond with just the vendor IDs in order of best fit, separated by commas.`
          }],
          max_tokens: 200,
        }),
      });

      if (response.ok) {
        const result = await response.json();
        const rankedIds = result.choices[0]?.message?.content?.split(',').map((id: string) => id.trim());
        
        if (rankedIds && rankedIds.length > 0) {
          // Reorder vendors based on AI ranking
          const rankedVendors: Vendor[] = [];
          const vendorMap = new Map(vendors.map(v => [v.id, v]));
          
          rankedIds.forEach((id: string) => {
            const vendor = vendorMap.get(id);
            if (vendor) {
              rankedVendors.push(vendor);
              vendorMap.delete(id);
            }
          });
          
          // Add any remaining vendors that weren't ranked
          rankedVendors.push(...Array.from(vendorMap.values()));
          
          return rankedVendors;
        }
      }
    } catch (error) {
      console.error('AI ranking failed, using default sorting:', error);
    }
    
    // Fallback: sort by rating and review count
    return vendors.sort((a, b) => {
      const scoreA = a.rating * Math.log(a.reviewCount + 1);
      const scoreB = b.rating * Math.log(b.reviewCount + 1);
      return scoreB - scoreA;
    });
  }
}

