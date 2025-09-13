
// Simple Wedding Recommendation Engine
// Using if/then logic for initial recommendations

export interface WeddingPreferences {
  budget: number;
  currency: string;
  guestCount: string;
  weddingLocation: string;
  weddingStyle?: string;
  culturalTraditions: string[];
  religiousTraditions: string[];
  plannedEvents: string[];
}

export interface Recommendation {
  id: string;
  type: 'venue' | 'photographer' | 'catering' | 'florist' | 'music' | 'decoration';
  title: string;
  description: string;
  estimatedCost: {
    min: number;
    max: number;
    currency: string;
  };
  priority: 'high' | 'medium' | 'low';
  reasons: string[];
  suggestedVendors?: string[];
}

export interface MoodboardSuggestion {
  style: string;
  colors: string[];
  themes: string[];
  elements: string[];
}

export class SimpleRecommendationEngine {
  
  static generateRecommendations(preferences: WeddingPreferences): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const budget = preferences.budget;
    const guestCount = this.parseGuestCount(preferences.guestCount);
    
    // Venue recommendations
    recommendations.push(...this.getVenueRecommendations(budget, guestCount, preferences));
    
    // Photography recommendations
    recommendations.push(...this.getPhotographyRecommendations(budget, preferences));
    
    // Catering recommendations
    recommendations.push(...this.getCateringRecommendations(budget, guestCount, preferences));
    
    // Florist recommendations
    recommendations.push(...this.getFloristRecommendations(budget, preferences));
    
    // Music recommendations
    recommendations.push(...this.getMusicRecommendations(budget, preferences));
    
    // Decoration recommendations
    recommendations.push(...this.getDecorationRecommendations(budget, preferences));
    
