// Cache utilities for storing rates in localStorage
const CACHE_KEY = 'bolivarblue_rates_cache';
const CACHE_TTL = 60 * 60 * 1000; // 1 hour in milliseconds

export const cacheRates = (bcvRate, binanceRate) => {
  try {
    const data = {
      bcvRate,
      binanceRate,
      timestamp: Date.now(),
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error('Failed to cache rates:', error);
  }
};

export const getCachedRates = () => {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;

    const data = JSON.parse(cached);
    const isExpired = Date.now() - data.timestamp > CACHE_TTL;

    if (isExpired) {
      localStorage.removeItem(CACHE_KEY);
      return null;
    }

    return {
      bcvRate: data.bcvRate,
      binanceRate: data.binanceRate,
      timestamp: data.timestamp,
    };
  } catch (error) {
    console.error('Failed to get cached rates:', error);
    return null;
  }
};

export const isCacheStale = () => {
  const cached = getCachedRates();
  if (!cached) return true;
  return Date.now() - cached.timestamp > 5 * 60 * 1000; // 5 minutes
};
