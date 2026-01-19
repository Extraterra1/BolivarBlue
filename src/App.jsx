import { useState, useEffect } from 'react';
import { Button, Spacer } from '@heroui/react';
import { FaSyncAlt, FaTelegramPlane } from 'react-icons/fa';
import RateCard from './components/RateCard';
import { fetchBCVRate, fetchBinanceRate } from './services/api';

function App() {
  const [bcvRate, setBcvRate] = useState(null);
  const [binanceRate, setBinanceRate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState(null);

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
    <div className="relative min-h-screen w-full overflow-hidden bg-black text-white selection:bg-venezuela-yellow selection:text-black">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0 pointer-events-none">
        <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-venezuela-yellow/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-venezuela-blue/10 rounded-full blur-[120px]" />
        <div className="absolute top-[40%] left-[50%] transform -translate-x-1/2 w-[300px] h-[300px] bg-venezuela-red/10 rounded-full blur-[100px]" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8 flex flex-col items-center justify-center min-h-screen">
        {/* Header */}
        <header className="mb-12 text-center">
          <h1 className="text-5xl md:text-7xl font-black mb-2 tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
            Tasa<span className="text-venezuela-yellow">Vzla</span>
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
        <div className="flex flex-col items-center gap-4 mt-8">
          <Button
            color="primary"
            size="lg"
            variant="shadow"
            className="font-bold bg-gradient-to-r from-venezuela-blue to-blue-600 w-48"
            isLoading={loading}
            onPress={fetchData}
            startContent={!loading && <FaSyncAlt />}
          >
            {loading ? 'Refreshing...' : 'Refresh Rates'}
          </Button>

          {lastUpdated && <p className="text-xs text-gray-600 mt-2 font-mono">Last updated: {lastUpdated.toLocaleTimeString()}</p>}
        </div>

        {/* Footer */}
        <footer className="mt-auto pt-16 pb-4 text-center text-gray-600 text-sm">
          <p>Made with ❤️ for Venezuela</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