    return recommendations.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      return priorityOrder[b.priority] - priorityOrder[a.priority];
    });
  }
  
  static generateMoodboard(preferences: WeddingPreferences): MoodboardSuggestion {
    const { weddingStyle, culturalTraditions, religiousTraditions } = preferences;
    
    let colors: string[] = [];
    let themes: string[] = [];
    let elements: string[] = [];
    
    // Style-based recommendations
    if (weddingStyle?.toLowerCase().includes('rustic')) {
      colors = ['Warm Brown', 'Sage Green', 'Cream', 'Dusty Rose'];
      themes = ['Natural', 'Countryside', 'Vintage'];
      elements = ['Wood accents', 'Mason jars', 'Wildflowers', 'Burlap details'];
    } else if (weddingStyle?.toLowerCase().includes('modern')) {
      colors = ['White', 'Black', 'Gold', 'Silver'];
      themes = ['Minimalist', 'Contemporary', 'Elegant'];
      elements = ['Clean lines', 'Geometric shapes', 'Metallic accents', 'Orchids'];
    } else if (weddingStyle?.toLowerCase().includes('vintage')) {
      colors = ['Blush Pink', 'Ivory', 'Gold', 'Burgundy'];
      themes = ['Classic', 'Romantic', 'Timeless'];
      elements = ['Lace details', 'Antique furniture', 'Pearl accents', 'Roses'];
    } else if (weddingStyle?.toLowerCase().includes('garden')) {
      colors = ['Soft Pink', 'Lavender', 'White', 'Green'];
      themes = ['Natural', 'Fresh', 'Botanical'];
      elements = ['Fresh flowers', 'Greenery', 'Natural lighting', 'Outdoor elements'];
    } else {
      // Default elegant style
      colors = ['White', 'Ivory', 'Gold', 'Blush Pink'];
      themes = ['Elegant', 'Classic', 'Romantic'];
      elements = ['Fresh flowers', 'Candles', 'Elegant linens', 'Crystal accents'];
    }
    
    // Cultural influences
    if (culturalTraditions.includes('South Asian')) {
      colors.push('Rich Red', 'Gold', 'Orange');
      themes.push('Vibrant', 'Festive');
      elements.push('Marigolds', 'Rangoli patterns', 'Rich fabrics');
    }
    
    if (culturalTraditions.includes('African')) {
      colors.push('Earth tones', 'Vibrant Orange', 'Deep Red');
      themes.push('Cultural heritage', 'Earthy elegance');
      elements.push('African prints', 'Natural textures', 'Traditional patterns');
    }
    
    if (culturalTraditions.includes('Middle Eastern')) {
      colors.push('Deep Purple', 'Gold', 'Royal Blue');
      themes.push('Luxurious', 'Opulent');
      elements.push('Rich textiles', 'Intricate patterns', 'Golden details');
    }
    
    return {
      style: weddingStyle || 'Elegant Classic',
      colors: [...new Set(colors)], // Remove duplicates
      themes: [...new Set(themes)],
      elements: [...new Set(elements)]
    };
  }
  
  private static parseGuestCount(guestCount: string): number {
    if (guestCount.includes('1-50')) return 25;
    if (guestCount.includes('50-100')) return 75;
    if (guestCount.includes('100-150')) return 125;
    if (guestCount.includes('150-200')) return 175;
    if (guestCount.includes('200+')) return 250;
    return 100; // default
  }
  
  private static getVenueRecommendations(budget: number, guestCount: number, preferences: WeddingPreferences): Recommendation[] {
    const recommendations: Recommendation[] = [];
    const currency = preferences.currency;
    
    // Budget-based venue suggestions
    if (budget > 50000) {
      recommendations.push({
        id: 'venue-luxury',
        type: 'venue',
        title: 'Luxury Hotel or Historic Venue',
        description: 'Premium venues with full-service coordination and elegant settings',
        estimatedCost: {
          min: Math.round(budget * 0.4),
          max: Math.round(budget * 0.6),
          currency
        },
        priority: 'high',
        reasons: ['High budget allows for premium venues', 'Full-service coordination included'],
        suggestedVendors: ['Five-star hotels', 'Historic castles', 'Luxury estates']
      });
    } else if (budget > 25000) {
      recommendations.push({
        id: 'venue-mid-range',
        type: 'venue',
        title: 'Boutique Hotels or Event Halls',
        description: 'Beautiful mid-range venues with good amenities and flexibility',
        estimatedCost: {
          min: Math.round(budget * 0.35),
          max: Math.round(budget * 0.5),
          currency
        },
        priority: 'high',
        reasons: ['Good balance of quality and cost', 'Flexible packages available'],
        suggestedVendors: ['Boutique hotels', 'Event centers', 'Garden venues']
      });
    } else {
      recommendations.push({
        id: 'venue-budget',
        type: 'venue',
        title: 'Community Halls or Outdoor Venues',
        description: 'Budget-friendly venues that can be beautifully decorated',
        estimatedCost: {
          min: Math.round(budget * 0.2),
          max: Math.round(budget * 0.35),
          currency
        },
        priority: 'high',
        reasons: ['Cost-effective option', 'More budget for decorations and other elements'],
        suggestedVendors: ['Community centers', 'Public gardens', 'Beach locations']
      });
    }
    
    return recommendations;
  }
  
  private static getPhotographyRecommendations(budget: number, preferences: WeddingPreferences): Recommendation[] {
    const currency = preferences.currency;
    
    if (budget > 40000) {
      return [{
        id: 'photography-premium',
        type: 'photographer',
        title: 'Premium Wedding Photography Package',
        description: 'Award-winning photographers with full-day coverage and engagement shoot',
        estimatedCost: {
          min: Math.round(budget * 0.08),
          max: Math.round(budget * 0.15),
          currency
        },
        priority: 'high',
        reasons: ['Budget allows for top-tier photographers', 'Memories are priceless'],
        suggestedVendors: ['Award-winning photographers', 'Studio packages', 'Destination specialists']
      }];
    } else if (budget > 20000) {
      return [{
        id: 'photography-standard',
        type: 'photographer',
        title: 'Professional Wedding Photography',
        description: 'Experienced photographers with 6-8 hour coverage',
        estimatedCost: {
          min: Math.round(budget * 0.1),
          max: Math.round(budget * 0.18),
          currency
        },
        priority: 'high',
        reasons: ['Professional quality within budget', 'Good coverage duration'],
        suggestedVendors: ['Local wedding photographers', 'Photography studios', 'Freelance professionals']
      }];
    } else {
      return [{
        id: 'photography-budget',
        type: 'photographer',
        title: 'Emerging Photographer or Mini Package',
        description: 'Talented newer photographers or shorter coverage packages',
        estimatedCost: {
          min: Math.round(budget * 0.12),
          max: Math.round(budget * 0.2),
          currency
        },
        priority: 'medium',
        reasons: ['Cost-effective photography solution', 'Opportunity to work with emerging talent'],
        suggestedVendors: ['Photography students', 'New professionals', 'Mini packages']
      }];
    }
  }
  
  private static getCateringRecommendations(budget: number, guestCount: number, preferences: WeddingPreferences): Recommendation[] {
    const currency = preferences.currency;
    const costPerGuest = budget / guestCount;
    
    if (costPerGuest > 200) {
      return [{
        id: 'catering-premium',
        type: 'catering',
        title: 'Premium Catering with Multiple Courses',
        description: 'Gourmet dining experience with cocktail hour and premium service',
        estimatedCost: {
          min: Math.round(budget * 0.3),
          max: Math.round(budget * 0.4),
          currency
        },
        priority: 'high',
        reasons: ['Budget allows for premium dining experience', 'Multiple course options available'],
        suggestedVendors: ['High-end catering companies', 'Hotel catering services', 'Michelin-starred chefs']
      }];
    } else if (costPerGuest > 100) {
      return [{
        id: 'catering-standard',
        type: 'catering',
        title: 'Full-Service Catering',
        description: 'Professional catering with buffet or plated service',
        estimatedCost: {
          min: Math.round(budget * 0.25),
          max: Math.round(budget * 0.35),
          currency
        },
        priority: 'high',
        reasons: ['Good balance of quality and quantity', 'Professional service included'],
        suggestedVendors: ['Local catering companies', 'Restaurant catering', 'Event caterers']
      }];
    } else {
      return [{
        id: 'catering-budget',
        type: 'catering',
        title: 'Casual Catering or Family Style',
        description: 'Buffet-style or family-style serving with good quality food',
        estimatedCost: {
          min: Math.round(budget * 0.2),
          max: Math.round(budget * 0.3),
          currency
        },
        priority: 'medium',
        reasons: ['Cost-effective feeding solution', 'More relaxed dining atmosphere'],
        suggestedVendors: ['Casual catering services', 'Food trucks', 'Family restaurants']
      }];
    }
  }
  
  private static getFloristRecommendations(budget: number, preferences: WeddingPreferences): Recommendation[] {
    const currency = preferences.currency;
    
    return [{
      id: 'florist-recommendation',
      type: 'florist',
      title: 'Wedding Florals and Decorations',
      description: 'Bridal bouquet, ceremony and reception florals',
      estimatedCost: {
        min: Math.round(budget * 0.06),
        max: Math.round(budget * 0.1),
        currency
      },
      priority: 'medium',
      reasons: ['Essential for wedding atmosphere', 'Customizable to your style'],
      suggestedVendors: ['Local florists', 'Wedding floral specialists', 'Online flower services']
    }];
  }
  
  private static getMusicRecommendations(budget: number, preferences: WeddingPreferences): Recommendation[] {
    const currency = preferences.currency;
    
    if (budget > 30000) {
      return [{
        id: 'music-live-band',
        type: 'music',
        title: 'Live Wedding Band',
        description: 'Professional live music for ceremony and reception',
        estimatedCost: {
          min: Math.round(budget * 0.08),
          max: Math.round(budget * 0.12),
          currency
        },
        priority: 'medium',
        reasons: ['Budget supports live entertainment', 'Creates memorable atmosphere'],
        suggestedVendors: ['Wedding bands', 'Solo acoustic artists', 'String quartets']
      }];
    } else {
      return [{
        id: 'music-dj',
        type: 'music',
        title: 'Professional DJ Services',
        description: 'DJ with sound system and music for all wedding events',
        estimatedCost: {
          min: Math.round(budget * 0.05),
          max: Math.round(budget * 0.08),
          currency
        },
        priority: 'medium',
        reasons: ['Cost-effective entertainment solution', 'Wide variety of music options'],
        suggestedVendors: ['Wedding DJs', 'Event entertainment companies', 'Mobile DJs']
      }];
    }
  }
  
  private static getDecorationRecommendations(budget: number, preferences: WeddingPreferences): Recommendation[] {
    const currency = preferences.currency;
    
    return [{
      id: 'decoration-package',
      type: 'decoration',
      title: 'Wedding Decorations and Styling',
      description: 'Centerpieces, lighting, linens, and ambient decorations',
      estimatedCost: {
        min: Math.round(budget * 0.05),
        max: Math.round(budget * 0.1),
        currency
      },
      priority: 'medium',
      reasons: ['Essential for creating the right atmosphere', 'Customizable to your theme'],
      suggestedVendors: ['Event decorators', 'Party rental companies', 'Wedding stylists']
    }];
  }
}
