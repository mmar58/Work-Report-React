"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format, addDays, subDays } from "date-fns";
import SyncButton from "@/lib/buttons/SyncButton";

const Header = () => {
  const [startDate, setStartDate] = useState(new Date(2025, 1, 10)); // Feb 10, 2025
  const [endDate, setEndDate] = useState(addDays(startDate, 6));

  const changeWeek = (direction) => {
    if (direction === "prev") {
      setStartDate((prev) => subDays(prev, 7));
      setEndDate((prev) => subDays(prev, 7));
    } else {
      setStartDate((prev) => addDays(prev, 7));
      setEndDate((prev) => addDays(prev, 7));
    }
  };

  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex items-center space-x-0">
        <SyncButton />
        <h1 className="text-3xl font-bold">Freelancer/Remote Job Report</h1>
      </div>
      <div className="flex items-center mt-2 space-x-4 text-green-500 text-xl">
        <button onClick={() => changeWeek("prev")} className="p-2 border rounded-lg hover:bg-gray-200">
          <ChevronLeft size={20} />
        </button>
        <span>{format(startDate, "yyyy-MM-dd")} to {format(endDate, "yyyy-MM-dd")}</span>
        <button onClick={() => changeWeek("next")} className="p-2 border rounded-lg hover:bg-gray-200">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
