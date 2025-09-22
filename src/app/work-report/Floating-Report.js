"use client";
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function FloatingReport({
  totalWorkingHour,
  totalWorkingMinute,
  totalIncome,
  totalIncomeInDollar,
  dollarRate,
  startDate,
  endDate
}) {
  const [shortDesc, setShortDesc] = useState("");
  const [copied, setCopied] = useState(false);
  const reportRef = useRef();

  // Format week range from startDate and endDate
  const formatDate = (date) => {
    if (!date) return '';
    const d = new Date(date);
    return `${d.getMonth() + 1}.${d.getDate()}.${d.getFullYear().toString().slice(-2)}`;
  };
  const weekRange = `${formatDate(startDate)} - ${formatDate(endDate)}`;

  // Optional: persist shortDesc to local storage
  useEffect(() => {
    const saved = localStorage.getItem("shortDesc");
    if (saved) setShortDesc(saved);
  }, []);

  useEffect(() => {
    localStorage.setItem("shortDesc", shortDesc);
  }, [shortDesc]);

  const handleCopy = () => {
    if (reportRef.current) {
      const text = reportRef.current.innerText;
      navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1000);
    }
  };

  return (
    <div className="container relative left-0 mx-auto p-4 max-w-lg">
      {copied && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-500 text-white px-4 py-2 rounded shadow-lg z-50">
          Copied to clipboard!
        </div>
      )}
      <Card className="shadow-lg rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <Input
            type="text"
            value={`Dollar R - ${dollarRate}`}
            readOnly
            className="w-1/2"
          />
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleCopy}>
              Copy
            </Button>
            <Button variant="destructive" onClick={() => window.close()}>
              Close
            </Button>
          </div>
        </div>
        <CardContent className="space-y-2" ref={reportRef}>
          <Input
            placeholder="Enter short description"
            value={shortDesc}
            onChange={(e) => setShortDesc(e.target.value)}
          />
          <p className="text-gray-600">
            <strong>Date Range:</strong> {weekRange}
          </p>
          <p className="text-gray-600">
            <strong>Short Desc:</strong> {shortDesc || "N/A"}
          </p>
          <p className="text-gray-600">
            <strong>Total:</strong> {totalWorkingHour || 0} hours {totalWorkingMinute || 0} minutes
          </p>
          <p className="text-gray-600">
            <strong>BDT:</strong> {totalIncome}
          </p>
          <p className="text-gray-600">
            <strong>USD (from Google):</strong> {totalIncomeInDollar}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
