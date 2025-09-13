
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { WeddingChecklist } from '@/components/checklist/wedding-checklist';

export default async function ChecklistPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;
  
  if (!userId) {
    redirect('/auth/signin');
  }

  // Fetch user's checklist data
  const checklists = await prisma.checklist.findMany({
    where: { userId: userId },
    include: {
      items: {
        orderBy: { createdAt: 'asc' }
      }
    },
    orderBy: { category: 'asc' }
  });

  const weddingDetails = await prisma.weddingDetails.findUnique({
    where: { userId: userId }
  });

  return <WeddingChecklist checklists={checklists} weddingDetails={weddingDetails} />;
}
