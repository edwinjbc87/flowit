import { Diagram } from "@/entities/Diagram"
import styles from '@/styles/program-diagram.module.css'
import { useEffect, useState } from "react"
import useProgram from "@/hooks/useProgram"
import dynamic from 'next/dynamic'
import { FormattedMessage, useIntl } from "react-intl"
import ReactFlow, { MiniMap, Controls, Background, MarkerType } from 'react-flow-renderer'
import { NodeConnection, NodeConnectionType } from "@/entities/NodeConnection"
import ActionIcon from "./action-icon"
import ActionNode from "./action-node"
import ActionSelector from "./action-selector"
import FilesNavigation from "./files-navigation"
import { ProgramSchema } from "@/entities/ProgramSchema"
import { Node, Edge } from 'react-flow-renderer'
import BaseActionConfig from "./action-configs/base-action-config"
import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import DeclarationActionConfig from "./action-configs/declaration-action-config"
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema"
import InputActionConfig from "./action-configs/input-action-config"
import OutputActionConfig from "./action-configs/output-action-config"
import AssignmentActionConfig from "./action-configs/asignment-action-config"
import ConditionActionConfig from "./action-configs/condition-action-config"
import LoopActionConfig from "./action-configs/loop-action-config"
const program = require("@/data/program") as ProgramSchema;

export interface IProgram{
    diagram: Diagram;
}

export default function ProgramDiagram() {
    const intl = useIntl();
    
    const {diagram, handler} = useProgram();
    const [dlgSelAction, setDlgSelAction] = useState(false);
    const [nodes, setNodes] = useState<Node[]>([]);
    const [edges, setEdges] = useState<Edge[]>([]);
    const [selectedOperation, setSelectedOperation] = useState<BaseOperationSchema|null|undefined>(null);

    const editNode = (id: string) => {
        setSelectedOperation(handler.getOperation(id))
    }

    useEffect(() => {
        setNodes(diagram?.nodes.map(n=>{
            const node = {
                id: String(n.id),
                data: {label: <ActionNode {...{id: String(n.id), type: n.type, text: n.text}}></ActionNode>},
                style: {width: n.width, height: n.height},
                position: {x: Number(String(n.x)), y: Number(String(n.y))}
            } as Node
            if(n.parentNode){
                node.parentNode = String(n.parentNode)
            }

            return node;
        }));

        setEdges(diagram?.connections.map(c => ({
            id: String(c.id),
            source: String(c.from),
            target: String(c.to),
            type: 'straight',
            markerEnd: {type: MarkerType.Arrow},
            data: {label: c.type != NodeConnectionType.Default ? c.type : ""}
        })));
    }, [diagram]);

    return (
        <div>
            <FilesNavigation></FilesNavigation>
            <section className={styles.diagram} id="diagram">
                {diagram && diagram.nodes.length > 0 && <ReactFlow defaultNodes={nodes} edges={edges} nodesDraggable={true} onEdgeClick={()=>setDlgSelAction(true)} onNodeClick={(ev, n)=>editNode(n.id)}>
                    <Background />
                    <Controls />
                </ReactFlow>}
            </section>
            <ActionSelector show={dlgSelAction} onDismiss={()=>{setDlgSelAction(false)}}></ActionSelector>
            {selectedOperation && 
                <BaseActionConfig operation={selectedOperation} onDismiss={()=>setSelectedOperation(null)}>
                    {selectedOperation?.type == OperationType.Declaration && <DeclarationActionConfig></DeclarationActionConfig>}
                    {selectedOperation?.type == OperationType.Input && <InputActionConfig></InputActionConfig>}
                    {selectedOperation?.type == OperationType.Output && <OutputActionConfig></OutputActionConfig>}
                    {selectedOperation?.type == OperationType.Assignment && <AssignmentActionConfig></AssignmentActionConfig>}
                    {selectedOperation?.type == OperationType.Condition && <ConditionActionConfig></ConditionActionConfig>}
                    {selectedOperation?.type == OperationType.Loop && <LoopActionConfig></LoopActionConfig>}
                </BaseActionConfig>
            }
        </div>
    );
}