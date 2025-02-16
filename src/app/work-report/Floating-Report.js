"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FloatingReport() {
  const [dollarRate, setDollarRate] = useState(120);
  const workDetails = {
    description: "Worked on fixing journey creator issues",
    dateRange: "02.10.25 - 02.16.25",
    totalTime: "19 hours 59 minutes",
    amountBDT: 8118.2291666667,
    amountUSD: 67.17674620407236,
  };
//   fetch("http://www.geoplugin.net/json.gp?ip=103.205.134.44").then(result=>{ return result.json()}).then(json=>{setDollarRate(json["geoplugin_currencyConverter"])});
  return (
    <div className="container relative left-0 mx-auto p-4 max-w-lg">
      <Card className="shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Input type="text" value={`Dollar Rate ${dollarRate}`} readOnly className="w-1/2" />
          <div className="flex gap-2">
            <Button variant="outline">Copy</Button>
            <Button variant="destructive">Close</Button>
          </div>
        </div>
        <CardContent>
          <p className="text-lg font-semibold">{workDetails.description}</p>
          <p className="text-gray-600">
            <strong>Date Range:</strong> {workDetails.dateRange}
          </p>
          <p className="text-gray-600">
            <strong>Short Desc:</strong> {workDetails.description}
          </p>
          <p className="text-gray-600">
            <strong>Total:</strong> {workDetails.totalTime}
          </p>
          <p className="text-gray-600">
            <strong>BDT:</strong> {workDetails.amountBDT.toFixed(2)}
          </p>
          <p className="text-gray-600">
            <strong>USD (from Google):</strong> {workDetails.amountUSD.toFixed(2)}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
