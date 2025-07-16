// Utility functions for data processing and formatting
import { format } from 'date-fns';

export const formatCurrency = (amount, currency = 'BDT', locale = 'en-US') => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency: currency === 'BDT' ? 'USD' : currency, // Fallback for BDT
    minimumFractionDigits: 2,
  }).format(amount);
};

export const formatTime = (hours, minutes) => {
  const h = Math.floor(hours);
  const m = Math.floor(minutes);
  
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export const calculateTotalTime = (entries) => {
  let totalHours = 0;
  let totalMinutes = 0;

  entries.forEach(entry => {
    totalHours += entry.hours || 0;
    totalMinutes += (entry.minutes || 0) + (entry.extraminutes || 0);
  });

  totalHours += Math.floor(totalMinutes / 60);
  totalMinutes = totalMinutes % 60;

  return { hours: totalHours, minutes: totalMinutes };
};

export const processDaysForChart = (data) => {
  const processedData = {};
  
  data.forEach(entry => {
    const dayName = format(new Date(entry.date), "EEEE");
    processedData[dayName] = entry.hours + (entry.minutes + (entry.extraminutes || 0)) / 60;
  });

  return processedData;
};

export const generateChartData = (currentWeekData, previousWeekData) => {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  const processedCurData = processDaysForChart(currentWeekData || []);
  const processedPrevData = processDaysForChart(previousWeekData || []);

  return days.map(day => ({
    day,
    now: processedCurData[day] || 0,
    prev: processedPrevData[day] || 0
  }));
};

export const getProgressPercentage = (worked, target) => {
  if (target === 0) return 0;
  return Math.min((worked / target) * 100, 100);
};

export const getRemainingDaysInWeek = () => {
  const today = new Date().getDay(); // Sunday = 0
  const todayIndex = today === 0 ? 6 : today - 1; // Make Monday index 0
  return 7 - todayIndex;
};

export const calculateDailyTarget = (totalWorked, totalTarget, remainingDays) => {
  if (remainingDays === 0) return 0;
  const remaining = Math.max(0, totalTarget - totalWorked);
  return remaining / remainingDays;
};

export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

export const validateDateRange = (startDate, endDate) => {
  if (!startDate || !endDate) {
    return { isValid: false, error: 'Start date and end date are required' };
  }
  
  if (startDate > endDate) {
    return { isValid: false, error: 'Start date cannot be after end date' };
  }
  
  const daysDiff = Math.abs(endDate - startDate) / (1000 * 60 * 60 * 24);
  if (daysDiff > 31) {
    return { isValid: false, error: 'Date range cannot exceed 31 days' };
  }
  
  return { isValid: true };
};
