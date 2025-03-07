import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';

export const supabase = createClientComponentClient();

// Types for our database tables
export interface Profile {
  id: string;
  name: string;
  title: string;
  bio: string;
  years_of_experience: string;
  companies: string;
  core_competencies: string[];
  specialized_skills: string[];
  approach_text: string;
  security_audits_count: string;
  vulnerabilities_count: string;
  architectures_count: string;
  certifications_count: string;
  github_url?: string;
  linkedin_url?: string;
  twitter_url?: string;
  created_at: string;
  updated_at: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  image?: string;
  image_url?: string;
  github_url?: string;
  live_url?: string;
  tags: string[];
  details: {
    challenge: string;
    solution: string;
    technologies: string[];
    outcome: string;
  };
  color: string;
  created_at: string;
  updated_at: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  start_date: string;
  end_date?: string;
  current: boolean;
  mission: string;
  achievements: string[];
  created_at: string;
  updated_at: string;
}

export interface Skill {
  id: string;
  name: string;
  category: string;
  level: number;
  icon: string;
  created_at: string;
  updated_at: string;
}

export interface Contact {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  created_at: string;
  updated_at: string;
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