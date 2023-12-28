import { BaseOperationSchema, OperationType } from "@/entities/BaseOperationSchema"
import { ConditionOperationSchema } from "@/entities/ConditionOperationSchema"
import { Diagram } from "@/entities/Diagram"
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

    function calculateNodeDimension(operation:BaseOperationSchema): Dimension {
        const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
        const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
        const commonHeight = parseInt(String(process.env.DIAGRAM_NODE_HEIGHT))
        
        if(operation.type === OperationType.Condition) {
            const condition = operation as ConditionOperationSchema;
            const yesSize = calculateScopeDimension(condition.yesOperations)
            const noSize = calculateScopeDimension(condition.noOperations)
            
            return {
                width: yesSize.width + noSize.width + 3*gap, 
                height: Math.max(yesSize.height, noSize.height) + 2*gap + commonHeight
            };
        } else if(operation.type === OperationType.Loop) {
            const loop = operation as LoopOperationSchema;
            return calculateScopeDimension(loop.yesOperations);
        } else {
            return {width: commonWidth, height: commonHeight};
        } 
    }
    
    function calculateScopeDimension(operations: BaseOperationSchema[]): Dimension {
        const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
        const commonHeight = parseInt(String(process.env.DIAGRAM_NODE_HEIGHT))
        const edgeHeight = parseInt(String(process.env.DIAGRAM_NODE_EDGE_HEIGHT))
        const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
        let scopeWidth = commonWidth;
        let scopeHeight = commonHeight;
        let tempSize:Dimension = {width: 0, height: 0};
    
        
        if(operations?.length > 0) {
            operations.forEach((operation, idx) => {
                tempSize = calculateNodeDimension(operation);
        
                if(tempSize.width > scopeWidth) {
                    scopeWidth = tempSize.width;
                }
                scopeHeight += tempSize.height + (idx > 0 ? edgeHeight : 0)
            })
            scopeHeight += 2*gap;
            scopeWidth += 2*gap;
        }
    
        return {width: scopeWidth, height: scopeHeight};
    }
    
    function formatTitle(title: string): string {
        return title.length > 30 ? title.substring(0, 27) + '...' : title;
    }
    
    function parseModule(moduleSchema:ModuleSchema): Diagram {
        return parseScope(moduleSchema.operations, (document.querySelector("#diagram")?.clientWidth) ?? 0);
    }
    
    function parseScope(operations:BaseOperationSchema[], scopeWidth: number, parentNode?:string, offsetY?: number): Diagram {
        const diagram: Diagram = {nodes: [], connections: [], dimension: {width: 0, height: 0}};
        const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
        const edgeHeight = parseInt(String(process.env.DIAGRAM_NODE_EDGE_HEIGHT))
        const commonHeight = parseInt(String(process.env.DIAGRAM_NODE_HEIGHT))

        let offset = (offsetY ?? gap);
        let opers:BaseOperationSchema[] = operations;
    
        for(let i = 0; i < opers.length; i++) {
            let operation = opers[i];

            if(i > 0) offset += edgeHeight;
    
            //#region Create node
            const size = calculateNodeDimension(operation)
            
            const node = {
                text: formatTitle(operation.name), 
                name: operation.name,
                type: String(operation.type) as NodeType,
                id: String(operation.id),
                x: (scopeWidth - size.width) / 2,
                y: offset,
                width: size.width,
                height: size.height
            } as Node;
    
            if(Boolean(parentNode)) {
                node.parentNode = parentNode;
            }
            console.log("Node parsed", node);
            diagram.nodes.push(node)
    
            if(size.width > diagram.dimension.width) {
                diagram.dimension.width = size.width;
            }
            diagram.dimension.height += size.height + (i > 0 ? edgeHeight : 0);
            offset += size.height;
            //#endregion
    
            //#region Create subscope
            if(operation.type === OperationType.Loop) {    
                const dg = parseScope((operation as LoopOperationSchema).yesOperations, size.width, String(operation.id), commonHeight + gap);

                diagram.nodes.splice(diagram.nodes.length, 0, ...dg.nodes);
                diagram.connections.splice(diagram.connections.length, 0, ...dg.connections);                
            } else if(operation.type === OperationType.Condition) {                
                const dg = parseScope((operation as ConditionOperationSchema).yesOperations, (size.width - 3*gap) / 2, String(operation.id+'_yes'), commonHeight + gap);
                const dg2 = parseScope((operation as ConditionOperationSchema).noOperations, (size.width - 3*gap) / 2, String(operation.id+'_no'), commonHeight + gap);
                                
                const yesNode = {
                    text: intl.formatMessage({id: 'actions.yes'}), 
                    name: intl.formatMessage({id: 'actions.yes'}), 
                    type: NodeType.Yes,
                    id: operation.id + '_yes',
                    x: gap,
                    y: commonHeight + gap,
                    width: dg.dimension.width + 2*gap,
                    height: dg.dimension.height + commonHeight + 2*gap,
                    parentNode: String(operation.id)
                };                
    
                const noNode = {
                    text: intl.formatMessage({id: 'actions.no'}), 
                    name: intl.formatMessage({id: 'actions.no'}), 
                    type: NodeType.No,
                    id: operation.id + '_no',
                    x: 2*gap + yesNode.width,
                    y: commonHeight + gap,
                    width: dg2.dimension.width + 2*gap,
                    height: dg2.dimension.height + commonHeight + 2*gap,
                    parentNode: String(operation.id)
                };

                diagram.nodes.push(yesNode);
                diagram.nodes.push(noNode);

                diagram.nodes = diagram.nodes.concat(dg.nodes);
                diagram.connections = diagram.connections.concat(dg.connections);
    
                diagram.nodes = diagram.nodes.concat(dg2.nodes);
                diagram.connections = diagram.connections.concat(dg2.connections);
            
            } 
            //#endregion
    
            //#region Create connection
            if(i > 0) {
                diagram.connections.push({
                    id: uuid(),
                    type: NodeConnectionType.Default,
                    from: String(opers[i - 1].id),
                    to: String(opers[i].id),
                    zIndex: operation.level
                } as NodeConnection);
            }
            //#endregion
        }
    
    
        return diagram;
    }
    
    function flatNodes(_nodes: Node[]): Node[]{
        let nodes: Node[] = [];
        _nodes.forEach(node => {
            nodes.push(node);
            if(node.type === NodeType.Condition || node.type === NodeType.Loop) {
                nodes = nodes.concat(flatNodes(node.yesOperations ?? [])).concat(flatNodes(node.noOperations ?? []));
            }
        })
    
        return nodes;
    }
    
    return {parseModule, parseSchema, flatNodes};
}
