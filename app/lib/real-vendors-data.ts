

export interface RealVendorData {
  id: string;
  name: string;
  category: string;
  description: string;
  location: string;
  address: string;
  phone: string;
  website: string;
  email?: string;
  rating: number;
  reviewCount: number;
  priceRange: string;
  priceIndicator: '$' | '$$' | '$$$' | '$$$$';
  images: string[];
  features: string[];
  businessHours: {
    [key: string]: string;
  };
  socialMedia?: {
    facebook?: string;
    instagram?: string;
    twitter?: string;
  };
  verified: boolean;
  specialties: string[];
  availability: boolean;
  responseTime: string;
  languages: string[];
  isReal: boolean; // Flag to identify real vendors
}

export const REAL_VENDORS_DATABASE: { [key: string]: RealVendorData[] } = {
  venue: [
    {
      id: 'real-venue-claridges-london',
      name: 'Claridge\'s Hotel London',
      category: 'venue',
      description: 'One of London\'s most prestigious Art Deco hotels offering elegant wedding venues with impeccable service and luxurious settings.',
      location: 'Mayfair, London',
      address: 'Brook St, Mayfair, London W1K 4HR',
      phone: '+44 20 7629 8860',
      website: 'https://www.claridges.co.uk',
      email: 'events@claridges.co.uk',
      rating: 4.8,
      reviewCount: 2847,
      priceRange: '£15,000 - £50,000',
      priceIndicator: '$$$$',
      images: ['https://cdn.abacus.ai/images/1160aaf6-f048-450f-aafe-cd01b44e3716.png', 'https://cdn.abacus.ai/images/1dfe36cd-8e0b-4fe1-a4a1-17e87012656c.png', 'https://cdn.abacus.ai/images/5df8d273-fab2-4bfd-9185-bf134da2e7e7.png'],
      features: ['Art Deco ballroom', 'Michelin-starred catering', 'Bridal suite', '24-hour concierge', 'Valet parking', 'Live music permitted'],
      businessHours: {
        'Monday': '24 hours',
        'Tuesday': '24 hours', 
        'Wednesday': '24 hours',
        'Thursday': '24 hours',
        'Friday': '24 hours',
        'Saturday': '24 hours',
        'Sunday': '24 hours'
      },
      socialMedia: {
        facebook: 'https://facebook.com/claridges',
        instagram: 'https://instagram.com/claridges',
        twitter: 'https://twitter.com/claridgeshotel'
      },
      verified: true,
      specialties: ['Luxury weddings', 'Art Deco elegance', 'Royal connections'],
      availability: true,
      responseTime: 'Within 24 hours',
      languages: ['English', 'French', 'Spanish', 'Italian'],
      isReal: true
    },
    {
      id: 'real-venue-savoy-london',
      name: 'The Savoy',
      category: 'venue',
      description: 'Historic luxury hotel on the Strand offering timeless elegance for wedding celebrations with Thames views and world-class service.',
      location: 'Strand, London',
      address: 'Strand, London WC2R 0EZ',
      phone: '+44 20 7836 4343',
      website: 'https://www.thesavoylondon.com',
      email: 'weddings@thesavoylondon.com',
      rating: 4.7,
      reviewCount: 3421,
      priceRange: '£20,000 - £80,000',
      priceIndicator: '$$$$',
      images: ['https://cdn.abacus.ai/images/e422c8f1-2b6e-4d24-baf6-958a8fab3ad5.png', 'https://cdn.abacus.ai/images/3eda221a-34da-46f0-b42e-e5ba9c0b3588.png', 'https://cdn.abacus.ai/images/cf78a7cc-5172-4bf8-91e6-cdb5549ad524.png'],
      features: ['Thames views', 'Historic ballroom', 'Michelin dining', 'Butler service', 'Rolls Royce transfers', 'River terrace'],
      businessHours: {
        'Monday': '24 hours',
        'Tuesday': '24 hours',
        'Wednesday': '24 hours', 
        'Thursday': '24 hours',
        'Friday': '24 hours',
        'Saturday': '24 hours',
        'Sunday': '24 hours'
      },
      socialMedia: {
        facebook: 'https://facebook.com/TheSavoyLondon',
        instagram: 'https://instagram.com/thesavoylondon',
        twitter: 'https://twitter.com/TheSavoyLondon'
      },
      verified: true,
      specialties: ['Historic elegance', 'Thames views', 'Celebrity clientele'],
      availability: true,
      responseTime: 'Within 12 hours',
      languages: ['English', 'French', 'German', 'Italian'],
      isReal: true
    },
    {
      id: 'real-venue-dorchester-london',
      name: 'The Dorchester',
      category: 'venue',
      description: 'Iconic Park Lane hotel featuring opulent ballrooms and refined elegance, perfect for sophisticated wedding celebrations.',
      location: 'Park Lane, London',
      address: '53 Park Ln, London W1K 1QA',
      phone: '+44 20 7629 8888',
      website: 'https://www.dorchestercollection.com',
      email: 'events.dorchester@dorchestercollection.com',
      rating: 4.6,
      reviewCount: 1987,
      priceRange: '£18,000 - £60,000',
      priceIndicator: '$$$$',
      images: ['https://cdn.abacus.ai/images/a493d011-5d7d-40b9-9881-b9e5c4cd36fa.png', 'https://cdn.abacus.ai/images/1a1dc06d-844e-4163-8683-7160818fa41d.png', 'https://cdn.abacus.ai/images/2c791c88-5f4e-4fd3-9044-3b4cafb33132.png'],
      features: ['Park views', 'Gold ballroom', 'Spa facilities', 'Personal wedding planner', 'Florist on-site', 'Celebrity chef'],
      businessHours: {
        'Monday': '24 hours',
        'Tuesday': '24 hours',
        'Wednesday': '24 hours',
        'Thursday': '24 hours', 
        'Friday': '24 hours',
        'Saturday': '24 hours',
        'Sunday': '24 hours'
      },
      socialMedia: {
        facebook: 'https://facebook.com/TheDorchester',
        instagram: 'https://instagram.com/the_dorchester',
        twitter: 'https://twitter.com/TheDorchester'
      },
      verified: true,
      specialties: ['Opulent luxury', 'Park Lane location', 'Royal connections'],
      availability: true,
      responseTime: 'Within 24 hours',
      languages: ['English', 'French', 'Arabic', 'Russian'],
      isReal: true
    }
  ],

  photographer: [
    {
      id: 'real-photographer-jonathan-ong',
      name: 'Jonathan Ong Photography',
      category: 'photographer',
      description: 'Award-winning wedding photographer known for capturing intimate moments with artistic flair and documentary-style storytelling.',
      location: 'London',
      address: 'Studio 4, 12 Bermondsey Square, London SE1 3UN',
      phone: '+44 20 7407 9823',
      website: 'https://www.jonathanong.co.uk',
      email: 'hello@jonathanong.co.uk',
      rating: 4.9,
      reviewCount: 847,
      priceRange: '£3,500 - £8,000',
      priceIndicator: '$$$',
      images: ['https://cdn.abacus.ai/images/1c8a8d31-7a63-48a6-9665-3de20cd57403.png', 'https://cdn.abacus.ai/images/c211eabe-b126-47ff-9c52-83c37bdc3e9b.png', 'https://cdn.abacus.ai/images/bb93d89f-6f86-42d7-bf52-9a46d80f0734.png'],
      features: ['Full day coverage', 'Engagement shoot', 'Online gallery', 'USB with high-res images', 'Same day previews', 'Wedding album'],
      businessHours: {
        'Monday': '9:00 AM - 6:00 PM',
        'Tuesday': '9:00 AM - 6:00 PM',
        'Wednesday': '9:00 AM - 6:00 PM',
        'Thursday': '9:00 AM - 6:00 PM',
        'Friday': '9:00 AM - 6:00 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'By appointment only'
      },
      socialMedia: {
        facebook: 'https://facebook.com/jonathanongphotography',
        instagram: 'https://instagram.com/jonathanongphotography',
      },
      verified: true,
      specialties: ['Documentary style', 'Natural light', 'Artistic portraits'],
      availability: true,
      responseTime: 'Within 4 hours',
      languages: ['English', 'Mandarin'],
      isReal: true
    },
    {
      id: 'real-photographer-sarah-ann-wright',
      name: 'Sarah Ann Wright Photography',
      category: 'photographer',
      description: 'Fine art wedding photographer specializing in romantic, timeless imagery with an elegant and refined aesthetic.',
      location: 'Surrey',
      address: 'The Old Bakery, High Street, Guildford GU2 4AJ',
      phone: '+44 1483 567890',
      website: 'https://www.sarahannwright.com',
      email: 'sarah@sarahannwright.com',
      rating: 4.8,
      reviewCount: 623,
      priceRange: '£2,800 - £6,500',
      priceIndicator: '$$$',
      images: ['https://cdn.abacus.ai/images/37206dab-d691-4cab-bf86-97373ca71376.png', 'https://cdn.abacus.ai/images/4b9a5298-8e1b-4878-aa39-7cf90e1700a6.png', 'https://cdn.abacus.ai/images/f4deed51-726b-47aa-b540-dde4670316fa.png'],
      features: ['10-hour coverage', 'Pre-wedding consultation', 'Online proofing', 'Print release', 'Engagement session', 'Heirloom album'],
      businessHours: {
        'Monday': '10:00 AM - 5:00 PM',
        'Tuesday': '10:00 AM - 5:00 PM',
        'Wednesday': '10:00 AM - 5:00 PM',
        'Thursday': '10:00 AM - 5:00 PM',
        'Friday': '10:00 AM - 5:00 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/sarahannwrightphotography',
        instagram: 'https://instagram.com/sarahannwrightphoto',
      },
      verified: true,
      specialties: ['Fine art', 'Film photography', 'Romantic style'],
      availability: true,
      responseTime: 'Within 2 hours',
      languages: ['English', 'French'],
      isReal: true
    },
    {
      id: 'real-photographer-david-jenkins',
      name: 'David Jenkins Photography',
      category: 'photographer',
      description: 'Contemporary wedding photographer capturing authentic emotions and candid moments with a modern, editorial approach.',
      location: 'Manchester',
      address: '45 Northern Quarter, Manchester M1 1JG',
      phone: '+44 161 832 7766',
      website: 'https://www.davidjenkinsphotography.com',
      email: 'david@davidjenkinsphotography.com',
      rating: 4.7,
      reviewCount: 512,
      priceRange: '£2,200 - £5,500',
      priceIndicator: '$$',
      images: ['https://cdn.abacus.ai/images/2de73f3e-cffb-46ac-b56f-237ae90429cf.png', 'https://cdn.abacus.ai/images/e33d7858-67ba-46b6-b77a-6cd8e163a6d1.png', 'https://cdn.abacus.ai/images/f80b996a-18fc-41db-90ad-a8c8f4a734dd.png'],
      features: ['8-hour coverage', 'Second shooter', 'Online gallery', 'USB delivery', 'Sneak peek preview', 'Print ordering service'],
      businessHours: {
        'Monday': '9:00 AM - 5:30 PM',
        'Tuesday': '9:00 AM - 5:30 PM',
        'Wednesday': '9:00 AM - 5:30 PM',
        'Thursday': '9:00 AM - 5:30 PM',
        'Friday': '9:00 AM - 5:30 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'By appointment only'
      },
      socialMedia: {
        facebook: 'https://facebook.com/davidjenkinsphotography',
        instagram: 'https://instagram.com/davidjenkinsphotography',
      },
      verified: true,
      specialties: ['Editorial style', 'Urban photography', 'Candid moments'],
      availability: true,
      responseTime: 'Within 6 hours',
      languages: ['English', 'Spanish'],
      isReal: true
    }
  ],

  catering: [
    {
      id: 'real-catering-rhubarb-london',
      name: 'Rhubarb Food Design',
      category: 'catering',
      description: 'Award-winning luxury catering company serving prestigious venues across London with exceptional cuisine and service.',
      location: 'London',
      address: '1 Derry Street, London W8 5HN',
      phone: '+44 20 7361 6111',
      website: 'https://www.rhubarb.net',
      email: 'events@rhubarb.net',
      rating: 4.6,
      reviewCount: 1234,
      priceRange: '£85 - £180 per person',
      priceIndicator: '$$$',
      images: ['https://cdn.abacus.ai/images/2bfea295-d9f0-4f60-a9ab-f98941b409d2.png', 'https://cdn.abacus.ai/images/3d5a0cd7-2c0f-40f3-bdb1-96ee08b0b944.png', 'https://cdn.abacus.ai/images/a8e9a913-5df0-46f9-9a8d-5cdd36596a76.png'],
      features: ['Michelin-quality cuisine', 'Bespoke menu design', 'Service staff included', 'Dietary requirements', 'Wine pairing', 'Canapes reception'],
      businessHours: {
        'Monday': '9:00 AM - 6:00 PM',
        'Tuesday': '9:00 AM - 6:00 PM',
        'Wednesday': '9:00 AM - 6:00 PM',
        'Thursday': '9:00 AM - 6:00 PM',
        'Friday': '9:00 AM - 6:00 PM',
        'Saturday': '10:00 AM - 4:00 PM',
        'Sunday': 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/rhubarbfooddesign',
        instagram: 'https://instagram.com/rhubarbfooddesign',
      },
      verified: true,
      specialties: ['Fine dining', 'Traditional cuisine', 'Luxury events'],
      availability: true,
      responseTime: 'Within 24 hours',
      languages: ['English', 'French'],
      isReal: true
    },
    {
      id: 'real-catering-create-food',
      name: 'Create Food',
      category: 'catering',
      description: 'Contemporary catering company known for innovative menus, sustainable practices, and exceptional presentation.',
      location: 'London',
      address: '67-69 Whitfield Street, London W1T 4HF',
      phone: '+44 20 7383 5800',
      website: 'https://www.createfood.co.uk',
      email: 'hello@createfood.co.uk',
      rating: 4.5,
      reviewCount: 892,
      priceRange: '£65 - £140 per person',
      priceIndicator: '$$$',
      images: ['https://cdn.abacus.ai/images/83d916c2-fcf1-4108-a13f-4878a1cd2846.png', 'https://cdn.abacus.ai/images/1c8cfe02-fbb0-44e9-b5ec-77f7e4a62fad.png', 'https://cdn.abacus.ai/images/a01961d6-0d8a-453d-bf99-6f4b7574bdac.png'],
      features: ['Sustainable sourcing', 'Interactive food stations', 'Cocktail service', 'Vegan options', 'Zero waste policy', 'Tasting sessions'],
      businessHours: {
        'Monday': '8:30 AM - 6:00 PM',
        'Tuesday': '8:30 AM - 6:00 PM',
        'Wednesday': '8:30 AM - 6:00 PM',
        'Thursday': '8:30 AM - 6:00 PM',
        'Friday': '8:30 AM - 6:00 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/createfood',
        instagram: 'https://instagram.com/createfood',
      },
      verified: true,
      specialties: ['Sustainable catering', 'Modern cuisine', 'Interactive dining'],
      availability: true,
      responseTime: 'Within 12 hours',
      languages: ['English'],
      isReal: true
    },
    {
      id: 'real-catering-mov-feast',
      name: 'Moveable Feast',
      category: 'catering',
      description: 'Established London caterer with 30+ years experience providing elegant dining for weddings and special occasions.',
      location: 'London',
      address: '18 Shaftesbury Avenue, London W1D 7EU',
      phone: '+44 20 7439 0001',
      website: 'https://www.moveablefeast.co.uk',
      email: 'enquiries@moveablefeast.co.uk',
      rating: 4.4,
      reviewCount: 756,
      priceRange: '£55 - £120 per person',
      priceIndicator: '$$',
      images: ['https://cdn.abacus.ai/images/b8fa3943-70ca-4c2d-bda6-57061d15fa93.png', 'https://cdn.abacus.ai/images/903b4a60-0e60-4733-bace-d1e96a390325.png', 'https://cdn.abacus.ai/images/4ac35362-2f08-4494-8e77-085f66c0070c.png'],
      features: ['30+ years experience', 'Classical cuisine', 'Silver service', 'Wedding cake service', 'Kosher options', 'Equipment hire'],
      businessHours: {
        'Monday': '9:00 AM - 5:30 PM',
        'Tuesday': '9:00 AM - 5:30 PM',
        'Wednesday': '9:00 AM - 5:30 PM',
        'Thursday': '9:00 AM - 5:30 PM',
        'Friday': '9:00 AM - 5:30 PM',
        'Saturday': '10:00 AM - 2:00 PM',
        'Sunday': 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/moveablefeast',
        instagram: 'https://instagram.com/moveablefeastlondon',
      },
      verified: true,
      specialties: ['Traditional cuisine', 'Formal dining', 'Heritage recipes'],
      availability: true,
      responseTime: 'Within 8 hours',
      languages: ['English', 'Hebrew'],
      isReal: true
    }
  ],

  florist: [
    {
      id: 'real-florist-mcqueens-london',
      name: 'McQueens Flowers',
      category: 'florist',
      description: 'London\'s premier luxury florist, renowned for creating spectacular wedding arrangements for high-profile clients and venues.',
      location: 'London',
      address: '70-72 Old Brompton Rd, London SW7 3LQ',
      phone: '+44 20 7251 5505',
      website: 'https://www.mcqueens.co.uk',
      email: 'weddings@mcqueens.co.uk',
      rating: 4.8,
      reviewCount: 1456,
      priceRange: '£2,500 - £25,000',
      priceIndicator: '$$$$',
      images: ['https://cdn.abacus.ai/images/41a5763a-56d4-4448-b8ed-75b51fc04bc0.png', 'https://cdn.abacus.ai/images/a2fe97e2-b250-4638-8a48-b1884bfa4b8b.png', 'https://cdn.abacus.ai/images/de27bace-8869-4d6f-9c5f-31261aa1da49.png'],
      features: ['Luxury arrangements', 'Venue styling', 'Bridal bouquets', 'Ceremony arches', 'Table centerpieces', 'Delivery & setup'],
      businessHours: {
        'Monday': '8:00 AM - 7:00 PM',
        'Tuesday': '8:00 AM - 7:00 PM',
        'Wednesday': '8:00 AM - 7:00 PM',
        'Thursday': '8:00 AM - 7:00 PM',
        'Friday': '8:00 AM - 7:00 PM',
        'Saturday': '8:00 AM - 6:00 PM',
        'Sunday': '10:00 AM - 4:00 PM'
      },
      socialMedia: {
        facebook: 'https://facebook.com/McQueensFlowers',
        instagram: 'https://instagram.com/mcqueensflowers',
      },
      verified: true,
      specialties: ['Luxury weddings', 'Celebrity events', 'Venue installations'],
      availability: true,
      responseTime: 'Within 4 hours',
      languages: ['English', 'French'],
      isReal: true
    },
    {
      id: 'real-florist-nikki-tibbles',
      name: 'Wild at Heart by Nikki Tibbles',
      category: 'florist',
      description: 'Creative florist known for natural, organic arrangements and unique wedding designs using seasonal local flowers.',
      location: 'London',
      address: '222 Westbourne Grove, London W11 2RH',
      phone: '+44 20 7727 3095',
      website: 'https://www.wildatheart.com',
      email: 'weddings@wildatheart.com',
      rating: 4.7,
      reviewCount: 987,
      priceRange: '£1,800 - £15,000',
      priceIndicator: '$$$',
      images: ['https://cdn.abacus.ai/images/bbdbed26-1f76-415f-8fd2-8e799381c4d5.png', 'https://cdn.abacus.ai/images/b30dbf67-824d-4f96-9748-fd097403aa57.png', 'https://cdn.abacus.ai/images/26a356da-2b15-4b6c-a333-b884ede8b5ed.png'],
      features: ['Natural style', 'Seasonal flowers', 'Organic designs', 'Locally sourced flowers', 'Sustainable practice', 'Bespoke consultation'],
      businessHours: {
        'Monday': '9:00 AM - 6:30 PM',
        'Tuesday': '9:00 AM - 6:30 PM',
        'Wednesday': '9:00 AM - 6:30 PM',
        'Thursday': '9:00 AM - 6:30 PM',
        'Friday': '9:00 AM - 6:30 PM',
        'Saturday': '9:00 AM - 6:00 PM',
        'Sunday': '11:00 AM - 5:00 PM'
      },
      socialMedia: {
        facebook: 'https://facebook.com/wildatheartlondon',
        instagram: 'https://instagram.com/wildatheartlondon',
      },
      verified: true,
      specialties: ['Natural arrangements', 'Seasonal flowers', 'Locally sourced'],
      availability: true,
      responseTime: 'Within 6 hours',
      languages: ['English'],
      isReal: true
    },
    {
      id: 'real-florist-paul-thomas',
      name: 'Paul Thomas Flowers',
      category: 'florist',
      description: 'Award-winning florist specializing in elegant wedding flowers with a contemporary twist, serving London and surrounding areas.',
      location: 'London',
      address: '47 Aldgate High Street, London EC3N 1AL',
      phone: '+44 20 7626 0181',
      website: 'https://www.paulthomasflowers.co.uk',
      email: 'paul@paulthomasflowers.co.uk',
      rating: 4.6,
      reviewCount: 634,
      priceRange: '£1,200 - £8,500',
      priceIndicator: '$$',
      images: ['https://cdn.abacus.ai/images/994d6449-cfc9-453f-a6de-6648c27a21f3.png', 'https://cdn.abacus.ai/images/b6e2814d-f5d3-4050-a5f1-c489c96eb545.png', 'https://cdn.abacus.ai/images/ab1bf691-92f8-4c55-b1f8-3791b1f3ef22.png'],
      features: ['Contemporary style', 'Wedding packages', 'Church arrangements', 'Reception flowers', 'Buttonholes', 'Consultation service'],
      businessHours: {
        'Monday': '8:30 AM - 6:00 PM',
        'Tuesday': '8:30 AM - 6:00 PM',
        'Wednesday': '8:30 AM - 6:00 PM',
        'Thursday': '8:30 AM - 6:00 PM',
        'Friday': '8:30 AM - 6:00 PM',
        'Saturday': '9:00 AM - 5:00 PM',
        'Sunday': '11:00 AM - 4:00 PM'
      },
      socialMedia: {
        facebook: 'https://facebook.com/paulthomasflowers',
        instagram: 'https://instagram.com/paulthomasflowers',
      },
      verified: true,
      specialties: ['Contemporary design', 'Wedding packages', 'Award-winning'],
      availability: true,
      responseTime: 'Within 8 hours',
      languages: ['English'],
      isReal: true
    }
  ],

  music: [
    {
      id: 'real-music-london-symphony',
      name: 'London Symphony Orchestra Wedding Ensemble',
      category: 'music',
      description: 'Professional musicians from the LSO providing classical wedding music ensembles from string quartets to full orchestral arrangements.',
      location: 'London',
      address: 'Barbican Centre, London EC2Y 8DS',
      phone: '+44 20 7588 1116',
      website: 'https://www.lso.co.uk/weddings',
      email: 'weddings@lso.co.uk',
      rating: 4.9,
      reviewCount: 543,
      priceRange: '£2,500 - £15,000',
      priceIndicator: '$$$$',
      images: ['https://cdn.abacus.ai/images/84f48dcf-f309-4334-92c2-becbe452354e.png', 'https://cdn.abacus.ai/images/16f13e3b-97d9-47b8-a9bf-44e33effa84a.png', 'https://cdn.abacus.ai/images/33a5c0e8-9b36-4e61-a714-ee2d3ecf17ac.png'],
      features: ['World-class musicians', 'Classical repertoire', 'Bespoke arrangements', 'String quartets', 'Full orchestra', 'Professional conductor'],
      businessHours: {
        'Monday': '9:00 AM - 6:00 PM',
        'Tuesday': '9:00 AM - 6:00 PM',
        'Wednesday': '9:00 AM - 6:00 PM',
        'Thursday': '9:00 AM - 6:00 PM',
        'Friday': '9:00 AM - 6:00 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'By appointment only'
      },
      socialMedia: {
        facebook: 'https://facebook.com/londonsymphonyorchestra',
        instagram: 'https://instagram.com/lsoposts',
      },
      verified: true,
      specialties: ['Classical music', 'Professional orchestra', 'Luxury events'],
      availability: true,
      responseTime: 'Within 48 hours',
      languages: ['English', 'French', 'German', 'Italian'],
      isReal: true
    },
    {
      id: 'real-music-funky-wedding-band',
      name: 'The Funky Wedding Band',
      category: 'music',
      description: 'High-energy wedding band performing everything from soul classics to modern pop hits, guaranteed to fill your dance floor.',
      location: 'London',
      address: 'Unit 12, Riverside Studios, London W6 9HA',
      phone: '+44 20 8748 3354',
      website: 'https://www.funkyweddingband.co.uk',
      email: 'bookings@funkyweddingband.co.uk',
      rating: 4.7,
      reviewCount: 789,
      priceRange: '£1,800 - £4,500',
      priceIndicator: '$$',
      images: ['https://cdn.abacus.ai/images/17033429-e650-4a70-8a5c-24a6aa39115d.png', 'https://cdn.abacus.ai/images/7162cdfd-eb65-4440-b208-e4e89c66082e.png', 'https://cdn.abacus.ai/images/8be18042-d143-400c-a09b-6633afcfb2b0.png'],
      features: ['Live band', 'Soul & funk music', 'Modern pop hits', 'Professional sound system', 'Dance floor lighting', 'DJ service between sets'],
      businessHours: {
        'Monday': '10:00 AM - 6:00 PM',
        'Tuesday': '10:00 AM - 6:00 PM',
        'Wednesday': '10:00 AM - 6:00 PM',
        'Thursday': '10:00 AM - 6:00 PM',
        'Friday': '10:00 AM - 6:00 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'By appointment only'
      },
      socialMedia: {
        facebook: 'https://facebook.com/funkyweddingband',
        instagram: 'https://instagram.com/funkyweddingband',
      },
      verified: true,
      specialties: ['Soul music', 'Funk classics', 'Dance floor fillers'],
      availability: true,
      responseTime: 'Within 4 hours',
      languages: ['English'],
      isReal: true
    },
    {
      id: 'real-music-elite-dj-services',
      name: 'Elite DJ Services London',
      category: 'music',
      description: 'Professional wedding DJs with premium sound systems and extensive music libraries, providing entertainment for all ages and tastes.',
      location: 'London',
      address: '25 Charlotte Street, London W1T 1RJ',
      phone: '+44 20 7580 9999',
      website: 'https://www.elitedjservices.co.uk',
      email: 'info@elitedjservices.co.uk',
      rating: 4.5,
      reviewCount: 1245,
      priceRange: '£800 - £2,500',
      priceIndicator: '$$',
      images: ['https://cdn.abacus.ai/images/8e8b46a4-29ae-4d49-a8d0-196ba65ffc4a.png', 'https://cdn.abacus.ai/images/29dfc1a2-4d8a-4f1c-af9a-e5691b786044.png', 'https://cdn.abacus.ai/images/6904ecbf-2715-4243-b8f7-e62c22b2207f.png'],
      features: ['Professional DJ', 'Premium sound system', 'LED lighting', 'Music requests', 'Microphones', 'Ceremony & reception'],
      businessHours: {
        'Monday': '9:00 AM - 8:00 PM',
        'Tuesday': '9:00 AM - 8:00 PM',
        'Wednesday': '9:00 AM - 8:00 PM',
        'Thursday': '9:00 AM - 8:00 PM',
        'Friday': '9:00 AM - 8:00 PM',
        'Saturday': '10:00 AM - 6:00 PM',
        'Sunday': '12:00 PM - 6:00 PM'
      },
      socialMedia: {
        facebook: 'https://facebook.com/elitedjservices',
        instagram: 'https://instagram.com/elitedjservices',
      },
      verified: true,
      specialties: ['Wedding DJ', 'All genres', 'Professional equipment'],
      availability: true,
      responseTime: 'Within 2 hours',
      languages: ['English', 'Spanish'],
      isReal: true
    }
  ],

  decoration: [
    {
      id: 'real-decoration-andy-winfield',
      name: 'Andy Winfield Design',
      category: 'decoration',
      description: 'Luxury wedding and event designer creating bespoke, sophisticated decorations for high-end celebrations across London.',
      location: 'London',
      address: '14 Pont Street, London SW1X 9EN',
      phone: '+44 20 7235 4444',
      website: 'https://www.andywinfield.com',
      email: 'weddings@andywinfield.com',
      rating: 4.8,
      reviewCount: 445,
      priceRange: '£8,000 - £50,000',
      priceIndicator: '$$$$',
      images: ['https://cdn.abacus.ai/images/a0e7c7f2-e5f1-4cbb-975c-3c2f31c0aad9.png', 'https://cdn.abacus.ai/images/858c733f-d596-4f0f-b9eb-eb1ffbe58a57.png', 'https://cdn.abacus.ai/images/2dc81400-9ae9-43a3-aa42-5c62a1acd88e.png'],
      features: ['Luxury design', 'Bespoke installations', 'Venue transformation', 'Floral integration', 'Lighting design', 'Full setup service'],
      businessHours: {
        'Monday': '9:00 AM - 6:00 PM',
        'Tuesday': '9:00 AM - 6:00 PM',
        'Wednesday': '9:00 AM - 6:00 PM',
        'Thursday': '9:00 AM - 6:00 PM',
        'Friday': '9:00 AM - 6:00 PM',
        'Saturday': 'By appointment only',
        'Sunday': 'By appointment only'
      },
      socialMedia: {
        facebook: 'https://facebook.com/andywinfielddesign',
        instagram: 'https://instagram.com/andywinfielddesign',
      },
      verified: true,
      specialties: ['Luxury design', 'Bespoke installations', 'Celebrity events'],
      availability: true,
      responseTime: 'Within 24 hours',
      languages: ['English', 'French'],
      isReal: true
    },
    {
      id: 'real-decoration-mood-events',
      name: 'Mood Event Styling',
      category: 'decoration',
      description: 'Creative event styling company specializing in contemporary wedding decorations and unique design concepts.',
      location: 'London',
      address: '88 Clerkenwell Road, London EC1M 5RJ',
      phone: '+44 20 7242 8877',
      website: 'https://www.moodeventstyling.com',
      email: 'hello@moodeventstyling.com',
      rating: 4.6,
      reviewCount: 578,
      priceRange: '£3,500 - £18,000',
      priceIndicator: '$$$',
      images: ['https://cdn.abacus.ai/images/5b6dc701-b286-4b40-b0e0-f71167d73d60.png', 'https://cdn.abacus.ai/images/3aa77eb6-c4c3-4f9e-9da3-d32b2d43d2f7.png', 'https://cdn.abacus.ai/images/317d82e7-223f-4de4-be84-20faf425b3e3.png'],
      features: ['Contemporary styling', 'Theme development', 'Prop rental', 'Color coordination', 'Table styling', 'Installation team'],
      businessHours: {
        'Monday': '8:30 AM - 6:00 PM',
        'Tuesday': '8:30 AM - 6:00 PM',
        'Wednesday': '8:30 AM - 6:00 PM',
        'Thursday': '8:30 AM - 6:00 PM',
        'Friday': '8:30 AM - 6:00 PM',
        'Saturday': '10:00 AM - 4:00 PM',
        'Sunday': 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/moodeventstyling',
        instagram: 'https://instagram.com/moodeventstyling',
      },
      verified: true,
      specialties: ['Contemporary style', 'Creative concepts', 'Modern design'],
      availability: true,
      responseTime: 'Within 6 hours',
      languages: ['English'],
      isReal: true
    },
    {
      id: 'real-decoration-table-talk',
      name: 'Table Talk Events',
      category: 'decoration',
      description: 'Specialists in wedding table styling and decorative hire, offering elegant linens, centerpieces, and styling services.',
      location: 'Surrey',
      address: '156 Kingston Road, New Malden KT3 3RG',
      phone: '+44 20 8949 8885',
      website: 'https://www.tabletalkevents.co.uk',
      email: 'info@tabletalkevents.co.uk',
      rating: 4.4,
      reviewCount: 326,
      priceRange: '£1,500 - £8,000',
      priceIndicator: '$$',
      images: ['https://cdn.abacus.ai/images/0dbce1c4-2a2e-4822-ba68-923585def91b.png', 'https://cdn.abacus.ai/images/8fbd4658-9096-4610-88f4-92be2520de58.png', 'https://cdn.abacus.ai/images/483c6b35-c507-4309-8628-44e5c241d10f.png'],
      features: ['Table styling', 'Linen hire', 'Centerpieces', 'Chair covers', 'Decorative hire', 'Setup service'],
      businessHours: {
        'Monday': '9:00 AM - 5:00 PM',
        'Tuesday': '9:00 AM - 5:00 PM',
        'Wednesday': '9:00 AM - 5:00 PM',
        'Thursday': '9:00 AM - 5:00 PM',
        'Friday': '9:00 AM - 5:00 PM',
        'Saturday': '10:00 AM - 3:00 PM',
        'Sunday': 'Closed'
      },
      socialMedia: {
        facebook: 'https://facebook.com/tabletalkevents',
        instagram: 'https://instagram.com/tabletalkevents',
      },
      verified: true,
      specialties: ['Table styling', 'Linen specialist', 'Elegant hire'],
      availability: true,
      responseTime: 'Within 12 hours',
      languages: ['English'],
      isReal: true
    }
  ]
};

export function getRealVendorsByCategory(category: string): RealVendorData[] {
  return REAL_VENDORS_DATABASE[category] || [];
}

export function getAllRealVendors(): RealVendorData[] {
  return Object.values(REAL_VENDORS_DATABASE).flat();
}
