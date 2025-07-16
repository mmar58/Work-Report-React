import TimeReportComponent from "./time-report-component";

export default function TimeReport({ curweekData, prevweekData }) {
    return (
        <div className="h-[78vh] overflow-y-scroll px-4 py-6">
            {curweekData && curweekData.slice().reverse().map((entry, index) => (
                <TimeReportComponent key={`cur-${index}`} date={entry.date} data={entry.detailedWork} hours={entry.hours} minutes={entry.minutes} extraMinutes={entry.extraminutes}/>
            ))}
            {prevweekData && prevweekData.slice().reverse().map((entry, index) => (
                <TimeReportComponent key={`prev-${index}`} date={entry.date} data={entry.detailedWork} />
            ))}
        </div>
    );
}
