import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock3 } from "lucide-react"

// Utility to format date as "Monday 22/03/2025"
function formatDateLabel(dateString) {
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const date = new Date(dateString)
    const dayName = days[date.getDay()]
    const formatted = date.toLocaleDateString("en-GB") // DD/MM/YYYY
    return `${dayName} ${formatted}`
}

// Try to parse JSON or fallback to plain text format
function parseWorkData(rawData) {
    try {
        const parsed = JSON.parse(rawData)
        if (Array.isArray(parsed)) return parsed
    } catch {
        return rawData.split("\n").map(str => {
            const [range, duration] = str.split(" ")
            const [startTime, endTime] = range.split("-")
            return { startTime, endTime, duration }
        })
    }
    return []
}

// Helper to sum durations in "h:mm:ss" or "m:ss"
function getTotalDuration(data) {
    let totalSeconds = 0
    for (const session of data) {
        const parts = session.duration.split(":").map(Number)
        const [h, m, s] = parts.length === 3
            ? parts
            : parts.length === 2
                ? [0, ...parts]
                : [0, 0, 0]
        totalSeconds += h * 3600 + m * 60 + s
    }
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    return `${h}h ${m}m`
}

export default function TimeReportComponent({ date, data }) {
    const workSessions = parseWorkData(data)
    const total = getTotalDuration(workSessions)

    return (
        <Card className="mb-4 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 rounded-2xl">
            <CardHeader className="pb-2 flex items-center gap-2">
                <CardTitle className="text-base font-semibold text-gray-800">
                    {formatDateLabel(date)}
                </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 pt-0">
                <PerLineComponent data={workSessions} />
                <div className="text-xs text-right font-semibold text-gray-800 border-t pt-2 mt-2">
                    Total: {total}
                </div>
            </CardContent>
        </Card>
    )
}

export function PerLineComponent({ data }) {
    return (
        <div className="space-y-2">
            {data.map((session, i) => (
                <div
                    key={i}
                    className="flex justify-between items-center px-3 py-2 bg-gray-100 rounded-lg text-sm"
                >
                    <span className="font-medium text-gray-700">
                        {session.startTime} – {session.endTime}
                    </span>
                    <span className="text-gray-500">{session.duration}</span>
                </div>
            ))}
        </div>
    )
}
