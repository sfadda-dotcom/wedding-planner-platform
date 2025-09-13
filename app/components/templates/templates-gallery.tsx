
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Heart, Copy, Download, Eye, Edit } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { DashboardHeader } from '@/components/dashboard/dashboard-header';
import { toast } from 'sonner';

interface TemplatesGalleryProps {
  invitationTemplates: any[];
  vowTemplates: any[];
}

export function TemplatesGallery({ invitationTemplates, vowTemplates }: TemplatesGalleryProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<any>(null);
  const [customizedContent, setCustomizedContent] = useState('');

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Template copied to clipboard!');
  };

  const personalizeTemplate = (template: any) => {
    setSelectedTemplate(template);
    setCustomizedContent(template?.content || '');
  };

  const TemplateCard = ({ template }: { template: any }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="wedding-card h-full hover:border-rose-200 group">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between mb-2">
            <div className="w-12 h-12 bg-gradient-to-br from-rose-400 to-pink-500 rounded-lg flex items-center justify-center">
              {template?.type === 'invitation' ? (
                <Mail className="h-6 w-6 text-white" />
              ) : (
                <Heart className="h-6 w-6 text-white" />
              )}
            </div>
            <Badge variant="secondary" className="text-xs">
              {template?.style || 'Classic'}
            </Badge>
          </div>
          <CardTitle className="text-lg group-hover:text-rose-600 transition-colors">
            {template?.title}
          </CardTitle>
          <CardDescription>
            {template?.category && `${template.category} • `}
            {template?.tags?.join(', ') || 'Wedding template'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="bg-gray-50 p-4 rounded-lg mb-4 text-sm text-gray-700 line-clamp-4">
            {template?.content?.substring(0, 150)}...
          </div>
          
          <div className="flex items-center space-x-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex-1">
                  <Eye className="h-3 w-3 mr-1" />
                  Preview
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-2xl">
                <DialogHeader>
                  <DialogTitle>{template?.title}</DialogTitle>
                  <DialogDescription>
                    Preview this {template?.type} template
                  </DialogDescription>
                </DialogHeader>
                <div className="bg-white p-6 rounded-lg border border-gray-200 max-h-96 overflow-y-auto">
                  <pre className="whitespace-pre-wrap text-gray-700 font-serif leading-relaxed">
                    {template?.content}
                  </pre>
                </div>
                <div className="flex space-x-2 pt-4">
                  <Button onClick={() => copyToClipboard(template?.content)} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Template
                  </Button>
                  <Button onClick={() => personalizeTemplate(template)} variant="outline" className="flex-1">
                    <Edit className="h-4 w-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
            
            <Button 
              size="sm" 
              onClick={() => copyToClipboard(template?.content)}
              className="bg-rose-500 hover:bg-rose-600 text-white"
            >
              <Copy className="h-3 w-3" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      <DashboardHeader user={{ name: 'Wedding Planner' }} />
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Wedding <span className="romantic-text">Templates</span>
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Beautiful, customizable templates for invitations, vows, and more
            </p>
          </div>

          <Tabs defaultValue="invitations" className="w-full">
            <TabsList className="grid w-full grid-cols-2 max-w-md mx-auto mb-8">
              <TabsTrigger value="invitations" className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>Invitations</span>
              </TabsTrigger>
              <TabsTrigger value="vows" className="flex items-center space-x-2">
                <Heart className="h-4 w-4" />
                <span>Vows</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="invitations" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
                  Wedding Invitation Templates
                </h2>
                <p className="text-gray-600">
                  Create beautiful invitations for your special day
                </p>
              </div>
              
              {invitationTemplates?.length === 0 ? (
                <Card className="wedding-card">
                  <CardContent className="p-12 text-center">
                    <Mail className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No invitation templates yet</h3>
                    <p className="text-gray-500">Templates will be available soon!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {invitationTemplates?.map((template) => (
                    <TemplateCard key={template?.id} template={template} />
                  ))}
                </div>
              )}
            </TabsContent>

            <TabsContent value="vows" className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-2xl font-display font-bold text-gray-800 mb-2">
                  Wedding Vow Templates
                </h2>
                <p className="text-gray-600">
                  Find inspiration for your perfect wedding vows
                </p>
              </div>
              
              {vowTemplates?.length === 0 ? (
                <Card className="wedding-card">
                  <CardContent className="p-12 text-center">
                    <Heart className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No vow templates yet</h3>
                    <p className="text-gray-500">Templates will be available soon!</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {vowTemplates?.map((template) => (
                    <TemplateCard key={template?.id} template={template} />
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Template Customizer Modal */}
          {selectedTemplate && (
            <Dialog open={!!selectedTemplate} onOpenChange={() => setSelectedTemplate(null)}>
              <DialogContent className="max-w-4xl max-h-[80vh]">
                <DialogHeader>
                  <DialogTitle>Customize: {selectedTemplate?.title}</DialogTitle>
                  <DialogDescription>
                    Edit the template to match your wedding style and preferences
                  </DialogDescription>
                </DialogHeader>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Edit Template</h3>
                    <Textarea
                      value={customizedContent}
                      onChange={(e) => setCustomizedContent(e.target.value)}
                      className="min-h-[300px] font-serif"
                      placeholder="Customize your template here..."
                    />
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-800">Preview</h3>
                    <div className="bg-white p-6 border border-gray-200 rounded-lg min-h-[300px] overflow-y-auto">
                      <pre className="whitespace-pre-wrap text-gray-700 font-serif leading-relaxed text-sm">
                        {customizedContent}
                      </pre>
                    </div>
                  </div>
                </div>
                
                <div className="flex space-x-2 pt-4">
                  <Button onClick={() => copyToClipboard(customizedContent)} className="flex-1">
                    <Copy className="h-4 w-4 mr-2" />
                    Copy Customized Version
                  </Button>
                  <Button onClick={() => setSelectedTemplate(null)} variant="outline">
                    Done
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </motion.div>
      </div>
    </div>
  );
}
