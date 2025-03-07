import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

// Types for our database tables
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  avatar_url: string;
  email: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  technologies: string[];
  github_url?: string;
  live_url?: string;
  created_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  description: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  created_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  proficiency: number;
  created_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  message: string;
  created_at: string;
}

export interface Blog {
  id: string;
  title: string;
  content: string;
  image_url?: string;
  created_at: string;
  updated_at: string;
  published: boolean;
  slug: string;
  excerpt?: string;
  tags?: string[];
} 