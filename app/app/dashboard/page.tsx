
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DashboardContent } from '@/components/dashboard/dashboard-content';

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;
  
  if (!userId) {
    redirect('/auth/signin');
  }

  // Check if user has completed questionnaire
  const weddingDetails = await prisma.weddingDetails.findUnique({
    where: { userId: userId },
  });

  if (!weddingDetails) {
    redirect('/questionnaire');
  }

  // Fetch user's data
  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: {
      weddingDetails: true,
      budgets: {
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      timelines: {
        include: {
          tasks: true,
        },
        orderBy: { createdAt: 'desc' },
        take: 1,
      },
      checklists: {
        include: {
          items: true,
        },
        orderBy: { createdAt: 'desc' },
      },
    },
  });

  return <DashboardContent user={user} />;
}
