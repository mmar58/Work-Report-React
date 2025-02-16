import FloatingReport from "./Floating-Report";
import Header from "./Header";
import {
    ResizableHandle,
    ResizablePanel,
    ResizablePanelGroup,
  } from "@/components/ui/resizable"
import ReportChart from "./Report-Chart";
export default function Main(){
    return (
        <div>
            <Header />
            <ResizablePanelGroup direction="horizontal">
                <ResizablePanel defaultSize={30}>
                    <FloatingReport />
                </ResizablePanel>
                <ResizableHandle />
                <ResizablePanel>
                    <ReportChart />
                </ResizablePanel>
            </ResizablePanelGroup>
        </div>
    )
}