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
import { format, addDays, subDays } from "date-fns";
export default function Main(){
    let dataUrl="http://192.168.0.2:88/"
    const [endDate, setEndDate] = useState(new Date());
    const [startDate, setStartDate] = useState(subDays(endDate, 6));
    
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
        fetch(`${dataUrl}work-data?startDate=${format(startDate, "yyyy-MM-dd")}&endDate=${format(endDate, "yyyy-MM-dd")}`)
        .then((response) => response.json()).then(data=>console.log(data))
    }
    fetchWorkData()
    return (
        <div>
            <Header startDate={startDate} endDate={endDate} changeWeek={changeWeek} />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={24}>
                    <FloatingReport />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={56}>
                    <ReportChart />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={20}>
                    <TimeReport/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}