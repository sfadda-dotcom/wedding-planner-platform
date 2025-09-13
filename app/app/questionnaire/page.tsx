
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { motion } from 'framer-motion';
import { 
  Heart, 
  MapPin, 
  Calendar, 
  Users, 
  PoundSterling,
  Globe,
  Church,
  PartyPopper,
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const GUEST_COUNT_OPTIONS = [
  { value: '1-50', label: '1-50 guests (Intimate)' },
  { value: '50-100', label: '50-100 guests (Medium)' },
  { value: '100-150', label: '100-150 guests (Large)' },
  { value: '150-200', label: '150-200 guests (Very Large)' },
  { value: '200+', label: '200+ guests (Grand)' },
];

const CURRENCY_OPTIONS = [
  { value: 'GBP', label: '£ British Pound' },
  { value: 'EUR', label: '€ Euro' },
  { value: 'USD', label: '$ US Dollar' },
];

const CULTURAL_TRADITIONS = [
  'African', 'Middle Eastern', 'South Asian', 'East Asian', 
  'South American', 'Caribbean', 'European', 'Other'
];

const RELIGIOUS_TRADITIONS = [
  'Christian', 'Jewish', 'Islamic', 'Hindu', 'Buddhist', 
  'Sikh', 'Secular/Non-religious', 'Other'
];

const WEDDING_EVENTS = [
  { id: 'engagement-party', label: 'Engagement Party' },
  { id: 'wedding-shower', label: 'Wedding Shower/Bridal Shower' },
  { id: 'bachelor-party', label: 'Bachelor/Bachelorette Party' },
  { id: 'welcome-party', label: 'Welcome Party' },
  { id: 'rehearsal-dinner', label: 'Rehearsal Dinner' },
  { id: 'ceremony', label: 'Wedding Ceremony' },
  { id: 'reception', label: 'Wedding Reception' },
  { id: 'after-party', label: 'After Party' },
  { id: 'lazo-ceremony', label: 'Lazo Ceremony' },
  { id: 'polterabend', label: 'Polterabend' },
  { id: 'henna-party', label: 'Henna/Mehndi Party' },
  { id: 'other-cultural', label: 'Other Cultural Events' },
  { id: 'other-religious', label: 'Other Religious Events' },
];

export default function QuestionnairePage() {
  const { data: session } = useSession() || {};
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  
  const [formData, setFormData] = useState({
    partnerOneName: '',
    partnerTwoName: '',
    weddingLocation: '',
    weddingDate: '',
    guestCount: '',
    budget: '',
    currency: 'GBP',
    culturalTraditions: [] as string[],
    religiousTraditions: [] as string[],
    plannedEvents: [] as string[],
    weddingStyle: '',
    venueType: '',
    specialRequirements: '',
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayToggle = (field: 'culturalTraditions' | 'religiousTraditions' | 'plannedEvents', value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/questionnaire', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        toast.success('Wedding details saved! Let\'s start planning your perfect day.');
        router.replace('/dashboard');
      } else {
        const error = await response.json();
        toast.error(error.message || 'Failed to save details');
      }
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Heart className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                Let's Get to Know You
              </h2>
              <p className="text-gray-600">Tell us about the happy couple</p>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">First Partner's Name</Label>
                <Input
                  value={formData.partnerOneName}
                  onChange={(e) => handleInputChange('partnerOneName', e.target.value)}
                  placeholder="Enter first partner's name"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Second Partner's Name</Label>
                <Input
                  value={formData.partnerTwoName}
                  onChange={(e) => handleInputChange('partnerTwoName', e.target.value)}
                  placeholder="Enter second partner's name"
                  className="h-12"
                />
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <MapPin className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                Where & When
              </h2>
              <p className="text-gray-600">Tell us about your special day</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Wedding Location</Label>
                <Input
                  value={formData.weddingLocation}
                  onChange={(e) => handleInputChange('weddingLocation', e.target.value)}
                  placeholder="e.g., London, Manchester, or specific venue"
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Wedding Date (approximate)</Label>
                <Input
                  type="date"
                  value={formData.weddingDate}
                  onChange={(e) => handleInputChange('weddingDate', e.target.value)}
                  className="h-12"
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-700 font-medium">Number of Guests</Label>
                <Select value={formData.guestCount} onValueChange={(value) => handleInputChange('guestCount', value)}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select guest count range" />
                  </SelectTrigger>
                  <SelectContent>
                    {GUEST_COUNT_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <PoundSterling className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                Budget Planning
              </h2>
              <p className="text-gray-600">Let's talk about your wedding budget</p>
            </div>

            <div className="space-y-6">
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-1 space-y-2">
                  <Label className="text-gray-700 font-medium">Currency</Label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectTrigger className="h-12">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CURRENCY_OPTIONS.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="col-span-2 space-y-2">
                  <Label className="text-gray-700 font-medium">Total Budget</Label>
                  <Input
                    type="number"
                    value={formData.budget}
                    onChange={(e) => handleInputChange('budget', e.target.value)}
                    placeholder="Enter your total wedding budget"
                    className="h-12"
                  />
                </div>
              </div>

              <div className="bg-rose-50 p-4 rounded-lg">
                <p className="text-sm text-rose-700">
                  💡 Don't worry if you're not sure about the exact amount. 
                  We'll help you create a detailed budget breakdown based on your preferences.
                </p>
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Globe className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                Cultural Traditions
              </h2>
              <p className="text-gray-600">Tell us about your cultural background</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-gray-700 font-medium text-lg">Cultural Heritage (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {CULTURAL_TRADITIONS.map((tradition) => (
                    <div key={tradition} className="flex items-center space-x-3">
                      <Checkbox
                        id={tradition}
                        checked={formData.culturalTraditions.includes(tradition)}
                        onCheckedChange={() => handleArrayToggle('culturalTraditions', tradition)}
                      />
                      <Label htmlFor={tradition} className="text-gray-700">
                        {tradition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 5:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <Church className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                Religious Traditions
              </h2>
              <p className="text-gray-600">Share your religious preferences</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-gray-700 font-medium text-lg">Religious Traditions (select all that apply)</Label>
                <div className="grid grid-cols-2 gap-3">
                  {RELIGIOUS_TRADITIONS.map((tradition) => (
                    <div key={tradition} className="flex items-center space-x-3">
                      <Checkbox
                        id={tradition}
                        checked={formData.religiousTraditions.includes(tradition)}
                        onCheckedChange={() => handleArrayToggle('religiousTraditions', tradition)}
                      />
                      <Label htmlFor={tradition} className="text-gray-700">
                        {tradition}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );

      case 6:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <PartyPopper className="h-16 w-16 text-rose-500 mx-auto mb-4" />
              <h2 className="text-3xl font-display font-bold text-gray-800 mb-2">
                Wedding Events
              </h2>
              <p className="text-gray-600">What events would you like to include?</p>
            </div>

            <div className="space-y-6">
              <div className="space-y-4">
                <Label className="text-gray-700 font-medium text-lg">Planned Events (select all that apply)</Label>
                <div className="grid grid-cols-1 gap-3">
                  {WEDDING_EVENTS.map((event) => (
                    <div key={event.id} className="flex items-center space-x-3">
                      <Checkbox
                        id={event.id}
                        checked={formData.plannedEvents.includes(event.id)}
                        onCheckedChange={() => handleArrayToggle('plannedEvents', event.id)}
                      />
                      <Label htmlFor={event.id} className="text-gray-700">
                        {event.label}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Wedding Style (optional)</Label>
                  <Input
                    value={formData.weddingStyle}
                    onChange={(e) => handleInputChange('weddingStyle', e.target.value)}
                    placeholder="e.g., Rustic, Modern, Vintage, Garden Party"
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-700 font-medium">Special Requirements (optional)</Label>
                  <Textarea
                    value={formData.specialRequirements}
                    onChange={(e) => handleInputChange('specialRequirements', e.target.value)}
                    placeholder="Any special dietary requirements, accessibility needs, or other important details..."
                    className="min-h-[100px]"
                  />
                </div>
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen wedding-gradient p-4">
      <div className="container mx-auto max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex items-center justify-center mb-4">
              <div className="text-center">
                <h1 className="text-2xl font-display font-bold text-gray-800 mb-2">
                  Wedding Planning Questionnaire
                </h1>
                <p className="text-gray-600">Step {currentStep} of {totalSteps}</p>
              </div>
            </div>
            
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-gradient-to-r from-rose-500 to-pink-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${(currentStep / totalSteps) * 100}%` }}
              />
            </div>
          </div>

          {/* Form Content */}
          <Card className="wedding-card border-0 shadow-2xl">
            <CardContent className="p-8">
              {renderStep()}

              {/* Navigation Buttons */}
              <div className="flex justify-between mt-8 pt-6 border-t border-gray-200">
                <Button
                  onClick={prevStep}
                  variant="outline"
                  disabled={currentStep === 1}
                  className="flex items-center space-x-2"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Previous</span>
                </Button>

                <Button
                  onClick={nextStep}
                  disabled={isLoading}
                  className="rose-gradient text-white flex items-center space-x-2"
                >
                  <span>
                    {currentStep === totalSteps 
                      ? (isLoading ? 'Saving...' : 'Complete Setup') 
                      : 'Next'
                    }
                  </span>
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
