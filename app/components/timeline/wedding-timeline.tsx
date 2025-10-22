
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Trash2, 
  Clock,
  CheckCircle,
  AlertTriangle,
  Star,
  Save,
  Edit
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Textarea } from '@/components/ui/textarea';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Footer } from '@/components/footer';
import { toast } from 'sonner';
import { format, addMonths, addWeeks, addDays, isAfter, isBefore } from 'date-fns';

interface WeddingTimelineProps {
  timeline: any;
  weddingDetails: any;
}

const DEFAULT_TIMELINE_TASKS = [
  { title: 'Set wedding budget', category: 'Planning', weeks: 52, priority: 'high' },
  { title: 'Create guest list draft', category: 'Planning', weeks: 50, priority: 'high' },
  { title: 'Research and visit venues', category: 'Venues', weeks: 48, priority: 'high' },
  { title: 'Book ceremony venue', category: 'Venues', weeks: 44, priority: 'high' },
  { title: 'Book reception venue', category: 'Venues', weeks: 44, priority: 'high' },
  { title: 'Book photographer', category: 'Vendors', weeks: 40, priority: 'high' },
  { title: 'Book caterer', category: 'Vendors', weeks: 36, priority: 'high' },
  { title: 'Order wedding dress/suit', category: 'Attire', weeks: 32, priority: 'medium' },
  { title: 'Send save-the-dates', category: 'Stationery', weeks: 32, priority: 'medium' },
  { title: 'Book officiant', category: 'Ceremony', weeks: 28, priority: 'high' },
  { title: 'Order wedding invitations', category: 'Stationery', weeks: 24, priority: 'medium' },
  { title: 'Book florist', category: 'Vendors', weeks: 20, priority: 'medium' },
  { title: 'Book musicians/DJ', category: 'Vendors', weeks: 20, priority: 'medium' },
  { title: 'Send wedding invitations', category: 'Stationery', weeks: 12, priority: 'high' },
  { title: 'Final dress/suit fitting', category: 'Attire', weeks: 8, priority: 'medium' },
  { title: 'Apply for marriage license', category: 'Legal', weeks: 6, priority: 'high' },
  { title: 'Finalize guest count', category: 'Planning', weeks: 4, priority: 'high' },
  { title: 'Pick up marriage license', category: 'Legal', weeks: 2, priority: 'high' },
  { title: 'Rehearsal dinner', category: 'Events', weeks: 0.14, priority: 'medium' },
];

