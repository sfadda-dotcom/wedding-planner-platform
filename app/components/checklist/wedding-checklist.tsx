
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  CheckCircle, 
  Plus, 
  Trash2, 
  Clock,
  Star,
  AlertCircle,
  Save,
  ListChecks
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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Footer } from '@/components/footer';
import { toast } from 'sonner';

interface WeddingChecklistProps {
  checklists: any[];
  weddingDetails: any;
}

const DEFAULT_CHECKLIST_CATEGORIES = [
  {
    name: 'Venue & Reception',
    icon: '🏛️',
    items: [
      'Research and visit potential venues',
      'Book ceremony venue',
      'Book reception venue',
      'Finalize seating arrangement',
      'Confirm setup and breakdown times',
      'Review vendor policies and restrictions',
    ]
  },
  {
    name: 'Vendors & Services',
    icon: '🤝',
    items: [
      'Research and book photographer',
      'Research and book videographer',
      'Book florist',
      'Book caterer or restaurant',
      'Book wedding cake baker',
      'Book musicians/DJ',
      'Book transportation',
      'Book hair and makeup artists',
    ]
  },
  {
    name: 'Attire & Beauty',
    icon: '👗',
    items: [
      'Shop for wedding dress/suit',
      'Schedule dress/suit fittings',
      'Choose wedding shoes',
      'Select undergarments and accessories',
      'Plan hair and makeup trial',
      'Choose groomsmen and bridesmaids attire',
      'Purchase wedding rings',
    ]
  },
  {
    name: 'Invitations & Stationery',
    icon: '💌',
    items: [
      'Create guest list',
      'Design and order save-the-dates',
      'Design and order invitations',
      'Send save-the-dates',
      'Send wedding invitations',
      'Track RSVPs',
      'Order thank you cards',
      'Create wedding website',
    ]
  },
  {
    name: 'Legal & Administrative',
    icon: '📋',
    items: [
      'Apply for marriage license',
      'Complete marriage license requirements',
      'Book officiant',
      'Plan ceremony details',
      'Update insurance policies',
      'Plan name change (if applicable)',
      'Update emergency contacts',
    ]
  },
  {
    name: 'Final Preparations',
    icon: '✨',
    items: [
      'Finalize guest count with venue',
      'Confirm all vendor details',
      'Prepare emergency kit',
      'Delegate day-of responsibilities',
      'Pack honeymoon bags',
      'Prepare vendor payments and tips',
      'Get marriage license',
      'Rehearsal dinner',
    ]
  },
];

