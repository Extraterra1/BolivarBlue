import { useState, useEffect } from 'react';
import { Input } from '@heroui/react';
import axios from 'axios';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';

export default function CurrencyCalculator({ bcvRate, binanceRate }) {
  const { theme } = useTheme();
  const { t } = useLanguage();
  const isDark = theme === 'dark';

  const [activeTab, setActiveTab] = useState('convert');
  const [eurUsdRate, setEurUsdRate] = useState(null);
  const [values, setValues] = useState({
    usd: '1',
    eur: '',
    bsBcv: '',
    bsBinance: ''
  });
  const [realValues, setRealValues] = useState({
    bcvUsd: '1',
    bcvBs: '',
    realUsd: '',
    realEur: ''
  });

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

  useEffect(() => {
    if (eurUsdRate && (bcvRate || binanceRate)) {
      calculateFromBcvUsd(realValues.bcvUsd || '1');
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

  const calculateFromBcvUsd = (bcvUsdValue) => {
    const usd = parseFloat(bcvUsdValue) || 0;
    const bs = bcvRate ? usd * bcvRate : 0;
    const realUsd = binanceRate ? bs / binanceRate : 0;
    const realEur = eurUsdRate ? realUsd / eurUsdRate : 0;
    setRealValues({
      bcvUsd: bcvUsdValue,
      bcvBs: bcvRate ? bs.toFixed(2) : '',
      realUsd: binanceRate ? realUsd.toFixed(2) : '',
      realEur: eurUsdRate ? realEur.toFixed(2) : ''
    });
  };

  const calculateFromBcvBs = (bcvBsValue) => {
    const bs = parseFloat(bcvBsValue) || 0;
    const bcvUsd = bcvRate ? bs / bcvRate : 0;
    const realUsd = binanceRate ? bs / binanceRate : 0;
    const realEur = eurUsdRate ? realUsd / eurUsdRate : 0;
    setRealValues({
      bcvUsd: bcvRate ? bcvUsd.toFixed(2) : '',
      bcvBs: bcvBsValue,
      realUsd: binanceRate ? realUsd.toFixed(2) : '',
      realEur: eurUsdRate ? realEur.toFixed(2) : ''
    });
  };

  const calculateFromRealUsd = (realUsdValue) => {
    const usd = parseFloat(realUsdValue) || 0;
    const bs = binanceRate ? usd * binanceRate : 0;
    const bcvUsd = bcvRate ? bs / bcvRate : 0;
    const realEur = eurUsdRate ? usd / eurUsdRate : 0;
    setRealValues({
      bcvUsd: bcvRate ? bcvUsd.toFixed(2) : '',
      bcvBs: binanceRate ? bs.toFixed(2) : '',
      realUsd: realUsdValue,
      realEur: eurUsdRate ? realEur.toFixed(2) : ''
    });
  };

  const calculateFromRealEur = (realEurValue) => {
    const eur = parseFloat(realEurValue) || 0;
    const realUsd = eurUsdRate ? eur * eurUsdRate : 0;
    const bs = binanceRate ? realUsd * binanceRate : 0;
    const bcvUsd = bcvRate ? bs / bcvRate : 0;
    setRealValues({
      bcvUsd: bcvRate ? bcvUsd.toFixed(2) : '',
      bcvBs: binanceRate ? bs.toFixed(2) : '',
      realUsd: eurUsdRate ? realUsd.toFixed(2) : '',
      realEur: realEurValue
    });
  };

  const handleRealInputChange = (field, value) => {
    if (value && !/^\d*\.?\d*$/.test(value)) return;

    switch (field) {
      case 'bcvUsd':
        calculateFromBcvUsd(value);
        break;
      case 'bcvBs':
        calculateFromBcvBs(value);
        break;
      case 'realUsd':
        calculateFromRealUsd(value);
        break;
      case 'realEur':
        calculateFromRealEur(value);
        break;
    }
  };

  // Theme-aware classes
  const containerClasses = isDark
    ? 'bg-gradient-to-br from-gray-800/50 to-gray-900/50 border-white/10'
    : 'bg-gradient-to-br from-white to-slate-50 border-[#00247D]/15 shadow-xl';

  const inputClasses = isDark
    ? 'bg-gray-800/50 border-white/20 text-white placeholder:text-gray-500 focus:bg-gray-800 focus:border-blue-500'
    : 'bg-white border-[#00247D]/20 text-slate-900 placeholder:text-slate-400 focus:bg-white focus:border-[#00247D]';

  const labelClasses = isDark
    ? 'text-xs font-bold text-gray-400 uppercase tracking-wider mb-2 block'
    : 'text-xs font-bold text-[#00247D] uppercase tracking-wider mb-2 block';

  const helperClasses = isDark ? 'mt-2 text-[11px] text-gray-500' : 'mt-2 text-[11px] text-slate-500';

  const titleClasses = isDark ? 'text-2xl font-bold text-white mb-6 text-center' : 'text-2xl font-bold text-slate-900 mb-6 text-center';

  const infoClasses = isDark ? 'text-center text-gray-500 text-xs mt-6' : 'text-center text-slate-500 text-xs mt-6';

  const tabBaseClasses = 'px-4 py-2 text-sm font-bold uppercase tracking-wider rounded-full transition-colors border';
  const tabActiveClasses = isDark
    ? 'bg-white/10 border-white/20 text-white'
    : 'bg-[#00247D]/10 border-[#00247D]/20 text-[#00247D]';
  const tabInactiveClasses = isDark
    ? 'bg-transparent border-white/10 text-gray-400 hover:text-white'
    : 'bg-transparent border-[#00247D]/10 text-slate-500 hover:text-[#00247D]';

  return (
    <div className="w-full max-w-4xl mt-12">
      <div className={`${containerClasses} rounded-xl p-6 md:p-8 backdrop-blur-sm border`}>
        <h2 className={titleClasses}>{t('calculatorTitle')}</h2>

        <div className="flex items-center justify-center gap-2 mb-6">
          <button
            type="button"
            aria-pressed={activeTab === 'convert'}
            onClick={() => setActiveTab('convert')}
            className={`${tabBaseClasses} ${activeTab === 'convert' ? tabActiveClasses : tabInactiveClasses}`}
          >
            {t('calculatorTabConvert')}
          </button>
          <button
            type="button"
            aria-pressed={activeTab === 'real'}
            onClick={() => setActiveTab('real')}
            className={`${tabBaseClasses} ${activeTab === 'real' ? tabActiveClasses : tabInactiveClasses}`}
          >
            {t('calculatorTabReal')}
          </button>
        </div>

        {activeTab === 'convert' ? (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* USD Input */}
              <div>
                <label className={labelClasses}>{t('usdLabel')}</label>
                <div className="relative h-12">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>$</span>
                  <Input
                    type="text"
                    value={values.usd}
                    onChange={(e) => handleInputChange('usd', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
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
                <label className={labelClasses}>{t('eurLabel')}</label>
                <div className="relative h-12">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>€</span>
                  <Input
                    type="text"
                    value={values.eur}
                    onChange={(e) => handleInputChange('eur', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
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
                <label className={labelClasses}>{t('bsBcvLabel')}</label>
                <div className="relative h-12">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00247D] font-bold z-10">Bs.</span>
                  <Input
                    type="text"
                    value={values.bsBcv}
                    onChange={(e) => handleInputChange('bsBcv', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
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
                <label className={labelClasses}>{t('bsBinanceLabel')}</label>
                <div className="relative h-12">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#d4a017] font-bold z-10">Bs.</span>
                  <Input
                    type="text"
                    value={values.bsBinance}
                    onChange={(e) => handleInputChange('bsBinance', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
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

            <p className={infoClasses}>{t('calculatorInfo')}</p>
          </>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={labelClasses}>{t('bcvUsdLabel')}</label>
                <div className="relative h-12">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>$</span>
                  <Input
                    type="text"
                    value={realValues.bcvUsd}
                    onChange={(e) => handleRealInputChange('bcvUsd', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
                    classNames={{
                      input: 'pl-10 h-full !outline-none !ring-0',
                      inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                    }}
                    placeholder="0.00"
                    size="lg"
                  />
                </div>
                <p className={helperClasses}>{t('realHelperBcvUsd')}</p>
              </div>

              <div>
                <label className={labelClasses}>{t('bcvBsLabel')}</label>
                <div className="relative h-12">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#00247D] font-bold z-10">Bs.</span>
                  <Input
                    type="text"
                    value={realValues.bcvBs}
                    onChange={(e) => handleRealInputChange('bcvBs', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
                    classNames={{
                      input: 'pl-12 h-full !outline-none !ring-0',
                      inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                    }}
                    placeholder="0.00"
                    size="lg"
                  />
                </div>
                <p className={helperClasses}>{t('realHelperBcvBs')}</p>
              </div>

              <div>
                <label className={labelClasses}>{t('realUsdLabel')}</label>
                <div className="relative h-12">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>$</span>
                  <Input
                    type="text"
                    value={realValues.realUsd}
                    onChange={(e) => handleRealInputChange('realUsd', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
                    classNames={{
                      input: 'pl-10 h-full !outline-none !ring-0',
                      inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                    }}
                    placeholder="0.00"
                    size="lg"
                  />
                </div>
                <p className={helperClasses}>{t('realHelperRealUsd')}</p>
              </div>

              <div>
                <label className={labelClasses}>{t('realEurLabel')}</label>
                <div className="relative h-12">
                  <span className={`absolute left-4 top-1/2 -translate-y-1/2 font-bold z-10 ${isDark ? 'text-gray-400' : 'text-slate-500'}`}>€</span>
                  <Input
                    type="text"
                    value={realValues.realEur}
                    onChange={(e) => handleRealInputChange('realEur', e.target.value)}
                    className={`${inputClasses} text-lg font-medium h-12`}
                    classNames={{
                      input: 'pl-10 h-full !outline-none !ring-0',
                      inputWrapper: '!ring-0 !ring-offset-0 !outline-none !shadow-none'
                    }}
                    placeholder="0.00"
                    size="lg"
                  />
                </div>
                <p className={helperClasses}>{t('realHelperRealEur')}</p>
              </div>
            </div>

            <p className={infoClasses}>{t('realCalculatorInfo')}</p>
          </>
        )}
      </div>
    </div>
  );
}
