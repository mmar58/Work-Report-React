import FloatingReport from "./Floating-Report";
import Header from "./Header";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import ReportChart from "./Report-Chart";
import TimeReport from "./time-report/time-report-main";
export default function Main(){
    return (
        <div>
            <Header />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={24}>
                    <FloatingReport />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={56}>
                    <ReportChart />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel defaultSize={20}>
                    <TimeReport/>
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}