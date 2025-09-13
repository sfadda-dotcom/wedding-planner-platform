
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';
import { SimpleRecommendationEngine } from '@/lib/recommendation-engine';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    
    // Get user's wedding details
    const weddingDetails = await prisma.weddingDetails.findUnique({
      where: { userId: userId },
    });

    if (!weddingDetails) {
      return NextResponse.json(
        { error: 'Please complete the wedding questionnaire first' }, 
        { status: 400 }
      );
    }

    // Convert wedding details to preferences format
    const preferences = {
      budget: Number(weddingDetails.budget) || 20000,
      currency: weddingDetails.currency,
      guestCount: weddingDetails.guestCount,
      weddingLocation: weddingDetails.weddingLocation || '',
      weddingStyle: weddingDetails.weddingStyle || '',
      culturalTraditions: weddingDetails.culturalTraditions,
      religiousTraditions: weddingDetails.religiousTraditions,
      plannedEvents: weddingDetails.plannedEvents,
    };

    // Generate recommendations
    const recommendations = SimpleRecommendationEngine.generateRecommendations(preferences);
    const moodboard = SimpleRecommendationEngine.generateMoodboard(preferences);

    return NextResponse.json({
      recommendations,
      moodboard,
      preferences
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' }, 
      { status: 500 }
    );
  }
}

// POST endpoint for n8n webhook integration
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { userId, preferences, action } = body;
    
    if (!userId || !preferences) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, preferences' }, 
        { status: 400 }
      );
    }

    // Handle different actions for n8n workflows
    switch (action) {
      case 'generate_recommendations':
        const recommendations = SimpleRecommendationEngine.generateRecommendations(preferences);
        return NextResponse.json({ recommendations });
      
      case 'generate_moodboard':
        const moodboard = SimpleRecommendationEngine.generateMoodboard(preferences);
        return NextResponse.json({ moodboard });
      
      case 'vendor_search_params':
        // Return search parameters for n8n vendor scraping
        const searchParams = {
          location: preferences.weddingLocation,
          budget_range: {
            min: preferences.budget * 0.8,
            max: preferences.budget * 1.2,
            currency: preferences.currency
          },
          guest_count: preferences.guestCount,
          wedding_style: preferences.weddingStyle,
          cultural_preferences: preferences.culturalTraditions,
          religious_preferences: preferences.religiousTraditions,
          events: preferences.plannedEvents
        };
        return NextResponse.json({ searchParams });
      
      default:
        return NextResponse.json(
          { error: 'Unknown action. Supported actions: generate_recommendations, generate_moodboard, vendor_search_params' }, 
          { status: 400 }
        );
    }

  } catch (error) {
    console.error('Error in recommendations API:', error);
    return NextResponse.json(
      { error: 'Failed to process request' }, 
      { status: 500 }
    );
  }
}
