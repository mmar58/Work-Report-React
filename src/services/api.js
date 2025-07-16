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
    const url = ip ? `${config.CURRENCY_API_URL}?ip=${ip}` : config.CURRENCY_API_URL;
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error('Failed to fetch currency data');
    }
    
    const data = await response.json();
    return data.geoplugin_currencyConverter;
  }
}

export default new ApiService();
