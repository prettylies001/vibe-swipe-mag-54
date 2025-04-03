
import { supabase, DbPost, DbComment } from './supabase';
import { toast } from 'sonner';

export async function fetchPosts(category: string = 'All') {
  try {
    let query = supabase
      .from('posts')
      .select('*, author:users(id, username, avatar_url)')
      .order('created_at', { ascending: false });
      
    if (category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching posts:', error);
    toast.error('Failed to load posts');
    return [];
  }
}

export async function createPost(
  title: string,
  content: string, 
  category: string,
  authorId: string,
  imageUrl?: string,
  embedUrl?: string
) {
  try {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        title,
        content,
        category,
        author_id: authorId,
        image_url: imageUrl,
        embed_url: embedUrl,
        likes: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating post:', error);
    toast.error('Failed to create post');
    throw error;
  }
}

export async function likePost(postId: string) {
  try {
    // First get the current likes count
    const { data: post, error: fetchError } = await supabase
      .from('posts')
      .select('likes')
      .eq('id', postId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with incremented count
    const { data, error } = await supabase
      .from('posts')
      .update({ likes: (post?.likes || 0) + 1 })
      .eq('id', postId);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error liking post:', error);
    toast.error('Failed to like post');
    throw error;
  }
}

export async function fetchComments(postId: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .select('*, author:users(id, username, avatar_url)')
      .eq('post_id', postId)
      .order('created_at', { ascending: true });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching comments:', error);
    toast.error('Failed to load comments');
    return [];
  }
}

export async function createComment(postId: string, authorId: string, content: string) {
  try {
    const { data, error } = await supabase
      .from('comments')
      .insert({
        post_id: postId,
        author_id: authorId,
        content,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error creating comment:', error);
    toast.error('Failed to add comment');
    throw error;
  }
}
