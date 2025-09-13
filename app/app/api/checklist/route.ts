
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
    const { checklists } = body;

    // Delete existing checklists for user
    await prisma.checklist.deleteMany({
      where: { userId: userId }
    });

    // Create new checklists with items
    for (const checklist of checklists) {
      const createdChecklist = await prisma.checklist.create({
        data: {
          userId: userId,
          name: checklist.name,
          category: checklist.category,
        },
      });

      // Create checklist items
      if (checklist.items && checklist.items.length > 0) {
        const checklistItems = checklist.items.map((item: any) => ({
          checklistId: createdChecklist.id,
          title: item.title,
          description: item.description || null,
          isCompleted: item.isCompleted || false,
          category: item.category,
          importance: item.importance || 'medium',
        }));

        await prisma.checklistItem.createMany({
          data: checklistItems
        });
      }
    }

    const savedChecklists = await prisma.checklist.findMany({
      where: { userId: userId },
      include: { items: true },
      orderBy: { category: 'asc' }
    });

    return NextResponse.json({
      message: 'Checklist saved successfully',
      checklists: savedChecklists,
    });
  } catch (error) {
    console.error('Checklist save error:', error);
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

    const checklists = await prisma.checklist.findMany({
      where: { userId: userId },
      include: {
        items: {
          orderBy: { createdAt: 'asc' }
        }
      },
      orderBy: { category: 'asc' }
    });

    return NextResponse.json({
      checklists,
    });
  } catch (error) {
    console.error('Get checklist error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
