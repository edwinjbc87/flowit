import { Diagram } from "@/entities/Diagram"
import styles from '@/styles/program-diagram.module.css'
import { useEffect, useState } from "react"
import useProgram from "@/hooks/useProgram"
import dynamic from 'next/dynamic'
import { FormattedMessage, useIntl } from "react-intl"
import ReactFlow, { MiniMap, Controls, Background, MarkerType } from 'react-flow-renderer'
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

    useEffect(() => {
        handler.initDiagram().catch(er => console.error(er));
    }, [])

    const editNode = (id: string) => {
        alert(id + " " + diagram.nodes.find(n=>String(n.id) == id)?.text);
    }

    return (
        <div>
            <h2>{intl.formatMessage({id: "playground.program"})}</h2>
            <section className={styles.diagram}>
                {diagram.nodes.length > 0 && <ReactFlow defaultNodes={diagram.nodes.map(n=>({
                    id: String(n.id),
                    data: {label: <ActionNode {...{id: String(n.id), type: n.type, text: n.text}}></ActionNode>},
                    position: {x: 300, y: n.id * 100},
                }))} edges={diagram.connections.map(c => ({
                    id: String(c.id),
                    source: String(c.from),
                    target: String(c.to),
                    type: 'straight',
                    markerEnd: {type: MarkerType.Arrow},
                    data: {label: c.type != NodeConnectionType.Default ? c.type : ""}
                }))} nodesDraggable={true} onEdgeClick={()=>alert("Edge Clicked")} onNodeDoubleClick={(ev, n)=>editNode(n.id)}>
                    <Background />
                    <Controls />
                </ReactFlow>}
            </section>
        </div>
    );
}