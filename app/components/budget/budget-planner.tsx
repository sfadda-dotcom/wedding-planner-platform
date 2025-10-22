
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Trash2, 
  Edit, 
  Calculator,
  TrendingUp,
  AlertCircle,
  CheckCircle,
  Save
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { Footer } from '@/components/footer';
import { toast } from 'sonner';

interface BudgetPlannerProps {
  budget: any;
  weddingDetails: any;
}

const BUDGET_CATEGORIES = [
  { name: 'Venue', icon: '🏛️', average: 40 },
  { name: 'Catering', icon: '🍽️', average: 25 },
  { name: 'Photography', icon: '📸', average: 10 },
  { name: 'Music & Entertainment', icon: '🎵', average: 8 },
  { name: 'Flowers & Decor', icon: '🌸', average: 8 },
  { name: 'Attire', icon: '👗', average: 5 },
  { name: 'Transportation', icon: '🚗', average: 2 },
  { name: 'Stationery', icon: '💌', average: 2 },
];

export function BudgetPlanner({ budget, weddingDetails }: BudgetPlannerProps) {
  const [budgetItems, setBudgetItems] = useState(budget?.items || []);
  const [totalBudget, setTotalBudget] = useState(budget?.totalBudget || weddingDetails?.budget || 0);
  const [currency] = useState(budget?.currency || weddingDetails?.currency || 'GBP');
  const [newItem, setNewItem] = useState({
    category: '',
    item: '',
    estimatedCost: '',
    priority: 'medium',
  });
  const [isLoading, setIsLoading] = useState(false);
  const [editingItem, setEditingItem] = useState<string | null>(null);

  const currencySymbol = currency === 'GBP' ? '£' : currency === 'EUR' ? '€' : '$';
  
  const totalSpent = budgetItems?.reduce((sum: number, item: any) => 
    sum + (parseFloat(item?.estimatedCost || 0)), 0) || 0;
  
  const remainingBudget = totalBudget - totalSpent;
  const budgetUsedPercentage = totalBudget > 0 ? (totalSpent / totalBudget) * 100 : 0;

  const saveBudget = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/budget', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalBudget,
          currency,
          items: budgetItems,
        }),
      });

      if (response.ok) {
        toast.success('Budget saved successfully!');
      } else {
        throw new Error('Failed to save budget');
      }
    } catch (error) {
      toast.error('Failed to save budget');
    } finally {
      setIsLoading(false);
    }
  };

  const addBudgetItem = () => {
    if (!newItem.category || !newItem.item || !newItem.estimatedCost) {
      toast.error('Please fill in all required fields');
      return;
    }

    const item = {
      id: `temp-${Date.now()}`,
      ...newItem,
      estimatedCost: parseFloat(newItem.estimatedCost),
      actualCost: null,
      isPaid: false,
    };

    setBudgetItems([...budgetItems, item]);
    setNewItem({
      category: '',
      item: '',
      estimatedCost: '',
      priority: 'medium',
    });
  };

  const removeItem = (itemId: string) => {
    setBudgetItems(budgetItems.filter((item: any) => item.id !== itemId));
  };

  const updateItem = (itemId: string, updates: any) => {
    setBudgetItems(budgetItems.map((item: any) => 
      item.id === itemId ? { ...item, ...updates } : item
    ));
    setEditingItem(null);
  };

  const generateTemplate = () => {
    if (!totalBudget) {
      toast.error('Please set your total budget first');
      return;
    }

    const templateItems = BUDGET_CATEGORIES.map(category => ({
      id: `template-${Date.now()}-${category.name}`,
      category: category.name,
      item: `${category.name} services`,
      estimatedCost: Math.round((totalBudget * category.average) / 100),
      actualCost: null,
      isPaid: false,
      priority: category.average >= 20 ? 'high' : category.average >= 10 ? 'medium' : 'low',
    }));

    setBudgetItems(templateItems);
    toast.success('Budget template generated based on global wedding averages!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50">
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
              <span className="text-green-600">Wedding Budget</span> Planner
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Plan and track your wedding expenses to stay within budget
            </p>
          </div>

          {/* Budget Overview */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <div className="h-8 w-8 mx-auto mb-2 flex items-center justify-center text-2xl font-bold text-green-500">
                  {currencySymbol}
                </div>
                <p className="text-2xl font-bold text-gray-800">
                  {currencySymbol}{Number(totalBudget || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Budget</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <p className="text-2xl font-bold text-gray-800">
                  {currencySymbol}{Number(totalSpent || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">Total Planned</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                <Calculator className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                <p className={`text-2xl font-bold ${remainingBudget >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {currencySymbol}{Math.abs(remainingBudget || 0).toLocaleString()}
                </p>
                <p className="text-sm text-gray-600">{remainingBudget >= 0 ? 'Remaining' : 'Over Budget'}</p>
              </CardContent>
            </Card>

            <Card className="wedding-card">
              <CardContent className="p-6 text-center">
                {budgetUsedPercentage <= 100 ? (
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                ) : (
                  <AlertCircle className="h-8 w-8 text-red-500 mx-auto mb-2" />
                )}
                <p className={`text-2xl font-bold ${budgetUsedPercentage <= 100 ? 'text-green-600' : 'text-red-600'}`}>
                  {Math.round(budgetUsedPercentage)}%
                </p>
                <p className="text-sm text-gray-600">Budget Used</p>
              </CardContent>
            </Card>
          </div>

          {/* Budget Progress */}
          <Card className="wedding-card mb-8">
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">Budget Progress</h3>
                <Badge variant={budgetUsedPercentage <= 100 ? "secondary" : "destructive"}>
                  {budgetUsedPercentage <= 100 ? 'On Track' : 'Over Budget'}
                </Badge>
              </div>
              <Progress value={Math.min(budgetUsedPercentage, 100)} className="h-3 mb-2" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>{currencySymbol}0</span>
                <span>{currencySymbol}{Number(totalBudget || 0).toLocaleString()}</span>
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Budget Items List */}
            <Card className="wedding-card">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Budget Items</CardTitle>
                    <CardDescription>Track your wedding expenses by category</CardDescription>
                  </div>
                  <div className="space-x-2">
                    <Button onClick={generateTemplate} variant="outline" size="sm">
                      Generate Template
                    </Button>
                    <Button onClick={saveBudget} disabled={isLoading} size="sm">
                      <Save className="h-4 w-4 mr-2" />
                      Save Budget
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {budgetItems?.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">
                    <Calculator className="h-12 w-12 mx-auto mb-4 text-gray-400" />
                    <p>No budget items yet. Add some items or generate a template!</p>
                  </div>
                ) : (
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {budgetItems?.map((item: any) => (
                      <div key={item?.id} className="p-4 bg-gray-50 rounded-lg">
                        {editingItem === item?.id ? (
                          <div className="space-y-3">
                            <Input
                              value={item?.item}
                              onChange={(e) => updateItem(item?.id, { item: e.target.value })}
                              placeholder="Item name"
                            />
                            <Input
                              type="number"
                              value={item?.estimatedCost}
                              onChange={(e) => updateItem(item?.id, { estimatedCost: parseFloat(e.target.value) || 0 })}
                              placeholder="Cost"
                            />
                            <div className="flex space-x-2">
                              <Button size="sm" onClick={() => setEditingItem(null)}>
                                Done
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <div className="flex items-center space-x-2">
                                <span className="text-2xl">{BUDGET_CATEGORIES.find(cat => cat.name === item?.category)?.icon || '💰'}</span>
                                <div>
                                  <h4 className="font-medium text-gray-800">{item?.item}</h4>
                                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                                    <span>{item?.category}</span>
                                    <Badge variant="secondary" className="text-xs">
                                      {item?.priority}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-semibold text-gray-800">
                                {currencySymbol}{Number(item?.estimatedCost || 0).toLocaleString()}
                              </p>
                              <div className="flex items-center space-x-2 mt-1">
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => setEditingItem(item?.id)}
                                >
                                  <Edit className="h-3 w-3" />
                                </Button>
                                <Button
                                  size="sm"
                                  variant="ghost"
                                  onClick={() => removeItem(item?.id)}
                                  className="text-red-600"
                                >
                                  <Trash2 className="h-3 w-3" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Add New Item */}
            <Card className="wedding-card">
              <CardHeader>
                <CardTitle>Add Budget Item</CardTitle>
                <CardDescription>Add a new expense to your wedding budget</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Total Budget</Label>
                  <Input
                    type="number"
                    value={totalBudget}
                    onChange={(e) => setTotalBudget(parseFloat(e.target.value) || 0)}
                    placeholder="Enter your total wedding budget"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Category</Label>
                  <Select value={newItem.category} onValueChange={(value) => setNewItem({...newItem, category: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {BUDGET_CATEGORIES.map((category) => (
                        <SelectItem key={category.name} value={category.name}>
                          {category.icon} {category.name}
                        </SelectItem>
                      ))}
                      <SelectItem value="Other">💡 Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label>Item Description</Label>
                  <Input
                    value={newItem.item}
                    onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                    placeholder="e.g., Wedding venue booking"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Estimated Cost</Label>
                  <Input
                    type="number"
                    value={newItem.estimatedCost}
                    onChange={(e) => setNewItem({...newItem, estimatedCost: e.target.value})}
                    placeholder="0"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Priority</Label>
                  <Select value={newItem.priority} onValueChange={(value) => setNewItem({...newItem, priority: value})}>
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

                <Button onClick={addBudgetItem} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
