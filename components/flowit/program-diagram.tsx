import { Diagram } from "@/entities/Diagram"
import { parseDiagram } from "@/libs/flowit/operations-parser"
import { useEffect, useState } from "react"
import flowchart from 'flowchart.js'
import useProgram from "@/hooks/useProgram"
import dynamic from 'next/dynamic'

export interface IProgram{
    diagram: Diagram;
}

const DynamicDiagramWrapperWithNoSSR = dynamic(
    () => import('./diagram-wrapper'),
    { ssr: false }
)

export default function ProgramDiagram() {
    const {diagram, handler} = useProgram();
    const [diagramContent, setDiagramContent] = useState<string>("");

    useEffect(() => {
        handler.initDiagram().catch(er => console.error(er));
    }, [])

    useEffect(() => {
        setDiagramContent(parseDiagram(diagram));
    }, [diagram])

    return (
        <div>
            <h2>Program:</h2>
            {!!diagramContent && <DynamicDiagramWrapperWithNoSSR content={diagramContent} />}
        </div>
    );
}