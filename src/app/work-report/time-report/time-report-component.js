import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TimeReportComponent() {
    return (
        <Card className="p-2"> {/* Reduced overall padding */}
            <CardHeader className="pb-1"> {/* Reduced padding bottom */}
                <CardTitle className="text-lg font-semibold">TuesDay</CardTitle>
            </CardHeader>
            <CardContent>
                <PerLineComponent />
            </CardContent>
        </Card>
    )
}
export function PerLineComponent() {
    return (
        <div className="flex justify-between items-center">
            <span className="text-left">90:30PM - 11:30PM</span>
            <span className="text-right">2.5 hours</span>
        </div>
    )
}
