import axios from 'axios';

// Binance P2P Endpoint
// Binance P2P Endpoint (Proxied)
const BINANCE_API_URL = '/api/binance';

// BCV API (Proxied)
const BCV_API_URL = '/api/bcv';

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

    const response = await axios.post(BINANCE_API_URL, payload);
    const ads = response.data?.data || [];

    if (ads.length === 0) return null;

    // Calculate average of top 5 or just take the best price
    // Since we want the "Sell" rate (what people pay to buy USDC), efficient market is the lowest sell price?
    // Wait, tradeType "SELL" in P2P API means the advertiser is SELLING USDC (so user is BUYING).
    // The lowest price is the best market rate for the user.

    // Let's take the average of the top 3 legitimate ads to filter outliers?
    // Or just the first one as it's usually sorted by price.
    const bestPrice = parseFloat(ads[0].adv.price);
    return bestPrice;
  } catch (error) {
    console.error('Error fetching Binance rate:', error);
    return null;
  }
};

export const fetchBCVRate = async () => {
  try {
    const response = await axios.get(BCV_API_URL);
    // URL is proxied to https://bcv-api.rafnixg.dev/rates/
    // Response format: {"dollar": 344.5071, "date": "2026-01-19"}
    const rate = response.data?.dollar;

    return parseFloat(rate);
  } catch (error) {
    console.error('Error fetching BCV rate:', error);
    // Fallback or retry logic could go here
    return null;
  }
};
