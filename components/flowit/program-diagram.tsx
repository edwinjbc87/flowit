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
import ActionSelector from "./action-selector"
import FilesNavigation from "./files-navigation"
import { ProgramSchema } from "@/entities/ProgramSchema"
const program = require("@/data/program") as ProgramSchema;

export interface IProgram{
    diagram: Diagram;
}

export default function ProgramDiagram() {
    const intl = useIntl();

    const {diagram} = useProgram();
    const [dlgSelAction, setDlgSelAction] = useState(false);
    

    const editNode = (id: string) => {
        alert(id + " " + diagram?.nodes.find(n=>String(n.id) == id)?.text)
    }

    return (
        <div>
            <FilesNavigation></FilesNavigation>
            <section className={styles.diagram}>
                {diagram && diagram.nodes.length > 0 && <ReactFlow defaultNodes={diagram.nodes.map(n=>({
                    id: String(n.id),
                    data: {label: <ActionNode {...{id: String(n.id), type: n.type, text: n.text}}></ActionNode>},
                    style: {width: n.width},
                    position: {x: Number(String(n.x)), y: Number(String(n.y))},
                }))} edges={diagram.connections.map(c => ({
                    id: String(c.id),
                    source: String(c.from),
                    target: String(c.to),
                    type: 'straight',
                    markerEnd: {type: MarkerType.Arrow},
                    data: {label: c.type != NodeConnectionType.Default ? c.type : ""}
                }))} nodesDraggable={true} onEdgeClick={()=>setDlgSelAction(true)} onNodeDoubleClick={(ev, n)=>editNode(n.id)}>
                    <Background />
                    <Controls />
                </ReactFlow>}
            </section>
            <ActionSelector show={dlgSelAction} onDismiss={()=>{setDlgSelAction(false)}}></ActionSelector>
        </div>
    );
}