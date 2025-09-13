
import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/db';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const body = await request.json();
    const {
      partnerOneName,
      partnerTwoName,
      weddingLocation,
      weddingDate,
      guestCount,
      budget,
      currency,
      culturalTraditions,
      religiousTraditions,
      plannedEvents,
      weddingStyle,
      venueType,
      specialRequirements,
    } = body;

    // Update user with partner names if provided
    if (partnerOneName || partnerTwoName) {
      await prisma.user.update({
        where: { id: userId },
        data: {
          partnerOneName: partnerOneName || undefined,
          partnerTwoName: partnerTwoName || undefined,
          name: partnerOneName && partnerTwoName 
            ? `${partnerOneName} & ${partnerTwoName}` 
            : undefined,
        },
      });
    }

    // Create or update wedding details
    const weddingDetails = await prisma.weddingDetails.upsert({
      where: { userId: userId },
      update: {
        partnerOneName: partnerOneName || '',
        partnerTwoName: partnerTwoName || '',
        weddingLocation,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        guestCount,
        budget: budget ? parseFloat(budget) : null,
        currency: currency || 'GBP',
        culturalTraditions: culturalTraditions || [],
        religiousTraditions: religiousTraditions || [],
        plannedEvents: plannedEvents || [],
        weddingStyle,
        venueType,
        specialRequirements,
      },
      create: {
        userId: userId,
        partnerOneName: partnerOneName || '',
        partnerTwoName: partnerTwoName || '',
        weddingLocation,
        weddingDate: weddingDate ? new Date(weddingDate) : null,
        guestCount,
        budget: budget ? parseFloat(budget) : null,
        currency: currency || 'GBP',
        culturalTraditions: culturalTraditions || [],
        religiousTraditions: religiousTraditions || [],
        plannedEvents: plannedEvents || [],
        weddingStyle,
        venueType,
        specialRequirements,
      },
    });

    return NextResponse.json({
      message: 'Wedding details saved successfully',
      weddingDetails,
    });
  } catch (error) {
    console.error('Questionnaire error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user || !(session.user as any)?.id) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id;

    const weddingDetails = await prisma.weddingDetails.findUnique({
      where: { userId: userId },
    });

    return NextResponse.json({
      weddingDetails,
    });
  } catch (error) {
    console.error('Get questionnaire error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
