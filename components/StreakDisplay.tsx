import { Flame } from 'lucide-react';
import { useStreak } from '../src/hooks/useStreak';

export const StreakDisplay = ({ userId }: { userId: string }) => {
  const streak = useStreak(userId);

  if (streak === 0) return null;

  return (
    <div 
      className="flex items-center gap-1 bg-orange-500/10 text-orange-500 px-3 py-1 rounded-full font-bold"
      aria-label={`لديك سلسلة تفاعل مستمرة لمدة ${streak} أيام`}
    >
      <Flame className="w-5 h-5" aria-hidden="true" />
      <span>{streak}</span>
    </div>
  );
};
