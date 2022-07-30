import { Diagram } from "@/entities/Diagram"
import { parseDiagram } from "@/libs/flowit/operations-parser"
import { useEffect, useState } from "react"
import flowchart from 'flowchart.js'
import useProgram from "@/hooks/useProgram"
import dynamic from 'next/dynamic'
import { FormattedMessage, useIntl } from "react-intl"
import ReactFlow, { MiniMap, Controls } from 'react-flow-renderer'
import { NodeConnectionType } from "@/entities/NodeConnection"
import ActionIcon from "./action-icon"
import { NodeType } from "@/entities/Node"
import ActionNode from "./action-node"

export interface IProgram{
    diagram: Diagram;
}

const DynamicDiagramWrapperWithNoSSR = dynamic(
    () => import('./diagram-wrapper'),
    { ssr: false }
)

export default function ProgramDiagram() {
    const intl = useIntl();

    const {diagram, handler} = useProgram();
    const [diagramContent, setDiagramContent] = useState<string>("");

    useEffect(() => {
        handler.initDiagram().catch(er => console.error(er));
    }, [])

    useEffect(() => {
        setDiagramContent(parseDiagram(diagram));
    }, [diagram])

    const editNode = (id: string) => {
        alert(id + " " + diagram.nodes.find(n=>String(n.id) == id)?.text);
    }

    return (
        <div>
            <h2>{intl.formatMessage({id: "playground.program"})}</h2>
            <section style={{height: "calc(100vh - 200px)"}}>
                {diagram.nodes.length > 0 && <ReactFlow nodes={diagram.nodes.map(n=>({
                    id: String(n.id),
                    data: {label: <ActionNode {...{id: String(n.id), type: n.type, text: n.text, onClick: ()=>editNode(String(n.id))}}></ActionNode>},
                    position: {x: 300, y: n.id * 100}
                }))} edges={diagram.connections.map(c => ({
                    id: String(c.id),
                    source: String(c.from),
                    target: String(c.to),
                    type: 'straight',
                    markerEnd: 'arrow',
                    data: {label: c.type != NodeConnectionType.Default ? c.type : ""}
                }))}>
                    <MiniMap />
                    <Controls />
                </ReactFlow>}
            </section>
        </div>
    );
}