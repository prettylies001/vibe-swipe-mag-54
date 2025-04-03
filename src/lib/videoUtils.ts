
import { supabase, DbVideo } from './supabase';
import { toast } from 'sonner';

export async function fetchVideos() {
  try {
    const { data, error } = await supabase
      .from('videos')
      .select('*, author:users(id, username, avatar_url)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching videos:', error);
    toast.error('Failed to load videos');
    return [];
  }
}

export async function uploadVideo(
  file: File, 
  title: string, 
  description: string, 
  authorId: string,
  posterFile?: File
) {
  try {
    // Upload video file
    const videoFileName = `${Date.now()}_${file.name}`;
    const { data: videoData, error: videoError } = await supabase.storage
      .from('videos')
      .upload(videoFileName, file);
    
    if (videoError) throw videoError;
    
    // Get public URL for the video
    const { data: { publicUrl: videoUrl } } = supabase.storage
      .from('videos')
      .getPublicUrl(videoFileName);
    
    // Upload poster image if provided
    let posterUrl = '';
    if (posterFile) {
      const posterFileName = `${Date.now()}_${posterFile.name}`;
      const { data: posterData, error: posterError } = await supabase.storage
        .from('images')
        .upload(posterFileName, posterFile);
      
      if (posterError) throw posterError;
      
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(posterFileName);
      
      posterUrl = publicUrl;
    }
    
    // Create video record in database
    const { data, error } = await supabase
      .from('videos')
      .insert({
        title,
        description,
        src: videoUrl,
        poster: posterUrl || null,
        author_id: authorId,
        likes: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error uploading video:', error);
    toast.error('Failed to upload video');
    throw error;
  }
}

export async function likeVideo(videoId: string) {
  try {
    // First get the current likes count
    const { data: video, error: fetchError } = await supabase
      .from('videos')
      .select('likes')
      .eq('id', videoId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Then update with incremented count
    const { data, error } = await supabase
      .from('videos')
      .update({ likes: (video?.likes || 0) + 1 })
      .eq('id', videoId);
    
    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error('Error liking video:', error);
    toast.error('Failed to like video');
    throw error;
  }
}
