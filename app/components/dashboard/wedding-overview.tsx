
'use client';

import { motion } from 'framer-motion';
import { MapPin, Calendar, Users, PoundSterling, Globe, Heart } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';

interface WeddingOverviewProps {
  weddingDetails: any;
}

export function WeddingOverview({ weddingDetails }: WeddingOverviewProps) {
  const currencySymbol = weddingDetails?.currency === 'GBP' ? '£' 
    : weddingDetails?.currency === 'EUR' ? '€' 
    : '$';

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      <Card className="wedding-card max-w-4xl mx-auto">
        <CardContent className="p-8">
          <div className="text-center mb-6">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-green-600 mr-3" />
              <h3 className="text-2xl font-display font-bold text-gray-800">
                Your Wedding Details
              </h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {weddingDetails?.weddingLocation && (
              <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg">
                <MapPin className="h-8 w-8 text-green-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Location</p>
                  <p className="text-sm text-gray-600">{weddingDetails.weddingLocation}</p>
                </div>
              </div>
            )}

            {weddingDetails?.weddingDate && (
              <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg">
                <Calendar className="h-8 w-8 text-emerald-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Date</p>
                  <p className="text-sm text-gray-600">
                    {format(new Date(weddingDetails.weddingDate), 'MMMM dd, yyyy')}
                  </p>
                </div>
              </div>
            )}

            {weddingDetails?.guestCount && (
              <div className="flex items-center space-x-3 p-4 bg-teal-50 rounded-lg">
                <Users className="h-8 w-8 text-teal-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Guests</p>
                  <p className="text-sm text-gray-600">{weddingDetails.guestCount}</p>
                </div>
              </div>
            )}

            {weddingDetails?.budget && (
              <div className="flex items-center space-x-3 p-4 bg-lime-50 rounded-lg">
                <PoundSterling className="h-8 w-8 text-lime-600 flex-shrink-0" />
                <div>
                  <p className="font-medium text-gray-800">Budget</p>
                  <p className="text-sm text-gray-600">
                    {currencySymbol}{Number(weddingDetails.budget).toLocaleString()}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Cultural and Religious Traditions */}
          {(weddingDetails?.culturalTraditions?.length > 0 || weddingDetails?.religiousTraditions?.length > 0) && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="flex items-center mb-4">
                <Globe className="h-5 w-5 text-gray-500 mr-2" />
                <h4 className="font-medium text-gray-800">Traditions & Style</h4>
              </div>
              
              <div className="space-y-3">
                {weddingDetails?.culturalTraditions?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Cultural:</p>
                    <div className="flex flex-wrap gap-2">
                      {weddingDetails?.culturalTraditions?.map((tradition: string) => (
                        <Badge key={tradition} variant="secondary" className="bg-green-100 text-green-700">
                          {tradition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
                
                {weddingDetails?.religiousTraditions?.length > 0 && (
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Religious:</p>
                    <div className="flex flex-wrap gap-2">
                      {weddingDetails?.religiousTraditions?.map((tradition: string) => (
                        <Badge key={tradition} variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {tradition}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Wedding Style */}
          {weddingDetails?.weddingStyle && (
            <div className="mt-4 p-3 bg-teal-50 rounded-lg">
              <p className="text-sm font-medium text-gray-700 mb-1">Wedding Style:</p>
              <p className="text-gray-600">{weddingDetails.weddingStyle}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
