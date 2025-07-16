"use client";
import React, { useEffect, useState } from "react";
import FloatingReport from "./Floating-Report";
import Header from "./Header";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import ReportChart from "./Report-Chart";
import TimeReport from "./time-report/time-report-main";
import { addDays, startOfWeek, endOfWeek, isBefore, isSameDay } from "date-fns";
import WorkGoalTracker from "./WorkGoalTracker";
import ErrorBoundary from "@/components/ErrorBoundary";
import { useWorkData } from "@/hooks/useWorkData";
import { generateChartData } from "@/utils/helpers";
import apiService from "@/services/api";
import config from "@/config";

export default function Main() {
  // Date state
  const today = new Date();
  const [startDate, setStartDate] = useState(startOfWeek(today, { weekStartsOn: 1 }));
  const [endDate, setEndDate] = useState(endOfWeek(today, { weekStartsOn: 1 }));
  
  // UI state
  const [direction, setDirection] = useState("horizontal");
  
  // Financial state
  const [hourlyRate, setHourlyRate] = useState(config.DEFAULT_HOURLY_RATE);
  const [dollarRate, setDollarRate] = useState(0);
  const [totalIncome, setTotalIncome] = useState(0);
  const [totalIncomeInDollar, setTotalIncomeInDollar] = useState(0);
  const [previousWeekWork, setPreviousWorkedHours] = useState({ hours: 0, minutes: 0 });

  // Use custom hook for work data
  const {
    curWeekData,
    prevWeekData,
    todaysWorkedHour,
    totalHours,
    totalMinutes,
    isLoading,
    error,
    refetch
  } = useWorkData(startDate, endDate);

  // Chart data
  const chartData = generateChartData(curWeekData, prevWeekData);
  
  // Chart configuration
  const dataKeys = [
    { label: "Now", key: "now", color: "hsl(var(--chart-2))" },
    { label: "Prev", key: "prev", color: "hsl(var(--chart-1))" },
  ];

  /**
   * Changes the selected week (forward or backward).
   * Ensures the next week does not exceed today's date.
   */
  const changeWeek = (direction) => {
    if (direction === "prev") {
      const newStartDate = addDays(startDate, -7);
      const newEndDate = endOfWeek(newStartDate, { weekStartsOn: 1 });
      setStartDate(newStartDate);
      setEndDate(newEndDate);
    } else {
      // Move forward one week while ensuring we do not go beyond today
      const newStartDate = addDays(startDate, 7);
      const newEndDate = endOfWeek(newStartDate, { weekStartsOn: 1 });

      if (isBefore(newStartDate, today) || isSameDay(newStartDate, today)) {
        setStartDate(newStartDate);
        setEndDate(newEndDate > today ? today : newEndDate);
      }
    }
  };

  // Function to check screen width & height and update direction
  const updateDirection = () => {
    if (window.innerWidth < window.innerHeight) {
      setDirection("vertical"); // Use vertical stacking when width < height
    } else {
      setDirection("horizontal"); // Use horizontal layout for wider screens
    }
  };

  useEffect(() => {
    updateDirection(); // Check initial state
    window.addEventListener("resize", updateDirection); // Listen for changes
    return () => window.removeEventListener("resize", updateDirection); // Cleanup
  }, []);

  // Calculate previous week worked hours when prevWeekData changes
  useEffect(() => {
    if (prevWeekData) {
      let totalPreviousTime = { hours: 0, minutes: 0 };
      prevWeekData.forEach(entry => {
        totalPreviousTime.hours += entry.hours;
        totalPreviousTime.minutes += entry.minutes + entry.extraminutes + (entry.seconds || 0) / 60;
      });
      
      const tempHours = Math.floor(totalPreviousTime.minutes / 60);
      totalPreviousTime.minutes = Math.floor(totalPreviousTime.minutes % 60);
      totalPreviousTime.hours += tempHours;
      
      setPreviousWorkedHours(totalPreviousTime);
    }
  }, [prevWeekData]);

  // Calculate income when total hours/minutes or hourly rate changes
  useEffect(() => {
    setTotalIncome(totalHours * hourlyRate + totalMinutes * hourlyRate / 60);
  }, [hourlyRate, totalHours, totalMinutes]);

  // Calculate income in dollars when total income or dollar rate changes
  useEffect(() => {
    setTotalIncomeInDollar(dollarRate > 0 ? totalIncome / dollarRate : 0);
  }, [totalIncome, dollarRate]);

  // Load initial rates and currency data
  useEffect(() => {
    const loadInitialData = async () => {
      try {
        const [hourlyRateData, currencyData] = await Promise.all([
          apiService.getHourlyRate().catch(() => config.DEFAULT_HOURLY_RATE),
          apiService.getCurrencyRate().catch(() => 1)
        ]);
        
        setHourlyRate(hourlyRateData);
        setDollarRate(currencyData);
      } catch (error) {
        console.error('Error loading initial data:', error);
      }
    };

    loadInitialData();
  }, []);
  return (
    <ErrorBoundary>
      <div className="h-screen flex flex-col">
        {/* Header */}
        <Header 
          startDate={startDate} 
          endDate={endDate} 
          changeWeek={changeWeek} 
          syncFunction={refetch}
          isLoading={isLoading}
        />

        {/* Show error message if there's an error */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mx-4 mt-2">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Responsive Layout: Uses flex-column for mobile, horizontal for larger screens */}
        <ResizablePanelGroup
          direction={direction}
          className="flex flex-col lg:flex-row w-full h-full"
        >
          {/* Floating Report Panel (Left on Desktop, Top on Mobile) */}
          <ResizablePanel
            defaultSize={24}
            className="w-full lg:w-1/4 overflow-y-auto p-2"
          >
            <FloatingReport
              totalWorkingHour={totalHours}
              totalWorkingMinute={totalMinutes}
              totalIncome={totalIncome}
              totalIncomeInDollar={totalIncomeInDollar}
              dollarRate={dollarRate}
              isLoading={isLoading}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* Report Chart Panel (Center on Desktop, Middle on Mobile) */}
          <ResizablePanel
            defaultSize={56}
            className="w-full lg:w-1/2 overflow-y-auto p-2"
          >
            <ReportChart 
              chartData={chartData} 
              dataKeys={dataKeys} 
              mainKey="day"
              isLoading={isLoading}
            />
          </ResizablePanel>

          <ResizableHandle />

          {/* Time Report Panel (Right on Desktop, Bottom on Mobile) */}
          <ResizablePanel
            defaultSize={20}
            className="w-full lg:w-1/4 overflow-y-auto p-2"
          >
            <ResizablePanelGroup direction={direction === "horizontal" ? "vertical" : "horizontal"}>
              <ResizablePanel defaultSize={direction === "horizontal" ? 30 : 30}>
                <WorkGoalTracker 
                  workedHours={totalHours} 
                  workedMinutes={totalMinutes} 
                  todaysWorkedHours={todaysWorkedHour} 
                  previousWorkedHours={previousWeekWork}
                  isLoading={isLoading}
                />
              </ResizablePanel>
              <ResizablePanel>
                <TimeReport 
                  curweekData={curWeekData} 
                  prevweekData={prevWeekData}
                  isLoading={isLoading}
                />
              </ResizablePanel>
            </ResizablePanelGroup>
          </ResizablePanel>
        </ResizablePanelGroup>
      </div>
    </ErrorBoundary>
  );
}
