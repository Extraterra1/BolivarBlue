import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function SpreadIndicator({ bcvRate, binanceRate }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  if (!bcvRate || !binanceRate) return null;

  const spread = binanceRate - bcvRate;
  const spreadPercent = (spread / bcvRate) * 100;
  const isPositive = spread >= 0;
  const sign = spread > 0 ? '+' : '';

  const containerClasses = isDark
    ? 'bg-white/5 border-white/10 text-gray-200'
    : 'bg-[#00247D]/5 border-[#00247D]/15 text-slate-700';

  const accentClasses = isPositive
    ? isDark
      ? 'text-green-400'
      : 'text-green-600'
    : isDark
      ? 'text-red-400'
      : 'text-red-600';

  return (
    <div className={`mt-6 px-4 py-2 rounded-full border text-xs md:text-sm font-semibold ${containerClasses}`}>
      <span className="uppercase tracking-wider">{t('spreadLabel')}</span>
      <span className="mx-2 text-gray-400">•</span>
      <span className="text-xs md:text-sm">{t('spreadVs')}</span>
      <span className="mx-2 text-gray-400">•</span>
      <span className={accentClasses}>
        {sign}
        {spreadPercent.toFixed(2)}%
      </span>
      <span className="mx-2 text-gray-400">•</span>
      <span>
        {t('currencySymbol')} {Math.abs(spread).toFixed(2)}
      </span>
    </div>
  );
}
