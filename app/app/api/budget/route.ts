
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
    const { totalBudget, currency, items } = body;

    // Find or create budget
    let budget = await prisma.budget.findFirst({
      where: { userId: userId },
      include: { items: true }
    });

    if (budget) {
      // Update existing budget
      budget = await prisma.budget.update({
        where: { id: budget.id },
        data: {
          totalBudget: parseFloat(totalBudget),
          currency: currency || 'GBP',
        },
        include: { items: true }
      });

      // Delete existing items
      await prisma.budgetItem.deleteMany({
        where: { budgetId: budget.id }
      });
    } else {
      // Create new budget
      budget = await prisma.budget.create({
        data: {
          userId: userId,
          name: 'My Wedding Budget',
          totalBudget: parseFloat(totalBudget),
          currency: currency || 'GBP',
        },
        include: { items: true }
      });
    }

    // Create budget items
    if (items && items.length > 0 && budget) {
      const budgetItems = items.map((item: any) => ({
        budgetId: budget!.id,
        category: item.category,
        item: item.item,
        estimatedCost: parseFloat(item.estimatedCost) || 0,
        actualCost: item.actualCost ? parseFloat(item.actualCost) : null,
        isPaid: item.isPaid || false,
        priority: item.priority || 'medium',
        notes: item.notes || null,
      }));

      await prisma.budgetItem.createMany({
        data: budgetItems
      });
    }

    const updatedBudget = await prisma.budget.findUnique({
      where: { id: budget.id },
      include: { items: true }
    });

    return NextResponse.json({
      message: 'Budget saved successfully',
      budget: updatedBudget,
    });
  } catch (error) {
    console.error('Budget save error:', error);
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

    const budget = await prisma.budget.findFirst({
      where: { userId: userId },
      include: {
        items: {
          orderBy: { category: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      budget,
    });
  } catch (error) {
    console.error('Get budget error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
