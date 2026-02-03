import { useTheme } from '../context/ThemeContext';
import { FaSun, FaMoon } from 'react-icons/fa';

export default function ThemeToggle({ className = '' }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className={`
        w-12 h-12 rounded-full
        bg-white/10 dark:bg-black/20
        backdrop-blur-md
        border border-white/20 dark:border-white/10
        flex items-center justify-center
        text-venezuela-blue dark:text-yellow-400
        hover:bg-white/20 dark:hover:bg-black/30
        hover:scale-110
        transition-all duration-300 ease-out
        shadow-lg
        focus:outline-none focus:ring-2 focus:ring-venezuela-blue/50
        ${className}
      `}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <div className="relative w-6 h-6">
        <FaSun 
          className={`
            absolute inset-0 w-full h-full
            transition-all duration-300
            ${theme === 'light' ? 'opacity-100 rotate-0 scale-100' : 'opacity-0 rotate-90 scale-0'}
          `}
        />
        <FaMoon 
          className={`
            absolute inset-0 w-full h-full
            transition-all duration-300
            ${theme === 'dark' ? 'opacity-100 rotate-0 scale-100 text-white' : 'opacity-0 -rotate-90 scale-0'}
          `}
        />
      </div>
    </button>
  );
}
