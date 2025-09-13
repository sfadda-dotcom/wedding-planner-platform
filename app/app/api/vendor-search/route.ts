

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { VendorSearchService, VendorSearchParams } from '@/lib/vendor-search-service';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { 
      category, 
      location, 
      budget_range, 
      guest_count,
      wedding_date,
      search_radius,
      preferences 
    } = body;

    // Validate required fields
    if (!category || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: category, location' }, 
        { status: 400 }
      );
    }

    // Prepare search parameters
    const searchParams: VendorSearchParams = {
      category,
      location,
      budgetRange: budget_range,
      guestCount: guest_count ? parseInt(guest_count) : undefined,
      date: wedding_date,
      radius: search_radius ? parseInt(search_radius) : 50,
      preferences: preferences || []
    };

    // Initialize the vendor search service
    const searchService = VendorSearchService.getInstance();
    
    // Perform the search
    console.log('Starting vendor search with params:', searchParams);
    const vendors = await searchService.searchVendors(searchParams);

    // Log search analytics
    const searchLog = {
      user_id: (session.user as any)?.id,
      timestamp: new Date().toISOString(),
      search_params: searchParams,
      results_count: vendors.length,
      search_type: 'automatic_ai_search'
    };

    console.log('Vendor search completed:', searchLog);

    return NextResponse.json({
      success: true,
      message: 'Vendor search completed successfully',
      search_id: `search_${Date.now()}`,
      vendors: vendors,
      search_metadata: {
        total_results: vendors.length,
        search_time: new Date().toISOString(),
        cache_used: false, // This would be determined by the service
        ai_ranking_applied: true,
        sources: ['google_places', 'wedding_platforms', 'social_media']
      }
    });

  } catch (error) {
    console.error('Error in vendor search API:', error);
    return NextResponse.json(
      { 
        error: 'Failed to search for vendors', 
        details: error instanceof Error ? error.message : 'Unknown error' 
      }, 
      { status: 500 }
    );
  }
}

// Enhanced GET endpoint for retrieving cached searches and search history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    switch (action) {
      case 'history':
        // Return user's search history (would be from database in production)
        return NextResponse.json({
          success: true,
          search_history: []
        });
      
      case 'categories':
        // Return available vendor categories
        return NextResponse.json({
          success: true,
          categories: [
            { id: 'venue', label: 'Venues', description: 'Wedding venues, halls, and event spaces' },
            { id: 'photographer', label: 'Photography', description: 'Wedding photographers and videographers' },
            { id: 'catering', label: 'Catering', description: 'Catering services and food providers' },
            { id: 'florist', label: 'Florals', description: 'Florists and floral designers' },
            { id: 'music', label: 'Music & Entertainment', description: 'DJs, bands, and entertainment' },
            { id: 'decoration', label: 'Decorations', description: 'Event decorators and styling services' }
          ]
        });
      
      default:
        return NextResponse.json({
          success: true,
          message: 'Vendor search API is ready',
          features: [
            'AI-powered vendor matching',
            'Real-time web scraping',
            'Multiple data sources',
            'Smart caching system',
            'Personalized recommendations'
          ]
        });
    }

  } catch (error) {
    console.error('Error in vendor search GET API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}

