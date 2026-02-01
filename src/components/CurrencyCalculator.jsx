import { useState, useEffect } from 'react';
import { Input } from '@heroui/react';
import axios from 'axios';

export default function CurrencyCalculator({ bcvRate, binanceRate }) {
  const [eurUsdRate, setEurUsdRate] = useState(null);
  const [values, setValues] = useState({
    usd: '1',
    eur: '',
    bsBcv: '',
    bsBinance: ''
  });
  const [lastEdited, setLastEdited] = useState('usd');

  // Fetch EUR/USD rate
  useEffect(() => {
    const fetchEurRate = async () => {
      try {
        const response = await axios.get('https://api.frankfurter.app/latest?from=EUR&to=USD');
        setEurUsdRate(response.data.rates.USD);
      } catch (error) {
        console.error('Error fetching EUR rate:', error);
        setEurUsdRate(1.08); // Fallback rate
      }
    };
    fetchEurRate();
  }, []);

  // Calculate all values when rates change or on initial load
  useEffect(() => {
    if (eurUsdRate && (bcvRate || binanceRate)) {
      calculateFromUSD(1);
    }
  }, [eurUsdRate, bcvRate, binanceRate]);

  const calculateFromUSD = (usdValue) => {
    const usd = parseFloat(usdValue) || 0;
    setValues({
      usd: usdValue,
      eur: (usd / eurUsdRate).toFixed(2),
      bsBcv: (usd * (bcvRate || 0)).toFixed(2),
      bsBinance: (usd * (binanceRate || 0)).toFixed(2)
    });
  };

  const calculateFromEUR = (eurValue) => {
    const eur = parseFloat(eurValue) || 0;
    const usd = eur * eurUsdRate;
    setValues({
      usd: usd.toFixed(2),
      eur: eurValue,
      bsBcv: (usd * (bcvRate || 0)).toFixed(2),
      bsBinance: (usd * (binanceRate || 0)).toFixed(2)
    });
  };

  const calculateFromBsBcv = (bsBcvValue) => {
    const bs = parseFloat(bsBcvValue) || 0;
    const usd = bcvRate ? bs / bcvRate : 0;
    setValues({
      usd: usd.toFixed(2),
      eur: (usd / eurUsdRate).toFixed(2),
      bsBcv: bsBcvValue,
      bsBinance: (usd * (binanceRate || 0)).toFixed(2)
    });
  };

  const calculateFromBsBinance = (bsBinanceValue) => {
    const bs = parseFloat(bsBinanceValue) || 0;
    const usd = binanceRate ? bs / binanceRate : 0;
    setValues({
      usd: usd.toFixed(2),
      eur: (usd / eurUsdRate).toFixed(2),
      bsBcv: (usd * (bcvRate || 0)).toFixed(2),
      bsBinance: bsBinanceValue
    });
  };

  const handleInputChange = (currency, value) => {
    // Only allow numbers and decimal point
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    setLastEdited(currency);

    switch (currency) {
      case 'usd':
        calculateFromUSD(value);
        break;
      case 'eur':
        calculateFromEUR(value);
        break;
      case 'bsBcv':
        calculateFromBsBcv(value);
        break;
      case 'bsBinance':
        calculateFromBsBinance(value);
        break;
    }
  };

  const inputClass = `
    bg-gray-800/50 border-white/20 text-white 
    placeholder:text-gray-500
    focus:bg-gray-800 focus:border-blue-500 focus:ring-0 focus:outline-none
    text-lg font-medium
    h-12
  `;

  const labelClass = 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block';

  return (
    <div className="w-full max-w-4xl mt-12">
      <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-white/10 rounded-xl p-6 md:p-8 backdrop-blur-sm">
        <h2 className="text-2xl font-bold text-white mb-6 text-center">Currency Converter</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* USD Input */}
          <div>
            <label className={labelClass}>USD</label>
            <div className="relative h-12">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold z-10">$</span>
              <Input
                type="text"
                value={values.usd}
                onChange={(e) => handleInputChange('usd', e.target.value)}
                className={inputClass}
                classNames={{
                  input: 'pl-10 h-full !outline-none !ring-0',
                  inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                }}
                placeholder="0.00"
                size="lg"
              />
            </div>
          </div>

          {/* EUR Input */}
          <div>
            <label className={labelClass}>EUR</label>
            <div className="relative h-12">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold z-10">€</span>
              <Input
                type="text"
                value={values.eur}
                onChange={(e) => handleInputChange('eur', e.target.value)}
                className={inputClass}
                classNames={{
                  input: 'pl-10 h-full !outline-none !ring-0',
                  inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                }}
                placeholder="0.00"
                size="lg"
              />
            </div>
          </div>

          {/* Bs. BCV Input */}
          <div>
            <label className={labelClass}>Bs. (BCV)</label>
            <div className="relative h-12">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-blue-400 font-bold z-10">Bs.</span>
              <Input
                type="text"
                value={values.bsBcv}
                onChange={(e) => handleInputChange('bsBcv', e.target.value)}
                className={inputClass}
                classNames={{
                  input: 'pl-12 h-full !outline-none !ring-0',
                  inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                }}
                placeholder="0.00"
                size="lg"
              />
            </div>
          </div>

          {/* Bs. Binance Input */}
          <div>
            <label className={labelClass}>Bs. (Binance)</label>
            <div className="relative h-12">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-yellow-400 font-bold z-10">Bs.</span>
              <Input
                type="text"
                value={values.bsBinance}
                onChange={(e) => handleInputChange('bsBinance', e.target.value)}
                className={inputClass}
                classNames={{
                  input: 'pl-12 h-full !outline-none !ring-0',
                  inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                }}
                placeholder="0.00"
                size="lg"
              />
            </div>
          </div>
        </div>

        {/* Info text */}
        <p className="text-center text-gray-500 text-xs mt-6">Enter any value above to convert between currencies</p>
      </div>
    </div>
  );
}
