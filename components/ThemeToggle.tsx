import { useTheme } from '../src/ThemeContext';

export const ThemeToggle = () => {
  const { theme, toggleTheme } = useTheme();
  return (
    <button
      onClick={toggleTheme}
      aria-pressed={theme === 'dark'}
      aria-label={`تغيير الوضع إلى ${theme === 'dark' ? 'النهاري' : 'الليلي'}`}
      className="p-2 rounded-full hover:bg-zinc-200 dark:hover:bg-zinc-800"
    >
      {theme === 'dark' ? '☀️' : '🌙'}
    </button>
  );
};
