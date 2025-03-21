"use client"

import { useState } from "react"
import { TrendingUp } from "lucide-react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { Button } from "@/components/ui/button"

const CustomTooltip = ({ active, payload, label, chartConfig }) => {
  if (!active || !payload || payload.length === 0) return null;
  // console.log(payload)
  return (
    <div className="bg-white p-3 shadow-md rounded-lg border border-gray-200">
      <p className="text-sm font-semibold text-gray-700">{label}</p>
      {payload.map((entry, index) => (
        <div key={index} className="flex items-center gap-2">
          <span
            className="inline-block w-3 h-3 rounded-full"
            style={{ backgroundColor: entry.color }}
          />
          <span className="text-sm text-gray-900">
            {chartConfig[entry.dataKey]?.label || entry.name}: {entry.value}
          </span>
        </div>
      ))}
    </div>
  );
};

export default function ReportChart(data) {
  const [selected, setSelected] = useState("Month")
  console.log(data)

  let chartConfig = {
  }
  
  data.dataKeys.map((key) =>{
    chartConfig[key.key] = {
      label:key.label,
    }
  })
  return (
    <Card>
      <CardHeader className="flex flex-col items-center gap-4">
        <CardTitle>Report Chart</CardTitle>
        <div className="flex justify-center gap-4">
          {["Week", "Month", "Year"].map((label) => (
            <Button
              key={label}
              onClick={() => setSelected(label)}
              className={`px-4 py-2 ${
                selected === label ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {label}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig}>
          <BarChart data={data.chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey={data.mainKey}
              tickLine={false}
              tickMargin={10}
              axisLine={true} 
              tickFormatter={(value) => value}
            />
            <YAxis axisLine={true} />
            <ChartTooltip cursor={false} content={(props)=><CustomTooltip {...props} chartConfig={chartConfig}/>} />
            {
              data.dataKeys.map((key) => {
                return <Bar onClick={(data)=>console.log(data)} key={key.key} dataKey={key.key} fill={key.color} radius={4} />
              })
            }
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
