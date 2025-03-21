import TimeReportComponent from "./time-report-component";

export default function TimeReport({curweekData,prevweekData}){
    return (
        <div>
            {curweekData&&curweekData.slice().reverse().map((entry,index) => {
                return <TimeReportComponent key={index} date={entry.date}/>
            })}
        </div>
    )
}