import React, { useState, useEffect } from 'react';
import { getDay } from 'date-fns';
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
const getTodayIndex = () => {
  const today = getDay(new Date()); // Sunday = 0
  return today === 0 ? 6 : today - 1; // Make Monday index 0
};

const WorkGoalTracker = ({ workedHours, workedMinutes,todaysWorkedHours }) => {
  const [targetHours, setTargetHours] = useState(40);
  const [apiLink, setApiLink] = useState("")
  const [totalWorked, setTotalWorked] = useState(0);
  const [percentageReached, setPercentageReached] = useState(0);
  const [remainingDays, setRemainingDays] = useState(0);
  const [remainingHours, setRemainingHours] = useState(0);
  const [hoursPerRemainingDay, setHoursPerRemainingDay] = useState(0);

  useEffect(() => {
    setApiLink("http://"+window.location.hostname+":88/")
  }, []);
  useEffect(() => {
    const workedTotal = workedHours + workedMinutes / 60;
    const todayIndex = getTodayIndex();
    const remaining = 7 - todayIndex;
    const remainingHrs = Math.max(0, targetHours - workedTotal)+todaysWorkedHours;
    const percentage = ((workedTotal / targetHours) * 100).toFixed(1);
    const dailyTarget = remaining > 0 ? (remainingHrs / remaining).toFixed(2) : 0;
    fetch(apiLink+"getTargetHours").then(res=>res.text()).then(hours=>{let curHour=parseInt(hours);console.log(curHour);if(curHour!=targetHours) setTargetHours(curHour)})
    setTotalWorked(workedTotal);
    setPercentageReached(Number(percentage));
    setRemainingDays(remaining);
    setRemainingHours(remainingHrs);
    setHoursPerRemainingDay(dailyTarget);
  }, [workedHours, workedMinutes, targetHours]);

  return (
    <div className="m-2 z-50 w-72">
      <Card className="shadow-md rounded-xl p-3">
        <CardContent className="space-y-3 p-0">
          <div className="flex justify-between items-center mb-2">
            <h3 className="text-base font-semibold">🗓️ Weekly Tracker</h3>
            <div className="flex items-center space-x-2">
              <Label htmlFor="targetHours" className="text-xs">🎯</Label>
              <Input
                id="targetHours"
                type="number"
                value={targetHours}
                onChange={e => {
                  setTargetHours(Number(e.target.value));
                  fetch(apiLink+"setTargetHours?hours="+e.target.value)
                }}
                className="w-16 h-7 px-2 text-xs"
              />
            </div>
          </div>

          <div>
            <Progress value={percentageReached} className="h-2" />
            <p className="text-xs text-muted-foreground mt-1">{percentageReached}% complete</p>
          </div>

          <div className="text-xs space-y-0.5">
            <p><strong>Worked:</strong> {workedHours}h {workedMinutes}m</p>
            <p><strong>Remain/Day:</strong> {hoursPerRemainingDay}h</p>
            <p><strong>Days Left:</strong> {remainingDays}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default WorkGoalTracker;