
'use client';

import { motion } from 'framer-motion';
import { 
  Heart, 
  PoundSterling, 
  Calendar, 
  CheckCircle, 
  Search, 
  Mail, 
  Users,
  MapPin,
  Clock,
  TrendingUp,
  Gift
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { DashboardHeader } from './dashboard-header';
import { QuickActions } from './quick-actions';
import { WeddingOverview } from './wedding-overview';
import { RecommendationsPanel } from '@/components/recommendations/recommendations-panel';
import { Footer } from '@/components/footer';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardContentProps {
  user: any;
}

export function DashboardContent({ user }: DashboardContentProps) {
  const weddingDetails = user?.weddingDetails;
  const currentBudget = user?.budgets?.[0];
  const currentTimeline = user?.timelines?.[0];
  const checklists = user?.checklists || [];

  // Calculate completion percentage
  const totalTasks = currentTimeline?.tasks?.length || 0;
  const completedTasks = currentTimeline?.tasks?.filter((task: any) => task?.isCompleted)?.length || 0;
  const planningProgress = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const totalChecklistItems = checklists?.reduce((sum: number, list: any) => 
    sum + (list?.items?.length || 0), 0) || 0;
  const completedChecklistItems = checklists?.reduce((sum: number, list: any) => 
    sum + (list?.items?.filter((item: any) => item?.isCompleted)?.length || 0), 0) || 0;
  const checklistProgress = totalChecklistItems > 0 ? Math.round((completedChecklistItems / totalChecklistItems) * 100) : 0;

  const features = [
    {
      icon: PoundSterling,
      title: 'Budget Planner',
      description: 'Create and manage your wedding budget with smart templates',
      href: '/budget',
      color: 'bg-green-500',
      progress: currentBudget ? 75 : 0,
      items: currentBudget?.items?.length || 0,
    },
    {
      icon: Calendar,
      title: 'Timeline & Tasks',
      description: 'Stay organized with your wedding planning timeline',
      href: '/timeline',
      color: 'bg-blue-500',
      progress: planningProgress,
      items: totalTasks,
    },
    {
      icon: CheckCircle,
      title: 'Planning Checklist',
      description: 'Never miss important wedding planning tasks',
      href: '/checklist',
      color: 'bg-teal-500',
      progress: checklistProgress,
      items: totalChecklistItems,
    },
    {
      icon: Search,
      title: 'Vendor Discovery',
      description: 'Find and connect with wedding vendors worldwide',
      href: '/vendors',
      color: 'bg-emerald-500',
      progress: 0,
      items: 0,
    },
    {
      icon: Mail,
      title: 'Invitations & Templates',
      description: 'Beautiful wedding invitation and vow templates',
      href: '/templates',
      color: 'bg-green-500',
      progress: 0,
      items: 0,
    },
    {
      icon: Gift,
      title: 'AI Wedding Assistant',
      description: 'Get personalized recommendations and advice',
      href: '/ai-assistant',
      color: 'bg-indigo-500',
      progress: 0,
      items: 0,
    },
  ];

  const upcomingTasks = currentTimeline?.tasks
    ?.filter((task: any) => !task?.isCompleted)
    ?.sort((a: any, b: any) => new Date(a?.dueDate || 0).getTime() - new Date(b?.dueDate || 0).getTime())
    ?.slice(0, 3) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
      <DashboardHeader user={user} />
      
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Welcome back,{' '}
              <span className="romantic-text">
                {weddingDetails?.partnerOneName && weddingDetails?.partnerTwoName 
                  ? `${weddingDetails.partnerOneName} & ${weddingDetails.partnerTwoName}`
                  : 'lovebirds'
                }!
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Your wedding planning journey continues.<br />Let's make your special day perfect together.
            </p>
          </div>

          {weddingDetails && (
            <WeddingOverview weddingDetails={weddingDetails} />
          )}
        </motion.div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
        >
          <Card className="wedding-card">
            <CardContent className="p-6 text-center">
              <Clock className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {weddingDetails?.weddingDate 
                  ? Math.max(0, Math.ceil((new Date(weddingDetails.weddingDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)))
                  : '∞'
                }
              </p>
              <p className="text-sm text-gray-600">Days to go</p>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 text-emerald-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{checklistProgress}%</p>
              <p className="text-sm text-gray-600">Planning Progress</p>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6 text-center">
              <Users className="h-8 w-8 text-teal-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">{weddingDetails?.guestCount || '0'}</p>
              <p className="text-sm text-gray-600">Expected Guests</p>
            </CardContent>
          </Card>

          <Card className="wedding-card">
            <CardContent className="p-6 text-center">
              <PoundSterling className="h-8 w-8 text-lime-600 mx-auto mb-2" />
              <p className="text-2xl font-bold text-gray-800">
                {weddingDetails?.currency === 'GBP' ? '£' : weddingDetails?.currency === 'EUR' ? '€' : '$'}
                {weddingDetails?.budget ? Number(weddingDetails.budget).toLocaleString() : '0'}
              </p>
              <p className="text-sm text-gray-600">Total Budget</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* AI Recommendations */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-8"
        >
          <RecommendationsPanel />
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8"
        >
          {features?.map((feature, index) => (
            <Card key={feature?.title} className="wedding-card hover:border-green-200 group">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className={`w-12 h-12 rounded-lg ${feature?.color} flex items-center justify-center`}>
                    <feature.icon className="h-6 w-6 text-white" />
                  </div>
                  {feature?.progress > 0 && (
                    <Badge variant="secondary" className="text-xs">
                      {feature?.progress}%
                    </Badge>
                  )}
                </div>
                <CardTitle className="text-xl font-display group-hover:text-green-700 transition-colors">
                  {feature?.title}
                </CardTitle>
                <CardDescription className="text-gray-600">
                  {feature?.description}
                </CardDescription>
              </CardHeader>
              
              <CardContent className="pt-0">
                {feature?.progress > 0 && (
                  <div className="mb-4">
                    <Progress value={feature?.progress} className="h-2" />
                  </div>
                )}
                
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">
                    {feature?.items > 0 && `${feature?.items} items`}
                  </span>
                  
                  <Button asChild size="sm" variant="outline" className="group-hover:border-green-600 group-hover:text-green-700">
                    <Link href={feature?.href}>
                      {feature?.progress > 0 ? 'Continue' : 'Start'}
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </motion.div>

        {/* Upcoming Tasks */}
        {upcomingTasks?.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-8"
          >
            <Card className="wedding-card">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5 text-green-600" />
                  <span>Upcoming Tasks</span>
                </CardTitle>
                <CardDescription>
                  Your next important wedding planning tasks
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {upcomingTasks?.map((task: any, index: number) => (
                    <div key={task?.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-800">{task?.title}</h4>
                        <p className="text-sm text-gray-600">
                          Due: {task?.dueDate ? format(new Date(task.dueDate), 'MMM dd, yyyy') : 'No due date'}
                        </p>
                      </div>
                      <Badge variant={task?.priority === 'high' ? 'destructive' : 'secondary'}>
                        {task?.priority || 'medium'}
                      </Badge>
                    </div>
                  ))}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <Button asChild variant="outline" className="w-full">
                    <Link href="/timeline">
                      View All Tasks
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Quick Actions */}
        <QuickActions />
      </div>
      <Footer />
    </div>
  );
}