export function WeddingTimeline({ timeline, weddingDetails }: WeddingTimelineProps) {
  const [timelineData, setTimelineData] = useState(timeline);
  const [tasks, setTasks] = useState(timeline?.tasks || []);
  const [weddingDate, setWeddingDate] = useState(
    weddingDetails?.weddingDate ? new Date(weddingDetails.weddingDate) : new Date()
  );
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    dueDate: '',
    category: '',
    priority: 'medium',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingTask, setEditingTask] = useState<string | null>(null);

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((task: any) => task?.isCompleted)?.length || 0;
  const progressPercentage = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const saveTimeline = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/timeline', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: 'My Wedding Timeline',
          weddingDate: weddingDate,
          tasks: tasks,
        }),
      });

      if (response.ok) {
        toast.success('Timeline saved successfully!');
      } else {
        throw new Error('Failed to save timeline');
      }
    } catch (error) {
      toast.error('Failed to save timeline');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultTimeline = () => {
    if (!weddingDate) {
      toast.error('Please set your wedding date first');
      return;
    }

    const defaultTasks = DEFAULT_TIMELINE_TASKS.map((task) => ({
      id: `default-${Date.now()}-${task.title}`,
      title: task.title,
      description: '',
      dueDate: addWeeks(weddingDate, -task.weeks),
      category: task.category,
      priority: task.priority,
      isCompleted: false,
    }));

    setTasks(defaultTasks);
    toast.success('Default wedding timeline generated!');
  };

  const addTask = () => {
    if (!newTask.title || !newTask.dueDate) {
      toast.error('Please fill in title and due date');
      return;
    }

    const task = {
      id: `custom-${Date.now()}`,
      title: newTask.title,
      description: newTask.description,
      dueDate: new Date(newTask.dueDate),
      category: newTask.category || 'Custom',
      priority: newTask.priority,
      isCompleted: false,
    };

    setTasks([...tasks, task].sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()));
    setNewTask({
      title: '',
      description: '',
      dueDate: '',
      category: '',
      priority: 'medium',
    });
  };

  const toggleTaskComplete = (taskId: string) => {
    setTasks(tasks.map((task: any) => 
      task.id === taskId ? { ...task, isCompleted: !task.isCompleted } : task
    ));
  };

  const removeTask = (taskId: string) => {
    setTasks(tasks.filter((task: any) => task.id !== taskId));
  };

  const updateTask = (taskId: string, updates: any) => {
    setTasks(tasks.map((task: any) => 
      task.id === taskId ? { ...task, ...updates } : task
    ));
    setEditingTask(null);
  };

  const getTaskStatus = (task: any) => {
    if (task?.isCompleted) return 'completed';
    if (isBefore(new Date(task?.dueDate), new Date())) return 'overdue';
    if (isBefore(new Date(task?.dueDate), addWeeks(new Date(), 2))) return 'upcoming';
    return 'scheduled';
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700';
      case 'overdue': return 'bg-red-100 text-red-700';
      case 'upcoming': return 'bg-yellow-100 text-yellow-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high':
        return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'low':
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Star className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <DashboardHeader user={{ name: weddingDetails?.partnerOneName && weddingDetails?.partnerTwoName ? `${weddingDetails.partnerOneName} & ${weddingDetails.partnerTwoName}` : 'User' }} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Wedding <span className="text-blue-600">Timeline</span> & Tasks
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay organized with your wedding planning schedule and never miss important deadlines
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{totalTasks}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{completedTasks}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{progressPercentage}%</p>
                <p className="text-sm text-gray-600">Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="wedding-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Planning Progress</h3>
                <div className="space-x-2">
                  {tasks.length === 0 && (
                    <Button onClick={generateDefaultTimeline} variant="outline" size="sm">
                      Generate Timeline
                    </Button>
                  )}
                  <Button onClick={saveTimeline} disabled={isLoading} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Timeline
                  </Button>
                </div>
              </div>
              <Progress value={progressPercentage} className="h-3 mb-2" />
              <p className="text-sm text-gray-600 text-center">
                {completedTasks} of {totalTasks} tasks completed
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Timeline */}
            <div className="lg:col-span-2">
              <Card className="wedding-card">
                <CardHeader>
                  <CardTitle>Wedding Planning Timeline</CardTitle>
                  <CardDescription>Your personalized wedding planning schedule</CardDescription>
                </CardHeader>
                <CardContent>
                  {tasks?.length === 0 ? (
                    <div className="text-center py-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-700 mb-2">No timeline tasks yet</h3>
                      <p className="text-gray-500 mb-6">Generate a default timeline or add custom tasks to get started.</p>
                      <Button onClick={generateDefaultTimeline}>
                        Generate Default Timeline
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {tasks?.map((task: any) => {
                        const status = getTaskStatus(task);
                        
                        return (
                          <div key={task?.id} className="border border-gray-200 rounded-lg p-4">
                            {editingTask === task?.id ? (
                              <div className="space-y-3">
                                <Input
                                  value={task?.title}
                                  onChange={(e) => updateTask(task?.id, { title: e.target.value })}
                                  placeholder="Task title"
                                />
                                <Input
                                  type="date"
                                  value={task?.dueDate ? format(new Date(task?.dueDate), 'yyyy-MM-dd') : ''}
                                  onChange={(e) => updateTask(task?.id, { dueDate: new Date(e.target.value) })}
                                />
                                <div className="flex space-x-2">
                                  <Button size="sm" onClick={() => setEditingTask(null)}>
                                    Done
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-start justify-between">
                                <div className="flex items-start space-x-3 flex-1">
                                  <Checkbox
                                    checked={task?.isCompleted}
                                    onCheckedChange={() => toggleTaskComplete(task?.id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2 mb-1">
                                      {getPriorityIcon(task?.priority)}
                                      <h4 className={`font-medium ${task?.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                        {task?.title}
                                      </h4>
                                      <Badge className={`text-xs ${getStatusColor(status)}`}>
                                        {status}
                                      </Badge>
                                    </div>
                                    <div className="flex items-center space-x-4 text-sm text-gray-600">
                                      <span>📅 {format(new Date(task?.dueDate), 'MMM dd, yyyy')}</span>
                                      <span>🏷️ {task?.category}</span>
                                    </div>
                                    {task?.description && (
                                      <p className="text-sm text-gray-600 mt-1">{task?.description}</p>
                                    )}
                                  </div>
                                </div>
                                <div className="flex items-center space-x-2 ml-4">
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => setEditingTask(task?.id)}
                                  >
                                    <Edit className="h-3 w-3" />
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeTask(task?.id)}
                                    className="text-red-600"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Add New Task */}
            <div>
              <Card className="wedding-card mb-6">
                <CardHeader>
                  <CardTitle>Add New Task</CardTitle>
                  <CardDescription>Add a custom task to your timeline</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Wedding Date</Label>
                    <Input
                      type="date"
                      value={weddingDate ? format(weddingDate, 'yyyy-MM-dd') : ''}
                      onChange={(e) => setWeddingDate(new Date(e.target.value))}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input
                      value={newTask.title}
                      onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                      placeholder="e.g., Book photographer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Due Date</Label>
                    <Input
                      type="date"
                      value={newTask.dueDate}
                      onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newTask.category} onValueChange={(value) => setNewTask({...newTask, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Planning">📋 Planning</SelectItem>
                        <SelectItem value="Venues">🏛️ Venues</SelectItem>
                        <SelectItem value="Vendors">🤝 Vendors</SelectItem>
                        <SelectItem value="Attire">👗 Attire</SelectItem>
                        <SelectItem value="Stationery">💌 Stationery</SelectItem>
                        <SelectItem value="Ceremony">💒 Ceremony</SelectItem>
                        <SelectItem value="Legal">📋 Legal</SelectItem>
                        <SelectItem value="Custom">📝 Custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Priority</Label>
                    <Select value={newTask.priority} onValueChange={(value) => setNewTask({...newTask, priority: value})}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="high">🔴 High Priority</SelectItem>
                        <SelectItem value="medium">🟡 Medium Priority</SelectItem>
                        <SelectItem value="low">🟢 Low Priority</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={newTask.description}
                      onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                      placeholder="Additional details..."
                      rows={3}
                    />
                  </div>

                  <Button onClick={addTask} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Add Task
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
