
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

// This endpoint is designed to integrate with n8n workflows
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { category, location, budget_range, trigger_n8n } = body;

    // Validate required fields
    if (!category || !location) {
      return NextResponse.json(
        { error: 'Missing required fields: category, location' }, 
        { status: 400 }
      );
    }

    // If this is a trigger for n8n workflow
    if (trigger_n8n) {
      // Here you would typically call your n8n webhook
      // For now, we'll return the search parameters for n8n to process
      const searchParameters = {
        user_id: (session.user as any)?.id,
        timestamp: new Date().toISOString(),
        search_params: {
          category,
          location,
          budget_range: budget_range || null,
          search_radius: '50km', // default
          language: 'en',
          country: 'auto-detect'
        },
        webhook_url: process.env.N8N_WEBHOOK_URL || '', // You would set this in your environment
        callback_url: `${request.nextUrl.origin}/api/vendor-search/callback`
      };

      // Log the search for analytics
      console.log('Vendor search triggered:', searchParameters);

      return NextResponse.json({
        success: true,
        message: 'Search initiated successfully',
        search_id: `search_${Date.now()}`,
        parameters: searchParameters
      });
    }

    // For regular API calls without n8n integration
    // Return mock data or handle regular search logic
    return NextResponse.json({
      success: true,
      message: 'Search completed',
      vendors: [] // This would be populated with actual vendor data
    });

  } catch (error) {
    console.error('Error in vendor search API:', error);
    return NextResponse.json(
      { error: 'Failed to process vendor search' }, 
      { status: 500 }
    );
  }
}

// Callback endpoint for n8n webhook results
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { search_id, vendors, status } = body;

    // Here you would typically:
    // 1. Store the vendor results in your database
    // 2. Notify the user via WebSocket or push notification
    // 3. Update the search status

    console.log('Vendor search results received:', { search_id, status, vendor_count: vendors?.length || 0 });

    return NextResponse.json({
      success: true,
      message: 'Vendor results processed successfully'
    });

  } catch (error) {
    console.error('Error processing vendor search callback:', error);
    return NextResponse.json(
      { error: 'Failed to process callback' }, 
      { status: 500 }
    );
  }
}
