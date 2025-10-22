
'use client';

import { motion } from 'framer-motion';
import { Bot, Calculator, Clock, Search, Mail, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export function QuickActions() {
  const quickActions = [
    {
      icon: Bot,
      title: 'Ask AI Assistant',
      description: 'Get personalized wedding advice',
      href: '/ai-assistant',
      color: 'bg-indigo-500',
    },
    {
      icon: Calculator,
      title: 'Budget Calculator',
      description: 'Calculate wedding costs quickly',
      href: '/budget',
      color: 'bg-green-500',
    },
    {
      icon: Clock,
      title: 'Add Task',
      description: 'Add a new planning task',
      href: '/checklist',
      color: 'bg-blue-500',
    },
    {
      icon: Search,
      title: 'Find Vendors',
      description: 'Browse wedding suppliers',
      href: '/vendors',
      color: 'bg-orange-500',
    },
    {
      icon: Mail,
      title: 'Create Invitation',
      description: 'Design your wedding invites',
      href: '/templates',
      color: 'bg-rose-500',
    },
    {
      icon: FileText,
      title: 'Write Vows',
      description: 'Craft your perfect vows',
      href: '/templates',
      color: 'bg-purple-500',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.4 }}
    >
      <Card className="wedding-card">
        <CardHeader>
          <CardTitle className="text-2xl font-display">Quick Actions</CardTitle>
          <CardDescription>
            Jump into your most common wedding planning tasks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {quickActions?.map((action, index) => (
              <motion.div
                key={action?.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
              >
                <Button asChild variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2 hover:border-rose-300 hover:bg-rose-50 group">
                  <Link href={action?.href}>
                    <div className={`w-12 h-12 rounded-lg ${action?.color} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                      <action.icon className="h-6 w-6 text-white" />
                    </div>
                    <div className="text-center">
                      <p className="font-medium text-xs leading-tight">{action?.title}</p>
                      <p className="text-xs text-gray-500 mt-1 leading-tight">{action?.description}</p>
                    </div>
                  </Link>
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
