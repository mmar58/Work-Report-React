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

const chartData = [
  { month: "Saturday", desktop: 186, mobile: 80 },
  { month: "Sunday", desktop: 305, mobile: 200 },
  { month: "Monday", desktop: 237, mobile: 120 },
  { month: "Tuesday", desktop: 73, mobile: 190 },
  { month: "Wednesday", desktop: 209, mobile: 130 },
  { month: "Thursday", desktop: 214, mobile: 140 },
  { month: "Friday", desktop: 214, mobile: 140 },
]

const chartConfig = {
  desktop: {
    label: "Desktop",
    color: "hsl(var(--chart-1))",
  },
  mobile: {
    label: "Mobile",
    color: "hsl(var(--chart-2))",
  },
}

export default function ReportChart() {
  const [selected, setSelected] = useState("Month")

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
          <BarChart data={chartData}>
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
            <Bar dataKey="desktop" fill="var(--color-desktop)" radius={4} />
            <Bar dataKey="mobile" fill="var(--color-mobile)" radius={4} />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
