// File: scripts/seed.ts

import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' }); // This runs right away

import { Product } from '../lib/types';

const mockProducts: Omit<Product, 'id' | 'created_at' | 'lastUpdated'>[] = [
  {
    name: 'Cyber-Visor X1',
    slug: 'cyber-visor-x1',
    description:
      'Advanced augmented reality visor with a holographic interface. Perfect for next-gen developers and tech enthusiasts.',
    price: 799.99,
    category: 'Electronics',
    inventory: 50,
    image_url:
      'https://images.unsplash.com/photo-1728602484721-7fa5eed36a64?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1112',
  },
  {
    name: 'Quantum-Drive SSD 2TB',
    slug: 'quantum-drive-ssd-2tb',
    description:
      'Blazing fast 2TB solid-state drive with quantum-dot technology. Read/write speeds up to 15,000 MB/s.',
    price: 249.99,
    category: 'Components',
    inventory: 200,
    image_url:
      'https://images.unsplash.com/photo-1677086586945-ef95ab632232?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1374',
  },
  {
    name: 'Auto-Brewer 9000',
    slug: 'auto-brewer-9000',
    description:
      'Smart coffee maker that syncs with your alarm. Grinds fresh beans and brews your perfect cup every time.',
    price: 129.99,
    category: 'Appliances',
    inventory: 120,
    image_url:
      'https://images.unsplash.com/photo-1608354580875-30bd4168b351?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=687',
  },
  {
    name: 'Ergo-Flow Keyboard',
    slug: 'ergo-flow-keyboard',
    description:
      'Split ergonomic mechanical keyboard with quiet switches and customizable RGB backlighting. Type for hours in comfort.',
    price: 179.99,
    category: 'Peripherals',
    inventory: 75,
    image_url:
      'https://images.unsplash.com/photo-1653786146814-fc617f0de776?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=1470',
  },
  {
    name: 'Aether-Frame 32" 4K',
    slug: 'aether-frame-32-4k',
    description:
      'A "floating" 4K monitor with an edgeless display and 1ms response time. Certified for professional color grading.',
    price: 599.99,
    category: 'Monitors',
    inventory: 40,
    image_url:
      'https://images.unsplash.com/photo-1551645120-d70bfe84c826?q=80&w=1932&auto=format&fit=crop',
  },
];

async function seedDatabase() {
  // We import adminSupabase HERE, after dotenv has loaded the variables
  const { adminSupabase } = await import('../lib/supabase/admin');
  
  console.log('Seeding database...');
  const { data, error } = await adminSupabase
    .from('products')
    .upsert(mockProducts, { onConflict: 'slug' })
    .select();

  if (error) {
    console.error('Error seeding database:', error);
  } else {
    console.log('Successfully seeded database with', data.length, 'products.');
  }
}

seedDatabase();