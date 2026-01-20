import { useState, useEffect } from 'react';
import { Button, Spacer } from '@heroui/react';
import { FaSyncAlt, FaTelegramPlane, FaWifi, FaBan } from 'react-icons/fa';
import RateCard from './components/RateCard';
import PullToRefresh from './components/PullToRefresh';
import InstallPrompt from './components/InstallPrompt';
import { fetchBCVRate, fetchBinanceRate } from './services/api';
import { useOnlineStatus } from './hooks/useOnlineStatus';

function App() {
  const [bcvRate, setBcvRate] = useState(null);
  const [binanceRate, setBinanceRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);
  const { isOnline, wasOffline } = useOnlineStatus();

  const fetchData = async () => {
    setLoading(true);
    try {
      const [bcv, binance] = await Promise.all([fetchBCVRate(), fetchBinanceRate()]);
      setBcvRate(bcv);
      setBinanceRate(binance);
      setLastUpdated(new Date());
    } catch (error) {
      console.error('Error fetching data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <PullToRefresh onRefresh={fetchData}>
      <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-venezuela-blue selection:text-black">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[300px] h-[300px] bg-blue-700/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Offline Indicator */}
        {!isOnline && (
          <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-50 bg-yellow-500/95 text-black px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
            <FaBan className="text-xs" />
            <span>Using cached data • Offline</span>
          </div>
        )}

        {/* Back Online Indicator */}
        {wasOffline && isOnline && (
          <div className="fixed top-[max(1rem,env(safe-area-inset-top))] left-1/2 -translate-x-1/2 z-50 bg-green-500/95 text-black px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm shadow-lg flex items-center gap-2">
            <FaWifi className="text-xs" />
            <span>Back online</span>
          </div>
        )}
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Bolivar<span className="text-venezuela-blue">Blue</span>
          </h1>
          <p className="text-gray-400 text-lg max-w-md mx-auto">Real-time exchange rates for the Venezuelan Bolívar.</p>
        </header>

        {/* content */}
        <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl justify-center items-stretch">
          <RateCard
            title="Banco Central (BCV)"
            rate={bcvRate}
            provider="Official BCV"
            color="venezuela-blue"
            icon={<span className="font-bold">BCV</span>}
            trend="up" // Placeholder trend logic
          />
          <RateCard
            title="Binance P2P (Sell)"
            rate={binanceRate}
            provider="Binance Market"
            color="venezuela-yellow"
            icon={<span className="font-bold">P2P</span>}
            trend="down" // Placeholder trend logic
          />
        </div>

        <Spacer y={8} />

        {/* Actions */}
        <div className="flex flex-col items-center gap-6 mt-12">
          <Button
            isLoading={loading}
            onPress={fetchData}
            variant="bordered"
            radius="full"
            className={`
              relative overflow-hidden group border-blue-500/20 bg-blue-600/10 backdrop-blur-md
              hover:bg-white/10 hover:border-white/20 px-10 py-7 h-auto
              transition-all duration-500 ease-out
              ${loading ? 'opacity-80' : 'hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]'}
            `}
          >
            <div className="flex items-center gap-3">
              {!loading && <FaSyncAlt className={`text-xl text-venezuela-blue transition-transform duration-700 group-hover:rotate-180`} />}
              <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                {loading ? 'Fetching Rates...' : 'Update Market Rates'}
              </span>
            </div>

            {/* Subtle glow effect behind */}
            <div className="absolute inset-0 bg-gradient-to-r from-venezuela-blue/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          </Button>

          {lastUpdated && (
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/5 bg-white/[0.02] backdrop-blur-sm">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
              <p className="text-[10px] uppercase tracking-[0.2em] text-gray-500 font-bold">
                Synced at: {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
              </p>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-4 text-center text-gray-600 text-sm">
          <p>Made with ❤️ for Venezuela</p>
        </footer>
      </div>

      {/* Install Prompt */}
      <InstallPrompt />
    </div>
    </PullToRefresh>
  );
}

export default App;
