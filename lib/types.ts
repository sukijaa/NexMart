// File: lib/types.ts

export interface Product {
  id: string;          // uuid
  created_at: string;  // timestamp with time zone
  name: string;
  slug: string;
  description?: string | null; // Can be null
  price: number;
  category?: string | null;
  inventory: number;
  image_url?: string | null; // Can be null
  lastUpdated: string; // timestamp with time zone
}

// We can add more types here as we go, like for CartItems or Users