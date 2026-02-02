import { useLanguage } from '../context/LanguageContext';

// Flag SVGs
const SpainFlag = () => (
  <svg viewBox="0 0 36 36" className="w-6 h-6 rounded-sm">
    <path fill="#C60A1D" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z" />
    <path fill="#FFC400" d="M0 12h36v12H0z" />
  </svg>
);

const USFlag = () => (
  <svg viewBox="0 0 36 36" className="w-6 h-6 rounded-sm">
    <path fill="#B22234" d="M36 27a4 4 0 0 1-4 4H4a4 4 0 0 1-4-4V9a4 4 0 0 1 4-4h28a4 4 0 0 1 4 4v18z" />
    <path fill="#FFF" d="M0 7h36v2H0zm0 4h36v2H0zm0 4h36v2H0zm0 4h36v2H0zm0 4h36v2H0zm0 4h36v2H0z" />
    <path fill="#3C3B6E" d="M0 19V9a4 4 0 0 1 4-4h12v14H0z" />
  </svg>
);

export default function LanguageToggle() {
  const { language, toggleLanguage, isSpanish } = useLanguage();

  return (
    <button
      onClick={toggleLanguage}
      className="
        fixed top-4 right-20 z-50
        w-12 h-12 rounded-full
        bg-white/10 dark:bg-black/20
        backdrop-blur-md
        border border-white/20 dark:border-white/10
        flex items-center justify-center
        hover:bg-white/20 dark:hover:bg-black/30
        hover:scale-110
        transition-all duration-300 ease-out
        shadow-lg
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        overflow-hidden
      "
      aria-label={`Switch to ${isSpanish ? 'English' : 'Spanish'}`}
      title={isSpanish ? 'Switch to English' : 'Cambiar a Español'}
    >
      {isSpanish ? <USFlag /> : <SpainFlag />}
    </button>
  );
}
