"use client";
import React, { useState } from "react";
import FloatingReport from "./Floating-Report";
import Header from "./Header";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import ReportChart from "./Report-Chart";
import TimeReport from "./time-report/time-report-main";
import { format, addDays, subDays,subWeeks, startOfWeek } from "date-fns";
// Data Variables
let chartData = [
    { day: "Saturday", desktop: 186, mobile: 80 },
    { day: "Sunday", desktop: 305, mobile: 200 },
    { day: "Monday", desktop: 237, mobile: 120 },
    { day: "Tuesday", desktop: 73, mobile: 190 },
    { day: "Wednesday", desktop: 209, mobile: 130 },
    { day: "Thursday", desktop: 214, mobile: 140 },
    { day: "Friday", desktop: 214, mobile: 140 },
  ]
let dataKeys=[{label:"Now",key:"mobile",color:"hsl(var(--chart-1))"},{label:"Prev",key:"desktop",color:"hsl(var(--chart-2))"}]
let mainKey="day"
export default function Main(){
    let dataUrl="http://192.168.0.2:88/"
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(startOfWeek(endDate, { weekStartsOn: 1 }));
    
    const changeWeek = (direction) => {
        if (direction === "prev") {
          setStartDate((prev) => subDays(prev, 7));
          setEndDate((prev) => subDays(prev, 7));
        } else {
          setStartDate((prev) => addDays(prev, 7));
          setEndDate((prev) => addDays(prev, 7));
        }
        fetchWorkData()
      };
    const fetchWorkData=() => {
        // Fetch work data for the current week
        console.log(`${dataUrl}work-data?startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`)
        fetch(`${dataUrl}work-data?startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(addDays(endDate,1), "yyyy-MM-dd")}`)
        .then((response) => response.json()).then(data=>console.log(data))
    }
    fetchWorkData()
    return (
        <div>
            <Header startDate={startDate} endDate={endDate} changeWeek={changeWeek} syncFunction={fetchWorkData} />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={24}>
                    <FloatingReport />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={56}>
                    <ReportChart chartData={chartData} dataKeys={dataKeys} mainKey={mainKey} />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={20}>
                    <TimeReport/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}