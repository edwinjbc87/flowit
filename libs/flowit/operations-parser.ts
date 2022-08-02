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

export function parseSchema(schema:ProgramSchema): Project {
    return {
        main: schema.main,
        modules: schema.modules.map(module => ({
            name: module.name,
            diagram: parseModule(module)
        } as Module))
    } as Project;
}

export function calculateNodeDimension(operation:BaseOperationSchema): Dimension {
    const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
    const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
    
    if(operation.type === OperationType.Condition) {
        const condition = operation as ConditionOperationSchema;
        const yesSize = calculateScopeDimension(condition.yes)
        const noSize = calculateScopeDimension(condition.no)
        
        return {
            width: yesSize.width + noSize.width + 3*gap, 
            height: Math.max(yesSize.height, noSize.height) + 2*gap + 130
        };
    } else if(operation.type === OperationType.Loop) {
        const loop = operation as LoopOperationSchema;
        const operationsSize = calculateScopeDimension(loop.operations);

        return {width: operationsSize.width + 2*gap, height: operationsSize.height + 2*gap + 130};
    } else {
        return {width: commonWidth, height: 50 + gap};
    } 
}

export function calculateScopeDimension(operations: BaseOperationSchema[]): Dimension {
    const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
    const commonWidth = parseInt(String(process.env.DIAGRAM_NODE_WIDTH))
    let scopeWidth = 0;
    let scopeHeight = 0;
    let tempSize:Dimension = {width: 0, height: 0};


    operations.forEach(operation => {
        switch (operation.type) {
            case OperationType.Loop: {
                const loop = operation as LoopOperationSchema
                tempSize = calculateNodeDimension(loop)
                break
            }
            case OperationType.Condition: {
                const condition = operation as ConditionOperationSchema
                tempSize = calculateNodeDimension(condition)
            }
            default: {
                scopeWidth = commonWidth
            }
        }

        if(tempSize.width > scopeWidth) {
            scopeWidth = tempSize.width;
        }
        scopeHeight += tempSize.height + gap
    })

    return {width: scopeWidth, height: scopeHeight};
}

function formatTitle(title: string): string {
    return title.length > 30 ? title.substring(0, 27) + '...' : title;
}

export function parseModule(moduleSchema:ModuleSchema): Diagram {
    const dg:Diagram = parseScope(moduleSchema.operations);
    return dg;
}

export function parseScope(operations:BaseOperationSchema[], parentNode?:string, offsetX?: number, offsetY?: number): Diagram {
    const diagram: Diagram = {nodes: [], connections: [], dimension: {width: 0, height: 0}};
    const gap = parseInt(String(process.env.DIAGRAM_NODE_GAP_WIDTH))
    let offset = gap + (offsetY?offsetY:0);
    const opers = operations.sort((a, b) => a.order - b.order);

    for(let i = 0; i < opers.length; i++) {
        let operation = opers[i];
        
        //#region Create node
        const size = calculateNodeDimension(operation)
        const node = {
            text: formatTitle(operation.name), 
            name: operation.name,
            type: String(operation.type) as NodeType,
            id: operation.id,
            x: (offsetX?offsetX:0) + gap,
            y: offset,
            width: size.width,
            height: size.height
        } as Node

        if(!!parentNode) {
            node.parentNode = parseInt(parentNode);
        }

        diagram.nodes.push(node)

        if(size.width > diagram.dimension.width) {
            diagram.dimension.width = size.width;
        }
        //#endregion

        //#region Create connection
        if(i < opers.length - 1) {
            diagram.connections.push({
                id: operation.id,
                type: NodeConnectionType.Default,
                from: operation.id,
                to: operations[i + 1].id
            } as NodeConnection);
        }
        //#endregion

        //#region Create subscope
        if(operation.type === OperationType.Loop) {
            const loop = operation as LoopOperationSchema;

            const dg = parseScope(loop.operations, String(operation.id), 0, 80);
            diagram.nodes = diagram.nodes.concat(dg.nodes);
            diagram.connections = diagram.connections.concat(dg.connections);
        } else if(operation.type === OperationType.Condition) {
            const condition = operation as ConditionOperationSchema;

            const dg = parseScope(condition.yes, String(operation.id), 0, 80);
            diagram.nodes = diagram.nodes.concat(dg.nodes);
            diagram.connections = diagram.connections.concat(dg.connections);

            const dg2 = parseScope(condition.no, String(operation.id), dg.dimension.width + gap, 80);
            diagram.nodes = diagram.nodes.concat(dg2.nodes);
            diagram.connections = diagram.connections.concat(dg2.connections);
        }

        offset += size.height + gap
        //#endregion
    }


    return diagram;
}