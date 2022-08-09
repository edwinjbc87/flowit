import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema"
import { Diagram } from "@/entities/Diagram"
import { OperandSchema } from "@/entities/ExpressionSchema"
import { LoopOperationSchema } from "@/entities/LoopOperationSchema"
import { ModuleSchema } from "@/entities/ModuleSchema"
import { Node, NodeType } from "@/entities/Node"
import { NodeConnection, NodeConnectionType } from "@/entities/NodeConnection"
import { ProgramSchema } from "@/entities/ProgramSchema"
import { Project, Module } from "@/entities/Project"
import { Dimension } from "@/entities/Dimension"
import { useIntl } from "react-intl"
import { v4 as uuid } from "uuid"


export function useProgramParser() {
    const intl = useIntl();

    function parseSchema(schema:ProgramSchema): Project {
        return {
            main: schema.main,
            modules: schema.modules.map(module => ({
                name: module.name,
                diagram: parseModule(module)
            } as Module))
        } as Project;
    }
    
    function calculateNodeDimension(operation:BaseOperationSchema, opers:BaseOperationSchema[]): Dimension {
        const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
        const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
        const commonHeight = parseInt(String(process.env.DIAGRAM_NODE_HEIGHT))
        
        if(operation.type === OperationType.Condition) {
            const condition = operation as ConditionOperationSchema;
            const yesSize = calculateScopeDimension(opers.filter(op=>op.parent == (condition.id+'_yes')))
            const noSize = calculateScopeDimension(opers.filter(op=>op.parent == (condition.id+'_no')))
            
            return {
                width: yesSize.width + noSize.width + 7*gap, 
                height: Math.max(yesSize.height, noSize.height) + 2*gap + 2*commonHeight
            };
        } else if(operation.type === OperationType.Loop) {
            const loop = operation as LoopOperationSchema;
            const operationsSize = calculateScopeDimension(opers.filter(op=>op.parent == String(loop.id)));
    
            return {width: operationsSize.width + 2*gap, height: operationsSize.height + gap + commonHeight};
        } else {
            return {width: commonWidth, height: commonHeight};
        } 
    }
    
    function calculateScopeDimension(operations: BaseOperationSchema[]): Dimension {
        const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
        const commonHeight = parseInt(String(process.env.DIAGRAM_NODE_HEIGHT))
        const edgeHeight = parseInt(String(process.env.DIAGRAM_NODE_EDGE_HEIGHT))
        let scopeWidth = 0;
        let scopeHeight = 0;
        let tempSize:Dimension = {width: 0, height: 0};
    
        
        if(operations.length > 0) {
            operations.forEach((operation, idx) => {
                if(operation.type === OperationType.Condition || operation.type === OperationType.Loop) {
                    tempSize = calculateNodeDimension(operation, operations)
                } else {
                    tempSize = {width: commonWidth, height: commonHeight}
                }
        
                if(tempSize.width > scopeWidth) {
                    scopeWidth = tempSize.width;
                }
                scopeHeight += tempSize.height + (idx > 0 ? edgeHeight : 0)
            })
        } else {
            scopeWidth = commonWidth
            scopeHeight = commonHeight
        }
    
        return {width: scopeWidth, height: scopeHeight};
    }
    
    function formatTitle(title: string): string {
        return title.length > 30 ? title.substring(0, 27) + '...' : title;
    }
    
    function parseModule(moduleSchema:ModuleSchema): Diagram {
        const dg:Diagram = parseScope(moduleSchema.operations, (document.querySelector("#diagram")?.clientWidth)??0);
        return dg;
    }
    
    function parseScope(operations:BaseOperationSchema[], scopeWidth: number, parentNode?:string, offsetY?: number): Diagram {
        const diagram: Diagram = {nodes: [], connections: [], dimension: {width: 0, height: 0}};
        const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
        const edgeHeight = parseInt(String(process.env.DIAGRAM_NODE_EDGE_HEIGHT))
        const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
        const commonHeight = parseInt(String(process.env.DIAGRAM_NODE_HEIGHT))

        let offset = (offsetY?offsetY:0);
        let filteredOperations = operations.filter(operation => (!parentNode && !operation.parent) || operation.parent == parentNode);
        let opers:BaseOperationSchema[] = [];
        try{
            opers = filteredOperations.sort((a, b) => a.order - b.order);
        }catch{
            opers = filteredOperations;
        }
    
        for(let i = 0; i < opers.length; i++) {
            let operation = opers[i];
    
            //#region Create node
            const size = calculateNodeDimension(operation, operations)
            
            const node = {
                text: formatTitle(operation.name), 
                name: operation.name,
                type: String(operation.type) as NodeType,
                id: String(operation.id),
                x: (scopeWidth - size.width) / 2,
                y: offset,
                width: size.width,
                height: size.height
            } as Node
    
            if(!!parentNode) {
                node.parentNode = parentNode;
            }
            console.log("Node parsed", node);
            diagram.nodes.push(node)
    
            if(size.width > diagram.dimension.width) {
                diagram.dimension.width = size.width;
            }
            diagram.dimension.height += size.height + (i > 0 ? edgeHeight : 0);
            offset += size.height + edgeHeight;
            //#endregion
    
            //#region Create subscope
            if(operation.type === OperationType.Loop) {
                const loop = operation as LoopOperationSchema;
    
                const dg = parseScope(operations, size.width, String(operation.id), commonHeight)
                diagram.nodes = diagram.nodes.concat(dg.nodes)
                diagram.connections = diagram.connections.concat(dg.connections)

            } else if(operation.type === OperationType.Condition) {
                const condition = operation as ConditionOperationSchema;
                
                const dg = parseScope(operations, (size.width - 3*gap) / 2, String(operation.id+'_yes'), commonHeight)
                const dg2 = parseScope(operations, (size.width - 3*gap) / 2, String(operation.id+'_no'), commonHeight)
                
                diagram.nodes.push({
                    text: intl.formatMessage({id: 'actions.yes'}), 
                    name: intl.formatMessage({id: 'actions.yes'}), 
                    type: NodeType.Yes,
                    id: operation.id + '_yes',
                    x: gap,
                    y: commonHeight,
                    width: dg.dimension.width + 2*gap,
                    height: dg.dimension.height + gap + commonHeight,
                    parentNode: String(operation.id)
                })
    
                diagram.nodes.push({
                    text: intl.formatMessage({id: 'actions.no'}), 
                    name: intl.formatMessage({id: 'actions.no'}), 
                    type: NodeType.No,
                    id: operation.id + '_no',
                    x: 4*gap + dg.dimension.width,
                    y: commonHeight,
                    width: dg2.dimension.width + 2*gap,
                    height: dg2.dimension.height + gap + commonHeight,
                    parentNode: String(operation.id)
                })

                diagram.nodes = diagram.nodes.concat(dg.nodes);
                diagram.connections = diagram.connections.concat(dg.connections);
    
                diagram.nodes = diagram.nodes.concat(dg2.nodes);
                diagram.connections = diagram.connections.concat(dg2.connections);
            
            } 
            //#endregion
    
            //#region Create connection
            if(i < opers.length - 1) {
                diagram.connections.push({
                    id: uuid(),
                    type: NodeConnectionType.Default,
                    from: opers[i].id,
                    to: opers[i + 1].id,
                    zIndex: operation.level
                } as NodeConnection);
            }
            //#endregion
        }
    
    
        return diagram;
    }
    
    
    return {parseModule, parseSchema}
}
