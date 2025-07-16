// Custom hook for work data management
import { useState, useEffect, useCallback } from 'react';
import { format, subWeeks, endOfWeek, startOfDay, isWithinInterval, subDays } from 'date-fns';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || `http://${typeof window !== 'undefined' ? window.location.hostname : 'localhost'}:88`;

export const useWorkData = (startDate, endDate) => {
  const [curWeekData, setCurWeekData] = useState(null);
  const [prevWeekData, setPrevWeekData] = useState(null);
  const [todaysWorkedHour, setTodaysWorkedHour] = useState(0);
  const [totalHours, setTotalHours] = useState(0);
  const [totalMinutes, setTotalMinutes] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const getPrevWeek = useCallback(() => {
    const newStartDate = subWeeks(startDate, 1);
    const newEndDate = endOfWeek(newStartDate, { weekStartsOn: 1 });
    return { newStartDate, newEndDate };
  }, [startDate]);

  const fetchWorkData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const formattedCurStartDate = format(startDate, "yyyy-MM-dd");
      const formattedCurEndDate = format(endDate, "yyyy-MM-dd");
      const prevWeekDate = getPrevWeek();
      const formattedPrevStartDate = format(prevWeekDate.newStartDate, "yyyy-MM-dd");
      const formattedPrevEndDate = format(prevWeekDate.newEndDate, "yyyy-MM-dd");

      const today = new Date();
      const isTodayInCurrentWeek = isWithinInterval(startOfDay(today), {
        start: startOfDay(startDate),
        end: startOfDay(endDate),
      });

      // Fetch current and previous week data in parallel
      const [curDataResponse, prevDataResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/work-data?startDate=${formattedCurStartDate}&endDate=${formattedCurEndDate}`),
        fetch(`${API_BASE_URL}/work-data?startDate=${formattedPrevStartDate}&endDate=${formattedPrevEndDate}`)
      ]);

      if (!curDataResponse.ok || !prevDataResponse.ok) {
        throw new Error('Failed to fetch work data');
      }

      const [curData, prevData] = await Promise.all([
        curDataResponse.json(),
        prevDataResponse.json()
      ]);

      // Calculate total working time
      let totalMinutes = 0;
      let totalHours = 0;
      
      curData.forEach(entry => {
        totalHours += entry.hours;
        totalMinutes += entry.minutes + entry.extraminutes;
        totalHours += Math.floor(totalMinutes / 60);
        totalMinutes %= 60;
      });

      // Handle today's data if in current week
      if (isTodayInCurrentWeek) {
        const todaysFormatDate = format(today, "yyyy-MM-dd");
        const hasTodayData = curData.some(entry => entry.date === todaysFormatDate);
        
        const workTimeUrl = hasTodayData 
          ? `${API_BASE_URL}/worktime`
          : `${API_BASE_URL}/worktime?dates=${format(subDays(today, 1), "dd-MM-yyyy")},${format(today, "dd-MM-yyyy")}`;

        const workTimeResponse = await fetch(workTimeUrl);
        if (workTimeResponse.ok) {
          const workTimeData = await workTimeResponse.json();
          
          workTimeData.forEach(timeEntry => {
            const dateData = timeEntry.date.split("-");
            timeEntry.date = `${dateData[2]}-${dateData[1]}-${dateData[0]}`;
            
            const existingEntry = curData.find(entry => entry.date === timeEntry.date);
            if (existingEntry) {
              existingEntry.hours = timeEntry.hours;
              existingEntry.minutes = timeEntry.minutes;
              existingEntry.seconds = timeEntry.seconds;
              
              if (existingEntry.date === todaysFormatDate) {
                setTodaysWorkedHour(
                  existingEntry.hours + 
                  (existingEntry.minutes + existingEntry.extraminutes + existingEntry.seconds / 60) / 60
                );
              }
            } else {
              curData.push(timeEntry);
            }
          });

          // Recalculate totals
          totalMinutes = 0;
          totalHours = 0;
          curData.forEach(entry => {
            totalHours += entry.hours;
            totalMinutes += entry.minutes + entry.extraminutes;
            totalHours += Math.floor(totalMinutes / 60);
            totalMinutes %= 60;
          });
        }
      }

      setTotalHours(totalHours);
      setTotalMinutes(totalMinutes);
      setCurWeekData(curData);
      setPrevWeekData(prevData);

    } catch (err) {
      setError(err.message);
      console.error('Error fetching work data:', err);
    } finally {
      setIsLoading(false);
    }
  }, [startDate, endDate, getPrevWeek]);

  useEffect(() => {
    fetchWorkData();
  }, [fetchWorkData]);

  return {
    curWeekData,
    prevWeekData,
    todaysWorkedHour,
    totalHours,
    totalMinutes,
    isLoading,
    error,
    refetch: fetchWorkData
  };
};
