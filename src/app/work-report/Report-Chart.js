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
              dataKey="month"
              tickLine={false}
              tickMargin={10}
              axisLine={true}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis axisLine={true} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator="dashed" />} />
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
