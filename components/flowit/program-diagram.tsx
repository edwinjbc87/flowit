import { Diagram } from "@/entities/Diagram"
import { parseDiagram } from "@/libs/flowit/operations-parser"
import { useEffect, useState } from "react"
import flowchart from 'flowchart.js'
import useProgram from "@/hooks/useProgram"

export interface IProgram{
    diagram: Diagram;
}

export default function ProgramDiagram() {
    const {diagram, handler} = useProgram();

    useEffect(() => {
        handler.initDiagram().catch(er => console.error(er));
    }, [])

    useEffect(() => {
        //setDiagramContent(parseNodes(props.diagram.nodes, props.diagram.connections));
        if (typeof window !== "undefined" && document.querySelector('#diagram-container') != null) {
            console.log("Title", window.document.title);
            console.log("Diagram Content", parseDiagram(diagram));
            const dgr = flowchart.parse(parseDiagram(diagram));
            //dgr.drawSVG('diagram-container', {});
        }
        
    }, [diagram])

    return (
        <div>
            <h2>Program:</h2>
            <div id="diagram-container"></div>
        </div>
    );
}