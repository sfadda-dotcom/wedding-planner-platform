
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { WeddingTimeline } from '@/components/timeline/wedding-timeline';

export default async function TimelinePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;
  
  if (!userId) {
    redirect('/auth/signin');
  }

  // Fetch user's timeline data
  const timeline = await prisma.timeline.findFirst({
    where: { userId: userId },
    include: {
      tasks: {
        orderBy: { dueDate: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const weddingDetails = await prisma.weddingDetails.findUnique({
    where: { userId: userId }
  });

  return <WeddingTimeline timeline={timeline} weddingDetails={weddingDetails} />;
}
