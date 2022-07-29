import { createRef, useEffect, useRef } from "react";
import FlowChart from "flowchart.js";

export default function DiagramWrapper({content}){
    const dgCont = useRef(null);

    useEffect(() => {
        if (typeof window !== "undefined" && dgCont != null && !!content) {
            console.log("Content", content)
            dgCont.current.innerHTML = "";
            const dgr = FlowChart.parse(content)
            //dgr.clean()
            dgr.drawSVG(dgCont.current, {})
        }
    }, [content])

    return (<div ref={dgCont} id="diagram-container" key="diagram-container"></div>)
}