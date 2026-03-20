import { useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';

export const useStreak = (userId: string) => {
  const [streak, setStreak] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const initStreak = async () => {
      // 1. Update streak in database
      await supabase.rpc('update_user_streak', { uid: userId });
      
      // 2. Fetch updated streak
      const { data } = await supabase
        .from('user_streaks')
        .select('streak_count')
        .eq('user_id', userId)
        .single();
        
      if (data) setStreak(data.streak_count);
    };

    initStreak();
  }, [userId]);

  return streak;
};
