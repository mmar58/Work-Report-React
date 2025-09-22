// Environment configuration
const config = {
  API_BASE_URL: typeof window !== 'undefined' ? `http://${window.location.hostname}:88` : 'http://localhost:88',
  CURRENCY_API_URL: process.env.NEXT_PUBLIC_CURRENCY_API_URL || 'http://www.geoplugin.net/json.gp',
  REFRESH_INTERVAL: parseInt(process.env.NEXT_PUBLIC_REFRESH_INTERVAL) || 300000, // 5 minutes
  DEFAULT_HOURLY_RATE: parseFloat(process.env.NEXT_PUBLIC_DEFAULT_HOURLY_RATE) || 0,
  DEFAULT_TARGET_HOURS: parseInt(process.env.NEXT_PUBLIC_DEFAULT_TARGET_HOURS) || 40,
};

export default config;
