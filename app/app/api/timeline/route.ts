
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
    const { name, weddingDate, tasks } = body;

    // Find or create timeline
    let timeline = await prisma.timeline.findFirst({
      where: { userId: userId },
      include: { tasks: true }
    });

    if (timeline) {
      // Update existing timeline
      timeline = await prisma.timeline.update({
        where: { id: timeline.id },
        data: {
          name: name || 'My Wedding Timeline',
          weddingDate: new Date(weddingDate),
        },
        include: { tasks: true }
      });

      // Delete existing tasks
      await prisma.timelineTask.deleteMany({
        where: { timelineId: timeline.id }
      });
    } else {
      // Create new timeline
      timeline = await prisma.timeline.create({
        data: {
          userId: userId,
          name: name || 'My Wedding Timeline',
          weddingDate: new Date(weddingDate),
        },
        include: { tasks: true }
      });
    }

    // Create timeline tasks
    if (tasks && tasks.length > 0 && timeline) {
      const timelineTasks = tasks.map((task: any) => ({
        timelineId: timeline!.id,
        title: task.title,
        description: task.description || null,
        dueDate: new Date(task.dueDate),
        isCompleted: task.isCompleted || false,
        category: task.category || 'Custom',
        priority: task.priority || 'medium',
      }));

      await prisma.timelineTask.createMany({
        data: timelineTasks
      });
    }

    const updatedTimeline = await prisma.timeline.findUnique({
      where: { id: timeline.id },
      include: {
        tasks: {
          orderBy: { dueDate: 'asc' }
        }
      }
    });

    return NextResponse.json({
      message: 'Timeline saved successfully',
      timeline: updatedTimeline,
    });
  } catch (error) {
    console.error('Timeline save error:', error);
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

    const timeline = await prisma.timeline.findFirst({
      where: { userId: userId },
      include: {
        tasks: {
          orderBy: { dueDate: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      timeline,
    });
  } catch (error) {
    console.error('Get timeline error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
