// API service for work data
import config from '../config';

class ApiService {
  constructor() {
    this.baseURL = config.API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
    };

    try {
      const response = await fetch(url, { ...defaultOptions, ...options });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const contentType = response.headers.get('content-type');
      if (contentType && contentType.includes('application/json')) {
        return await response.json();
      } else {
        return await response.text();
      }
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw new Error(`Failed to fetch data from ${endpoint}: ${error.message}`);
    }
  }

  // Work data endpoints
  async getWorkData(startDate, endDate) {
    return this.request(`/work-data?startDate=${startDate}&endDate=${endDate}`);
  }

  async getWorkTime(dates = null) {
    const endpoint = dates ? `/worktime?dates=${dates}` : '/worktime';
    return this.request(endpoint);
  }

  async getHourlyRate() {
    const rate = await this.request('/hourlyRate');
    return parseFloat(rate);
  }

  async setHourlyRate(rate) {
    return this.request(`/setHourlyRate?rate=${rate}`, { method: 'POST' });
  }

  async getTargetHours() {
    const hours = await this.request('/getTargetHours');
    return parseInt(hours);
  }

  async setTargetHours(hours) {
    return this.request(`/setTargetHours?hours=${hours}`, { method: 'POST' });
  }

  // Currency API
  async getCurrencyRate(ip = null) {
    const localStorageKey = 'currencyRate';
    const localStorageTimeKey = 'currencyRateLastFetch';
    const now = Date.now();
    let cachedRate = null;
    let lastFetch = null;
    try {
      cachedRate = localStorage.getItem(localStorageKey);
      lastFetch = localStorage.getItem(localStorageTimeKey);
    } catch (e) {
      // localStorage may not be available in some environments
    }
    const oneHour = 60 * 60 * 1000;
    if (cachedRate && lastFetch && (now - parseInt(lastFetch, 10) < oneHour)) {
      return parseFloat(cachedRate);
    }
    // Fetch from API if not cached or cache is stale
    const url = ip ? `${config.CURRENCY_API_URL}?ip=${ip}` : config.CURRENCY_API_URL;
    const response = await fetch(url);
    if (!response.ok) {
      console.error('Failed to fetch currency data:', response.statusText, url);
      if(cachedRate) {
        return parseFloat(cachedRate); // return stale cache if available
      }
      throw new Error('Failed to fetch currency data');
    }
    const data = await response.json();
    const rate = parseFloat(data.rates.BDT);
    try {
      localStorage.setItem(localStorageKey, rate);
      localStorage.setItem(localStorageTimeKey, now.toString());
    } catch (e) {
      // localStorage may not be available in some environments
    }
    return rate;
  }
}

export default new ApiService();
