import { useState, useEffect, lazy, Suspense } from 'react';
import { FaWifi, FaBan } from 'react-icons/fa';
import { ThemeProvider } from './context/ThemeContext';
import { useLanguage } from './context/LanguageContext';
import ThemeToggle from './components/ThemeToggle';
import LanguageToggle from './components/LanguageToggle';
import RateCard from './components/RateCard';
import SkeletonRateCard from './components/SkeletonRateCard';
import CurrencyCalculator from './components/CurrencyCalculator';
import SpreadIndicator from './components/SpreadIndicator';
import { fetchBCVRate, fetchBinanceRate } from './services/api';
import { useOnlineStatus } from './hooks/useOnlineStatus';
import { cacheRates, getCachedRates } from './utils/cache';

// Lazy load non-critical components
const InstallPrompt = lazy(() => import('./components/InstallPrompt'));

function AppContent() {
  const [bcvRate, setBcvRate] = useState(null);
  const [binanceRate, setBinanceRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isOnline, wasOffline } = useOnlineStatus();
  const { t } = useLanguage();

  useEffect(() => {
    const loadData = async () => {
      // Try to load cached data immediately
      const cached = getCachedRates();
      if (cached) {
        setBcvRate(cached.bcvRate);
        setBinanceRate(cached.binanceRate);
        setLoading(false);
      }

      // Fetch fresh data in background
      try {
        const [bcv, binance] = await Promise.all([fetchBCVRate(), fetchBinanceRate()]);
        if (bcv !== null) setBcvRate(bcv);
        if (binance !== null) setBinanceRate(binance);
        if (bcv !== null || binance !== null) cacheRates(bcv, binance);
      } catch (error) {
        console.error('Error fetching data', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  return (
    <div className="relative min-h-screen w-full overflow-hidden transition-colors duration-300">
      {/* Background Effects - Theme Aware */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] bg-blue-500/10 dark:bg-blue-500/10 bg-[#00247D]/5" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] rounded-full blur-[120px] bg-blue-600/10 dark:bg-blue-600/10 bg-[#00247D]/5" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[300px] h-[300px] rounded-full blur-[100px] bg-blue-700/10 dark:bg-blue-700/10 bg-[#FFCC00]/5" />
      </div>

      {/* Toggles */}
      <ThemeToggle />
      <LanguageToggle />

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Offline Indicator */}
        {!isOnline && (
          <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-40 bg-yellow-500/95 text-black px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
            <FaBan className="text-xs" />
            <span>{t('offline')}</span>
          </div>
        )}

        {/* Back Online Indicator */}
        {wasOffline && isOnline && (
          <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-40 bg-green-500/95 text-black px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
            <FaWifi className="text-xs" />
            <span>{t('backOnline')}</span>
          </div>
        )}

        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-[#00247D] to-[#d4a017] dark:from-white dark:via-gray-200 dark:to-gray-500">
            Bolivar<span className="text-[#00247D] dark:text-blue-500">Blue</span>
          </h1>
          <p className="text-slate-600 dark:text-gray-400 text-lg max-w-md mx-auto">{t('appSubtitle')}</p>
        </header>

        {/* content */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-stretch">
          {loading && !bcvRate && !binanceRate ? (
            <>
              <SkeletonRateCard />
              <SkeletonRateCard />
            </>
          ) : (
            <>
              <RateCard title={t('bcvTitle')} rate={bcvRate} provider={t('bcvProvider')} color="venezuela-blue" logo="/bcv-logo.svg" trend="up" />
              <RateCard
                title={t('binanceTitle')}
                rate={binanceRate}
                provider={t('binanceProvider')}
                color="venezuela-yellow"
                logo="/binance-logo.svg"
                trend="down"
              />
            </>
          )}
        </div>

        <SpreadIndicator bcvRate={bcvRate} binanceRate={binanceRate} />

        {/* Currency Calculator */}
        <CurrencyCalculator bcvRate={bcvRate} binanceRate={binanceRate} />
      </div>

      {/* Install Prompt - Lazy loaded */}
      <Suspense fallback={null}>
        <InstallPrompt />
      </Suspense>
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
