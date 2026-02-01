import axios from 'axios';

// Binance P2P Endpoint (Vercel serverless proxy)
const BINANCE_API_URL = '/api/binance';

// BCV API (Vercel serverless proxy)
const BCV_API_URL = '/api/bcv';

// API timeout configuration (3 seconds)
const API_TIMEOUT = 3000;

// Create axios instance with timeout
const apiClient = axios.create({
  timeout: API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fetchBinanceRate = async () => {
  try {
    const payload = {
      asset: 'USDC',
      fiat: 'VES',
      tradeType: 'SELL',
      transAmount: 0,
      order: '',
      page: 1,
      rows: 5,
      payTypes: [] // All payment methods
    };

    const response = await apiClient.post(BINANCE_API_URL, payload);
    const ads = response.data?.data || [];

    if (ads.length === 0) return null;

    const bestPrice = parseFloat(ads[0].adv.price);
    return bestPrice;
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('Binance API timeout after', API_TIMEOUT, 'ms');
    } else {
      console.error('Error fetching Binance rate:', error.message);
    }
    return null;
  }
};

export const fetchBCVRate = async () => {
  try {
    const response = await apiClient.get(BCV_API_URL);
    const rate = response.data?.dollar;

    return parseFloat(rate);
  } catch (error) {
    if (error.code === 'ECONNABORTED') {
      console.error('BCV API timeout after', API_TIMEOUT, 'ms');
    } else {
      console.error('Error fetching BCV rate:', error.message);
    }
    return null;
  }
};
