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
import { format, addDays, subWeeks, startOfWeek, endOfWeek, isBefore, isSameDay, isWithinInterval, startOfDay, subDays } from "date-fns";
import WorkGoalTracker from "./WorkGoalTracker";
let mainKey = "day"; // Key used for the chart
let lastFetchedTime = 0;

export default function Main() {
  // Get last Monday and Sunday as the initial date range
  const today = new Date();
  const lastMonday = startOfWeek(today, { weekStartsOn: 1 });
  const lastSunday = endOfWeek(today, { weekStartsOn: 1 });

  // State variables
  const [startDate, setStartDate] = useState(lastMonday);
  const [endDate, setEndDate] = useState(lastSunday);
  const [chartData, setChartData] = useState([]);
  const [curWeekData, setCurWeekData] = useState(null);
  const [prevWeekData, setPrevWeekData] = useState(null);
  // Work data
  const [totalHours, setTotalHours] = useState(0)
  const [totalMinutes, setTotalMinutes] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalIncomeInDollar, setTotalIncomeInDollar] = useState(0)
  const [hourlyRate, setHourlyRate] = useState(0)
  const [dollarRate, setDollarRate] = useState(0)
  const [direction, setDirection] = useState("horizontal");


  // Chart legend & data keys
  let dataKeys = [
    { label: "Now", key: "now", color: "hsl(var(--chart-2))" },
    { label: "Prev", key: "prev", color: "hsl(var(--chart-1))" },
  ];

  /**
   * Changes the selected week (forward or backward).
   * Ensures the next week does not exceed today's date.
   */
  const changeWeek = (direction) => {
    if (direction === "prev") {
      let { newStartDate, newEndDate } = getPrevWeek();
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

  /**
   * Returns the previous week's start and end dates.
   */
  function getPrevWeek() {
    const newStartDate = subWeeks(startDate, 1);
    const newEndDate = endOfWeek(newStartDate, { weekStartsOn: 1 });
    return { newStartDate, newEndDate };
  }

  /**
   * Fetches work data for both the current and previous week.
   * Uses `Promise.all` to fetch them in parallel.
   */
  function fetchWorkData() {
    lastFetchedTime = Date.now();
    let dataUrl = "http://"+window.location.hostname+":88/"
    console.log(startDate, endDate,Date.now())
    const formattedCurStartDate = format(startDate, "yyyy-MM-dd");
    const formattedCurEndDate = format(endDate, "yyyy-MM-dd");
    const prevWeekDate = getPrevWeek();
    const formattedPrevStartDate = format(prevWeekDate.newStartDate, "yyyy-MM-dd");
    const formattedPrevEndDate = format(prevWeekDate.newEndDate, "yyyy-MM-dd");

    const isTodayInCurrentWeek = isWithinInterval(startOfDay(today), {
      start: startOfDay(startDate),
      end: startOfDay(endDate),
    });
    const todaysFormatDate = format(today, "yyyy-MM-dd");

    let curWeekRequest = `${dataUrl}work-data?startDate=${formattedCurStartDate}&endDate=${formattedCurEndDate}`
    console.log(curWeekRequest,Date.now())
    console.trace()
    // Fetch current and previous week data in parallel
    Promise.all([
      fetch(curWeekRequest).then(res => res.json()),
      fetch(`${dataUrl}work-data?startDate=${formattedPrevStartDate}&endDate=${formattedPrevEndDate}`).then(res => res.json())
    ]).then(([curData, prevData]) => {
      // Calculating total cur week working time
      console.group("feteched data",Date.now())
      console.log("Cur Data:", curData)
      console.log("Prev Data:", prevData)
      console.trace()
      console.groupEnd()
      let totalMinutes = 0, totalHours = 0;
      let hasTodayData = false;
      curData.forEach(entry => {
        totalHours += entry.hours
        totalMinutes += entry.minutes + entry.extraminutes
        totalHours += Math.floor(totalMinutes / 60)
        totalMinutes %= 60
        // Checking if we have today's data in the current week
        if (isTodayInCurrentWeek && !hasTodayData) {
          if (entry.date == todaysFormatDate) hasTodayData = true;
        }
      });
      if (isTodayInCurrentWeek) {
        if (hasTodayData) {
          fetch(dataUrl + "worktime").then(res => res.json()).then(data => {
            for (let i = 0; i < data.length; i++) {
              let dateData = data[i].date.split("-")
              data[i].date = dateData[2] + "-" + dateData[1] + "-" + dateData[0]
              let dateDataFound = false;
              for (let j = 0; j < curData.length; j++) {
                if (curData[j].date == data[i].date) {
                  curData[j].hours = data[i].hours
                  curData[j].minutes = data[i].minutes
                  curData[j].seconds = data[i].seconds
                  dateDataFound = true;
                  console.log("Date data found for " + data[i].date, Date.now)
                  break;
                }
                
              }
              if (!dateDataFound) {
                console.log("Date data not found for " + data[i].date, Date.now)
                curData.push(data[i])
              }
            }
            // Recalculating total time
            totalMinutes = 0, totalHours = 0;
            curData.forEach(entry => {
              totalHours += entry.hours
              totalMinutes += entry.minutes + entry.extraminutes
              totalHours += Math.floor(totalMinutes / 60)
              totalMinutes %= 60
            });
            console.log("Updated cur data:", curData, Date.now())
            setTotalHours(totalHours)
            setTotalMinutes(totalMinutes)
            // Updating week data
            setCurWeekData(curData);
            setPrevWeekData(prevData);
          })
        } else {
          fetch(dataUrl + "worktime?dates=" + format(subDays(today, 1), "dd-MM-yyyy") + "," + format(today, "dd-MM-yyyy")).then(res => res.json()).then(data => {
            console.log("Work Time:", data, Date.now())
            for (let i = 0; i < data.length; i++) {
              let dateData = data[i].date.split("-")
              data[i].date = dateData[2] + "-" + dateData[1] + "-" + dateData[0]
              let dateDataFound = false;
              for (let j = 0; j < curData.length; j++) {
                if (curData[j].date == data[i].date) {
                  curData[j].hours = data[i].hours
                  curData[j].minutes = data[i].minutes
                  curData[j].seconds = data[i].seconds
                  dateDataFound = true;
                  console.log("Date data found for " + data[i].date, Date.now)
                  break;
                }
                
              }
              if (!dateDataFound) {
                console.log("Date data not found for " + data[i].date, Date.now)
                curData.push(data[i])
              }
            }
            // Recalculating total time
            totalMinutes = 0, totalHours = 0;
            curData.forEach(entry => {
              totalHours += entry.hours
              totalMinutes += entry.minutes + entry.extraminutes
              totalHours += Math.floor(totalMinutes / 60)
              totalMinutes %= 60
            });
            console.log("Updated cur data:", curData, Date.now())
            setTotalHours(totalHours)
            setTotalMinutes(totalMinutes)
            // Updating week data
            setCurWeekData(curData);
            setPrevWeekData(prevData);
          })
        }

      } else {
        setTotalHours(totalHours)
        setTotalMinutes(totalMinutes)
        // Updating week data
        setCurWeekData(curData);
        setPrevWeekData(prevData);
      }

    }).catch(error => console.error("Error fetching data:", error));
  }

  /**
   * Processes the fetched data to convert it into a format usable by the chart.
   */
  function processDays(data, isPrev) {
    let processedData = {};
    data.forEach(entry => {
      let dayName = format(new Date(entry.date), "EEEE");
      processedData[dayName] = entry.hours + (entry.minutes + entry.extraminutes) / 60;
    });
    return processedData;
  }

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

  /**
   * Updates chart data only after both current and previous week data are available.
   */
  useEffect(() => {
    if (curWeekData && prevWeekData) {
      let newChartData = [
        { day: "Monday", now: 0, prev: 0 },
        { day: "Tuesday", now: 0, prev: 0 },
        { day: "Wednesday", now: 0, prev: 0 },
        { day: "Thursday", now: 0, prev: 0 },
        { day: "Friday", now: 0, prev: 0 },
        { day: "Saturday", now: 0, prev: 0 },
        { day: "Sunday", now: 0, prev: 0 },
      ];

      let processedCurData = processDays(curWeekData, false);
      let processedPrevData = processDays(prevWeekData, true);

      newChartData = newChartData.map(dayEntry => ({
        ...dayEntry,
        now: processedCurData[dayEntry.day] || 0,
        prev: processedPrevData[dayEntry.day] || 0
      }));

      setChartData(newChartData);
    }
  }, [curWeekData, prevWeekData]);
  useEffect(() => {
    fetchWorkData();
  },[startDate,endDate])
  /**
   * Fetches work data when the component mounts or when the startDate changes.
   */
  useEffect(() => {
    if(Date.now() - lastFetchedTime>100){
      console.log("Fetching data",Date.now(),lastFetchedTime,Date.now() - lastFetchedTime)
      fetchWorkData();
    }

    // Set up interval to refresh data every 5 minutes (300,000 milliseconds)
    const intervalId = setInterval(() => {
      fetchWorkData();
    }, 300000);

    // Cleanup function to clear the interval when component unmounts
    return () => clearInterval(intervalId);
  }, [startDate]);

  useEffect(() => {
    setTotalIncome(totalHours * hourlyRate + totalMinutes * hourlyRate / 60)
  }, [hourlyRate, totalHours, totalMinutes])
  useEffect(() => {
    setTotalIncomeInDollar(totalIncome / dollarRate)
  }, [totalIncome])

  useEffect(() => {
    fetch(`${"http://"+window.location.hostname+":88/"}hourlyRate`).then(res => res.text()).then(data => { setHourlyRate(parseFloat(data)); console.log(hourlyRate); })
    fetch("http://www.geoplugin.net/json.gp?ip=103.205.134.44").then(result => { return result.json() }).then(json => { setDollarRate(json["geoplugin_currencyConverter"]) });
  }
    , [])
  return (
    <div className="h-screen flex flex-col">
      {/* Header */}
      <Header startDate={startDate} endDate={endDate} changeWeek={changeWeek} syncFunction={fetchWorkData} />

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
          />
        </ResizablePanel>

        <ResizableHandle />

        {/* Report Chart Panel (Center on Desktop, Middle on Mobile) */}
        <ResizablePanel
          defaultSize={56}
          className="w-full lg:w-1/2 overflow-y-auto p-2"
        >
          <ReportChart chartData={chartData} dataKeys={dataKeys} mainKey="day" />
        </ResizablePanel>

        <ResizableHandle />

        {/* Time Report Panel (Right on Desktop, Bottom on Mobile) */}
        <ResizablePanel
          defaultSize={20}
          className="w-full lg:w-1/4 overflow-y-auto p-2"
        >
          <ResizablePanelGroup direction={direction == "horizontal" ? "vertical" : "horizontal"}>
            <ResizablePanel defaultSize={direction == "horizontal" ? 40 : 30}>
              <WorkGoalTracker workedHours={totalHours} workedMinutes={totalMinutes} />
            </ResizablePanel>
            <ResizablePanel>
              <TimeReport curweekData={curWeekData} prevweekData={prevWeekData} />
            </ResizablePanel>
          </ResizablePanelGroup>

        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
