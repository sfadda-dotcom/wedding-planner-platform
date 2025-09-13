

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

interface RecommendationData {
  priority: 'high' | 'medium' | 'low';
  category: string;
  title: string;
  description: string;
  reasoning: string;
  actionable_steps: string[];
  estimated_cost?: string;
  timeframe?: string;
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as any)?.id;
    
    // Get user's wedding details
    const userWithWeddingDetails = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        weddingDetails: true
      }
    });

    if (!userWithWeddingDetails?.weddingDetails?.weddingLocation) {
      return NextResponse.json({
        success: false,
        error: 'Please complete your wedding questionnaire first',
        needs_questionnaire: true
      });
    }

    const weddingDetails = userWithWeddingDetails.weddingDetails;

    // Generate AI-powered recommendations
    const recommendations = await generateAIRecommendations(weddingDetails);
    
    return NextResponse.json({
      success: true,
      recommendations,
      user_preferences: {
        location: weddingDetails.weddingLocation,
        guest_count: parseInt(weddingDetails.guestCount?.split('-')[0] || '50'), // Parse guest count range
        budget: Number(weddingDetails.budget) || 0,
        date: weddingDetails.weddingDate?.toISOString() || new Date().toISOString(),
        style: weddingDetails.weddingStyle || '',
        priorities: [] // You might want to add priorities to WeddingDetails model
      }
    });

  } catch (error) {
    console.error('Error generating recommendations:', error);
    return NextResponse.json(
      { error: 'Failed to generate recommendations' }, 
      { status: 500 }
    );
  }
}

async function generateAIRecommendations(weddingDetails: any): Promise<RecommendationData[]> {
  try {
    // Create a comprehensive prompt for AI recommendations
    const prompt = `
You are an expert wedding planner creating personalized recommendations for a couple. Based on their preferences, provide 4-6 specific, actionable recommendations.

Wedding Details:
- Location: ${weddingDetails.weddingLocation}
- Date: ${weddingDetails.weddingDate ? new Date(weddingDetails.weddingDate).toLocaleDateString() : 'Not specified'}
- Guest Count: ${weddingDetails.guestCount || 'Not specified'}
- Budget: £${weddingDetails.budget?.toString() || 'Not specified'}
- Cultural Traditions: ${weddingDetails.culturalTraditions?.join(', ') || 'None specified'}
- Religious Traditions: ${weddingDetails.religiousTraditions?.join(', ') || 'None specified'}
- Planned Events: ${weddingDetails.plannedEvents?.join(', ') || 'Not specified'}
- Wedding Style: ${weddingDetails.weddingStyle || 'Not specified'}
- Special Requirements: ${weddingDetails.specialRequirements || 'None specified'}

Please provide recommendations in the following JSON format:
{
  "recommendations": [
    {
      "priority": "high|medium|low",
      "category": "venue|catering|photography|music|flowers|decoration|planning",
      "title": "Clear, actionable recommendation title",
      "description": "Detailed description of what they should do",
      "reasoning": "Why this recommendation makes sense for their specific situation",
      "actionable_steps": ["Specific step 1", "Specific step 2", "Specific step 3"],
      "estimated_cost": "Cost range if applicable",
      "timeframe": "When they should act on this"
    }
  ]
}

Focus on:
1. Their budget constraints
2. Guest count considerations  
3. Location-specific advice
4. Timeline urgency (wedding date)
5. Their stated priorities
6. Cultural/religious requirements

Provide practical, specific advice they can act on immediately. Each recommendation should be tailored to their unique situation.

Respond with raw JSON only. Do not include code blocks, markdown, or any other formatting.
    `;

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
          content: prompt
        }],
        max_tokens: 2000,
        response_format: { type: "json_object" }
      }),
    });

    if (!response.ok) {
      throw new Error(`AI API request failed: ${response.status}`);
    }

    const result = await response.json();
    const aiResponse = result.choices[0]?.message?.content;
    
    if (!aiResponse) {
      throw new Error('No response from AI service');
    }

    const parsedResponse = JSON.parse(aiResponse);
    return parsedResponse.recommendations || [];

  } catch (error) {
    console.error('AI recommendation generation failed:', error);
    
    // Fallback to rule-based recommendations
    return generateFallbackRecommendations(weddingDetails);
  }
}

