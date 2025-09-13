
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { VendorSearch } from '@/components/vendor-research/vendor-search';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Search, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default async function VendorsPage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect('/auth/signin');
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6 max-w-7xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button asChild variant="outline" size="sm">
                <Link href="/dashboard">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
              <div>
                <h1 className="text-3xl font-display font-bold text-gray-800">
                  Vendor Research
                </h1>
                <p className="text-gray-600">
                  Discover wedding vendors worldwide with real-time search
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Globe className="h-4 w-4" />
              <span>Worldwide coverage</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Info Card */}
        <Card className="mb-8 border-0 shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Search className="h-5 w-5 text-blue-600" />
              <span className="text-blue-800">Powered by AI & Real-Time Search</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold text-blue-800 mb-2">How it works:</h3>
                <ul className="text-sm text-blue-700 space-y-1">
                  <li>• Search vendors worldwide in real-time</li>
                  <li>• AI-powered recommendations based on your preferences</li>
                  <li>• Continuously updated vendor database</li>
                  <li>• Compare prices, reviews, and portfolios</li>
                </ul>
              </div>
              <div className="bg-white/50 rounded-lg p-4">
                <h3 className="font-semibold text-blue-800 mb-2">Integration Ready:</h3>
                <p className="text-sm text-blue-700">
                  This platform is designed to integrate seamlessly with your n8n workflows 
                  for automated vendor discovery and comparison. API endpoints are ready 
                  for your custom automation needs.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Vendor Search Component */}
        <VendorSearch />
      </div>
    </div>
  );
}
