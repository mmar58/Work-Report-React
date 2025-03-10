"use client";
import React, { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import SyncButton from "@/lib/buttons/SyncButton";

const Header = ({syncFunction,changeWeek,startDate,endDate}) => {
  return (
    <div className="flex flex-col items-center mt-6">
      <div className="flex items-center space-x-0">
        <SyncButton onSync={syncFunction} />
        <h1 className="text-3xl font-bold">Freelancer/Remote Job Report</h1>
      </div>
      <div className="flex items-center mt-2 space-x-4 text-green-500 text-xl">
        <button onClick={() => changeWeek("prev")} className="p-2 border rounded-lg hover:bg-gray-200">
          <ChevronLeft size={20} />
        </button>
        <span>{format(startDate, "dd-MM-yyyy")} to {format(endDate, "dd-MM-yyyy")}</span>
        <button onClick={() => changeWeek("next")} className="p-2 border rounded-lg hover:bg-gray-200">
          <ChevronRight size={20} />
        </button>
      </div>
    </div>
  );
};

export default Header;