function generateFallbackRecommendations(weddingDetails: any): RecommendationData[] {
  const recommendations: RecommendationData[] = [];
  const weddingDate = weddingDetails.weddingDate ? new Date(weddingDetails.weddingDate) : null;
  const monthsUntilWedding = weddingDate ? Math.max(0, Math.ceil((weddingDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24 * 30))) : 12;

  // Parse guest count from range
  const guestCount = weddingDetails.guestCount ? parseInt(weddingDetails.guestCount.split('-')[0]) : 50;
  const budget = Number(weddingDetails.budget) || 0;

  // Venue recommendation (always high priority)
  recommendations.push({
    priority: 'high',
    category: 'venue',
    title: 'Secure Your Wedding Venue',
    description: `Find and book your wedding venue in ${weddingDetails.weddingLocation}. With ${weddingDetails.guestCount || 'your estimated'} guests, you'll need a space that can comfortably accommodate everyone.`,
    reasoning: 'Venue is typically the largest expense and sets the tone for your entire wedding. Popular venues book up quickly, especially in desirable locations.',
    actionable_steps: [
      'Research venues in your area that fit your budget and guest count',
      'Schedule site visits for your top 3-5 choices',
      'Ask about availability for your wedding date',
      'Compare pricing packages and what\'s included'
    ],
    estimated_cost: budget ? `£${Math.round(budget * 0.4).toLocaleString()} - £${Math.round(budget * 0.5).toLocaleString()}` : '£3,000 - £15,000',
    timeframe: monthsUntilWedding > 12 ? '12-18 months before wedding' : 'Book immediately'
  });

  // Photography recommendation
  recommendations.push({
    priority: 'high',
    category: 'photography',
    title: 'Book Your Wedding Photographer',
    description: 'Secure a professional photographer to capture your special moments. Quality wedding photography is an investment in memories that will last forever.',
    reasoning: 'The best photographers in your area book up quickly, and photography is one element you cannot recreate after the wedding.',
    actionable_steps: [
      'Research photographers whose style matches your vision',
      'Review full wedding galleries, not just highlight reels',
      'Meet with photographers to ensure personality fit',
      'Compare packages and understand what\'s included'
    ],
    estimated_cost: budget ? `£${Math.round(budget * 0.1).toLocaleString()} - £${Math.round(budget * 0.15).toLocaleString()}` : '£1,000 - £3,000',
    timeframe: monthsUntilWedding > 9 ? '9-12 months before wedding' : 'Book as soon as possible'
  });

  // Budget-specific recommendations
  if (budget && budget < 10000) {
    recommendations.push({
      priority: 'medium',
      category: 'planning',
      title: 'Maximize Your Budget with Smart Choices',
      description: 'With your budget of £' + budget.toLocaleString() + ', focus on the elements that matter most to you and find creative ways to save on others.',
      reasoning: 'Strategic planning can help you achieve your dream wedding within your budget constraints.',
      actionable_steps: [
        'Prioritize your top 3 most important wedding elements',
        'Consider weekday or off-season dates for better pricing',
        'Look into DIY options for decorations and favors',
        'Research local vendors who offer package deals'
      ],
      estimated_cost: 'Stay within existing budget',
      timeframe: 'Start planning immediately'
    });
  }

  // Timeline-based recommendations
  if (monthsUntilWedding < 6) {
    recommendations.push({
      priority: 'high',
      category: 'planning',
      title: 'Accelerate Your Wedding Planning',
      description: 'With only ' + monthsUntilWedding + ' months until your wedding, you need to move quickly on key decisions and bookings.',
      reasoning: 'Many vendors require 6+ months lead time, so you\'ll need to be flexible and act fast.',
      actionable_steps: [
        'Book venue and photographer immediately',
        'Be flexible with vendor choices and dates',
        'Consider simplified menu options',
        'Focus on essential elements first'
      ],
      timeframe: 'All actions are urgent'
    });
  }

  // Cultural/Religious considerations
  if (weddingDetails.culturalTraditions?.length > 0 || weddingDetails.religiousTraditions?.length > 0) {
    recommendations.push({
      priority: 'medium',
      category: 'planning',
      title: 'Honor Your Cultural and Religious Traditions',
      description: 'Incorporate your cultural and religious traditions meaningfully into your wedding celebration.',
      reasoning: 'These elements add personal significance and ensure your wedding reflects your values and heritage.',
      actionable_steps: [
        'Research vendors experienced with your traditions',
        'Plan ceremony elements that honor your beliefs',
        'Consider traditional music, food, or customs',
        'Communicate requirements clearly to all vendors'
      ],
      timeframe: 'Include in all vendor discussions'
    });
  }

  return recommendations.slice(0, 5); // Return top 5 recommendations
}

