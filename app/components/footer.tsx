
'use client';

import { Heart, Instagram } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-auto">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="text-center">
          <div className="flex items-center justify-center mb-4">
            <Heart className="h-6 w-6 text-green-400 mr-2" />
            <h3 className="text-2xl font-display font-bold">Nuvis Planner</h3>
          </div>
          <p className="text-gray-400 mb-4">
            Intelligent wedding planning for couples worldwide
          </p>
          
          {/* Social Links & Contact */}
          <div className="flex items-center justify-center gap-6 mb-4">
            <a 
              href="https://www.instagram.com/nuvisplanner/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-400 hover:text-green-400 transition-colors"
            >
              <Instagram className="h-5 w-5" />
              <span className="text-sm">@nuvisplanner</span>
            </a>
            <Button asChild variant="ghost" size="sm" className="text-gray-400 hover:text-green-400">
              <a href="mailto:nuvisplanner@gmail.com">
                Contact Us
              </a>
            </Button>
          </div>
          
          <div className="text-sm text-gray-500">
            © 2024 Nuvis Planner. Made with love for couples worldwide.
          </div>
        </div>
      </div>
    </footer>
  );
}