export function WeddingChecklist({ checklists, weddingDetails }: WeddingChecklistProps) {
  const [checklistData, setChecklistData] = useState(checklists || []);
  const [newItem, setNewItem] = useState({
    category: '',
    title: '',
    description: '',
    importance: 'medium',
  });
  const [isLoading, setIsLoading] = useState(false);

  const totalItems = checklistData?.reduce((sum: number, list: any) => 
    sum + (list?.items?.length || 0), 0) || 0;
  
  const completedItems = checklistData?.reduce((sum: number, list: any) => 
    sum + (list?.items?.filter((item: any) => item?.isCompleted)?.length || 0), 0) || 0;
  
  const completionPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const saveChecklist = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/checklist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          checklists: checklistData,
        }),
      });

      if (response.ok) {
        toast.success('Checklist saved successfully!');
      } else {
        throw new Error('Failed to save checklist');
      }
    } catch (error) {
      toast.error('Failed to save checklist');
    } finally {
      setIsLoading(false);
    }
  };

  const generateDefaultChecklist = async () => {
    const defaultChecklists = DEFAULT_CHECKLIST_CATEGORIES.map((category) => ({
      id: `default-${Date.now()}-${category.name}`,
      name: category.name,
      category: category.name,
      items: category.items.map((item, index) => ({
        id: `item-${Date.now()}-${index}`,
        title: item,
        description: '',
        isCompleted: false,
        category: category.name,
        importance: 'medium',
      })),
    }));

    setChecklistData(defaultChecklists);
    toast.success('Default wedding checklist generated!');
  };

  const addCustomItem = () => {
    if (!newItem.category || !newItem.title) {
      toast.error('Please fill in category and title');
      return;
    }

    const categoryList = checklistData.find(list => list.category === newItem.category);
    const item = {
      id: `custom-${Date.now()}`,
      title: newItem.title,
      description: newItem.description,
      isCompleted: false,
      category: newItem.category,
      importance: newItem.importance,
    };

    if (categoryList) {
      categoryList.items.push(item);
    } else {
      setChecklistData([...checklistData, {
        id: `list-${Date.now()}`,
        name: newItem.category,
        category: newItem.category,
        items: [item],
      }]);
    }

    setNewItem({
      category: '',
      title: '',
      description: '',
      importance: 'medium',
    });
  };

  const toggleItemComplete = (listId: string, itemId: string) => {
    setChecklistData(checklistData.map(list => 
      list.id === listId ? {
        ...list,
        items: list.items.map((item: any) => 
          item.id === itemId ? { ...item, isCompleted: !item.isCompleted } : item
        )
      } : list
    ));
  };

  const removeItem = (listId: string, itemId: string) => {
    setChecklistData(checklistData.map(list => 
      list.id === listId ? {
        ...list,
        items: list.items.filter((item: any) => item.id !== itemId)
      } : list
    ));
  };

  const getImportanceIcon = (importance: string) => {
    switch (importance) {
      case 'high':
        return <AlertCircle className="h-4 w-4 text-red-500" />;
      case 'low':
        return <Clock className="h-4 w-4 text-green-500" />;
      default:
        return <Star className="h-4 w-4 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-indigo-50 to-blue-50">
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
              Wedding <span className="text-purple-600">Planning</span> Checklist
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Stay organized and never miss important wedding planning tasks
            </p>
          </div>

          {/* Progress Overview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <ListChecks className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{totalItems}</p>
                <p className="text-sm text-gray-600">Total Tasks</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{completedItems}</p>
                <p className="text-sm text-gray-600">Completed</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">{completionPercentage}%</p>
                <p className="text-sm text-gray-600">Progress</p>
              </CardContent>
            </Card>
          </div>

          {/* Progress Bar */}
          <Card className="wedding-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Overall Progress</h3>
                <div className="space-x-2">
                  {checklistData.length === 0 && (
                    <Button onClick={generateDefaultChecklist} variant="outline" size="sm">
                      Generate Default Checklist
                    </Button>
                  )}
                  <Button onClick={saveChecklist} disabled={isLoading} size="sm">
                    <Save className="h-4 w-4 mr-2" />
                    Save Checklist
                  </Button>
                </div>
              </div>
              <Progress value={completionPercentage} className="h-3 mb-2" />
              <p className="text-sm text-gray-600 text-center">
                {completedItems} of {totalItems} tasks completed
              </p>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checklist Items */}
            <div className="lg:col-span-2">
              {checklistData?.length === 0 ? (
                <Card className="wedding-card">
                  <CardContent className="p-12 text-center">
                    <ListChecks className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No checklist items yet</h3>
                    <p className="text-gray-500 mb-6">Get started with a default wedding planning checklist or create your own custom tasks.</p>
                    <Button onClick={generateDefaultChecklist}>
                      Generate Default Checklist
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Accordion type="multiple" className="space-y-4">
                  {checklistData?.map((list: any) => {
                    const categoryCompleted = list?.items?.filter((item: any) => item?.isCompleted)?.length || 0;
                    const categoryTotal = list?.items?.length || 0;
                    const categoryProgress = categoryTotal > 0 ? (categoryCompleted / categoryTotal) * 100 : 0;

                    return (
                      <AccordionItem key={list?.id} value={list?.id}>
                        <Card className="wedding-card">
                          <AccordionTrigger className="px-6 py-4 hover:no-underline">
                            <div className="flex items-center justify-between w-full mr-4">
                              <div className="flex items-center space-x-3">
                                <span className="text-2xl">
                                  {DEFAULT_CHECKLIST_CATEGORIES?.find(cat => cat?.name === list?.category)?.icon || '📝'}
                                </span>
                                <div className="text-left">
                                  <h3 className="font-semibold text-gray-800">{list?.name}</h3>
                                  <p className="text-sm text-gray-600">{categoryCompleted} of {categoryTotal} completed</p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Progress value={categoryProgress} className="w-20 h-2" />
                                <Badge variant={categoryProgress === 100 ? "default" : "secondary"}>
                                  {Math.round(categoryProgress)}%
                                </Badge>
                              </div>
                            </div>
                          </AccordionTrigger>
                          
                          <AccordionContent>
                            <div className="px-6 pb-4 space-y-3">
                              {list?.items?.map((item: any) => (
                                <div key={item?.id} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                                  <Checkbox
                                    checked={item?.isCompleted}
                                    onCheckedChange={() => toggleItemComplete(list?.id, item?.id)}
                                    className="mt-1"
                                  />
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      {getImportanceIcon(item?.importance)}
                                      <h4 className={`font-medium ${item?.isCompleted ? 'line-through text-gray-500' : 'text-gray-800'}`}>
                                        {item?.title}
                                      </h4>
                                    </div>
                                    {item?.description && (
                                      <p className="text-sm text-gray-600 mt-1">{item?.description}</p>
                                    )}
                                  </div>
                                  <Button
                                    size="sm"
                                    variant="ghost"
                                    onClick={() => removeItem(list?.id, item?.id)}
                                    className="text-red-600 hover:text-red-700"
                                  >
                                    <Trash2 className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </AccordionContent>
                        </Card>
                      </AccordionItem>
                    );
                  })}
                </Accordion>
              )}
            </div>

            {/* Add New Item */}
            <div>
              <Card className="wedding-card">
                <CardHeader>
                  <CardTitle>Add Custom Task</CardTitle>
                  <CardDescription>Add a new task to your wedding checklist</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label>Category</Label>
                    <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        {DEFAULT_CHECKLIST_CATEGORIES?.map((category) => (
                          <SelectItem key={category?.name} value={category?.name}>
                            {category?.icon} {category?.name}
                          </SelectItem>
                        ))}
                        <SelectItem value="Custom">📝 Custom Category</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label>Task Title</Label>
                    <Input
                      value={newItem.title}
                      onChange={(e) => setNewItem({...newItem, title: e.target.value})}
                      placeholder="e.g., Book photographer"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Description (optional)</Label>
                    <Textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({...newItem, description: e.target.value})}
                      placeholder="Additional details about this task..."
                      rows={3}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Importance</Label>
                    <Select value={newItem.importance} onValueChange={(value) => setNewItem({...newItem, importance: value})}>
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

                  <Button onClick={addCustomItem} className="w-full">
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
