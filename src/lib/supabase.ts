
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Type definitions for our database tables
export type DbUser = {
  id: string;
  username: string;
  email: string;
  avatar_url: string;
  created_at: string;
  is_admin?: boolean;
}

export type DbPost = {
  id: string;
  title: string;
  content: string;
  category: string;
  image_url?: string;
  embed_url?: string;
  author_id: string;
  created_at: string;
  likes: number;
  author?: DbUser;
}

export type DbComment = {
  id: string;
  post_id: string;
  author_id: string;
  content: string;
  created_at: string;
  author?: DbUser;
}

export type DbVideo = {
  id: string;
  title: string;
  description: string;
  src: string;
  poster?: string;
  author_id: string;
  created_at: string;
  likes: number;
  author?: DbUser;
}

export type DbPoll = {
  id: string;
  question: string;
  category: string;
  author_id: string;
  created_at: string;
  total_votes: number;
  author?: DbUser;
}

export type DbPollOption = {
  id: string;
  poll_id: string;
  text: string;
  votes: number;
}

// Helper functions for working with Supabase
export const transformUserData = (user: any): DbUser => ({
  id: user.id,
  username: user.user_metadata?.username || 'Anonymous',
  email: user.email || '',
  avatar_url: user.user_metadata?.avatar_url || 'https://randomuser.me/api/portraits/lego/1.jpg',
  created_at: user.created_at || new Date().toISOString(),
  is_admin: user.user_metadata?.is_admin || false,
});
