
'use client';

import { motion } from 'framer-motion';
import { Heart, Sparkles, Calendar, PoundSterling, Users, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';

export function LandingPage() {
  const features = [
    {
      icon: Sparkles,
      title: 'AI-Powered Planning',
      description: 'Get personalized recommendations and smart suggestions tailored to your unique wedding vision.',
    },
    {
      icon: PoundSterling,
      title: 'Budget Management',
      description: 'Track expenses, set budgets, and get cost estimates for all your wedding elements.',
    },
    {
      icon: Calendar,
      title: 'Timeline Planning',
      description: 'Never miss a deadline with our comprehensive wedding planning timeline and task management.',
    },
    {
      icon: Users,
      title: 'Vendor Discovery',
      description: 'Find and connect with trusted wedding vendors worldwide, all in one place.',
    },
  ];

  const benefits = [
    'Personalized AI recommendations',
    'Comprehensive budget templates',
    'Global vendor directory',
    'Timeline and task management',
    'Wedding invitation templates',
    'Vow writing assistance',
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center wedding-gradient overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-20 w-32 h-32 bg-pink-400 rounded-full blur-3xl animate-float"></div>
          <div className="absolute top-40 right-32 w-24 h-24 bg-purple-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
          <div className="absolute bottom-32 left-1/3 w-28 h-28 bg-rose-400 rounded-full blur-3xl animate-float" style={{ animationDelay: '4s' }}></div>
        </div>
        
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="max-w-4xl mx-auto"
          >
            <div className="flex items-center justify-center mb-6">
              <Heart className="h-12 w-12 text-rose-500 mr-4" />
              <h1 className="text-5xl md:text-7xl font-display font-bold romantic-text">
                WeddingPlan AI
              </h1>
            </div>
            
            <p className="text-xl md:text-2xl text-gray-700 mb-8 max-w-3xl mx-auto leading-relaxed">
              Plan your perfect wedding with intelligent assistance. From budgets to vendors, 
              we help couples worldwide create unforgettable celebrations.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Button asChild size="lg" className="rose-gradient text-white px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/auth/signup">
                  Start Planning Free <Sparkles className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              
              <Button asChild variant="outline" size="lg" className="px-8 py-4 text-lg border-2 border-rose-500 text-rose-600 hover:bg-rose-50">
                <Link href="/auth/signin">
                  Sign In
                </Link>
              </Button>
            </div>
            
            <div className="text-sm text-gray-600">
              💍 Designed for couples worldwide • Free to start • No credit card required
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
              Everything You Need to Plan Your
              <span className="romantic-text"> Perfect Day</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform simplifies wedding planning with intelligent tools and global resources.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="wedding-card h-full hover:border-rose-200">
                  <CardHeader className="text-center pb-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-4">
                      <feature.icon className="h-8 w-8 text-white" />
                    </div>
                    <CardTitle className="text-xl font-display">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center text-gray-600">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 wedding-gradient">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="text-center mb-16"
            >
              <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-800 mb-4">
                Why Couples Choose <span className="romantic-text">WeddingPlan AI</span>
              </h2>
              <p className="text-xl text-gray-600 max-w-2xl mx-auto">
                Join thousands of couples who've planned their dream weddings with our intelligent platform.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="space-y-6"
              >
                {benefits.map((benefit, index) => (
                  <div key={benefit} className="flex items-center space-x-4">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    <span className="text-lg text-gray-700">{benefit}</span>
                  </div>
                ))}
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true }}
                className="relative"
              >
                <div className="bg-white/60 backdrop-blur-sm p-8 rounded-2xl shadow-2xl">
                  <div className="text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-rose-400 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
                      <Heart className="h-10 w-10 text-white" />
                    </div>
                    <h3 className="text-2xl font-display font-bold text-gray-800 mb-4">
                      Start Your Journey
                    </h3>
                    <p className="text-gray-600 mb-6">
                      Create your account and begin planning your perfect wedding with AI-powered assistance.
                    </p>
                    <Button asChild size="lg" className="rose-gradient text-white px-8 py-3">
                      <Link href="/auth/signup">
                        Get Started Free
                      </Link>
                    </Button>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-rose-600 to-pink-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">
              Ready to Plan Your Dream Wedding?
            </h2>
            <p className="text-xl mb-8 text-rose-100 max-w-2xl mx-auto">
              Join couples worldwide who are planning stress-free, beautiful weddings with AI assistance.
            </p>
            <Button asChild size="lg" variant="secondary" className="px-8 py-4 text-lg bg-white text-rose-600 hover:bg-rose-50">
              <Link href="/auth/signup">
                Start Planning Today <Heart className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-gray-900 text-white">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <Heart className="h-8 w-8 text-rose-400 mr-2" />
              <h3 className="text-2xl font-display font-bold">WeddingPlan AI</h3>
            </div>
            <p className="text-gray-400 mb-4">
              Intelligent wedding planning for couples worldwide
            </p>
            <div className="text-sm text-gray-500">
              © 2024 WeddingPlan AI. Made with love for couples worldwide.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
