
import { supabase, DbPoll, DbPollOption } from './supabase';
import { toast } from 'sonner';

export async function fetchPolls(category: string = 'All') {
  try {
    let query = supabase
      .from('polls')
      .select('*, author:users(id, username, avatar_url), options:poll_options(*)')
      .order('created_at', { ascending: false });
      
    if (category !== 'All') {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    
    return data || [];
  } catch (error) {
    console.error('Error fetching polls:', error);
    toast.error('Failed to load polls');
    return [];
  }
}

export async function createPoll(
  question: string, 
  options: { text: string }[],
  category: string, 
  authorId: string
) {
  try {
    // Insert the poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .insert({
        question,
        category,
        author_id: authorId,
        total_votes: 0,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();
    
    if (pollError) throw pollError;
    
    // Insert the options
    const optionsToInsert = options.map(option => ({
      poll_id: pollData.id,
      text: option.text,
      votes: 0
    }));
    
    const { data: optionsData, error: optionsError } = await supabase
      .from('poll_options')
      .insert(optionsToInsert)
      .select();
    
    if (optionsError) throw optionsError;
    
    return { ...pollData, options: optionsData };
  } catch (error) {
    console.error('Error creating poll:', error);
    toast.error('Failed to create poll');
    throw error;
  }
}

export async function votePoll(pollId: string, optionId: string) {
  try {
    // Start a transaction
    // 1. Increment the option votes
    const { data: optionData, error: optionError } = await supabase
      .from('poll_options')
      .select('votes')
      .eq('id', optionId)
      .single();
    
    if (optionError) throw optionError;
    
    const { error: updateOptionError } = await supabase
      .from('poll_options')
      .update({ votes: (optionData?.votes || 0) + 1 })
      .eq('id', optionId);
    
    if (updateOptionError) throw updateOptionError;
    
    // 2. Increment the total votes on the poll
    const { data: pollData, error: pollError } = await supabase
      .from('polls')
      .select('total_votes')
      .eq('id', pollId)
      .single();
    
    if (pollError) throw pollError;
    
    const { error: updatePollError } = await supabase
      .from('polls')
      .update({ total_votes: (pollData?.total_votes || 0) + 1 })
      .eq('id', pollId);
    
    if (updatePollError) throw updatePollError;
    
    return true;
  } catch (error) {
    console.error('Error voting on poll:', error);
    toast.error('Failed to record vote');
    throw error;
  }
}
