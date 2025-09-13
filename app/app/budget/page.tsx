
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/db';
import { BudgetPlanner } from '@/components/budget/budget-planner';

export default async function BudgetPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  const userId = (session.user as any)?.id;
  
  if (!userId) {
    redirect('/auth/signin');
  }

  // Fetch user's budget data
  const budgetData = await prisma.budget.findFirst({
    where: { userId: userId },
    include: {
      items: {
        orderBy: { category: 'asc' }
      }
    },
    orderBy: { createdAt: 'desc' }
  });

  const weddingDetails = await prisma.weddingDetails.findUnique({
    where: { userId: userId }
  });

  return <BudgetPlanner budget={budgetData} weddingDetails={weddingDetails} />;
}
