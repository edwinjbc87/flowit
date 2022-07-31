import { OperationType } from "@/entities/BaseOperationSchema";
import { DeclarationOperationSchema } from "@/entities/DeclarationOperationSchema";
import { Diagram } from "@/entities/Diagram";
import { ModuleSchema } from "@/entities/ModuleSchema";
import { Node, NodeType } from "@/entities/Node";
import { NodeConnection, NodeConnectionType } from "@/entities/NodeConnection";
import { ProgramSchema } from "@/entities/ProgramSchema";
import { Project, Module } from "@/entities/Project";

export function parseSchema(schema:ProgramSchema): Project {
    return {
        main: schema.main,
        modules: schema.modules.map(module => ({
            name: module.name,
            diagram: parseModule(module)
        } as Module))
    } as Project;
}

export function parseModule(moduleSchema:ModuleSchema): Diagram {
    const diagram: Diagram = {nodes: [], connections: []};
    const maxLevel = Math.max(...moduleSchema.operations.map(op => op.level));
    const initOffset = 50;
    for(let level = 0; level <= maxLevel; level++) {
        const operations = moduleSchema.operations.filter(op=>op.level === level).sort((a, b) => a.order - b.order);
        for(let i = 0; i < operations.length; i++) {
            let operation = operations[i];
            //#region Create node
            if(operation.type === OperationType.Declaration) {
                let variable = (operation as DeclarationOperationSchema).variable;
                let node = {
                    text: `${variable.name} <- ${variable.value}`, 
                    type: String(operation.type) as NodeType,
                    id: operation.id,
                    x: window.innerWidth / 2 - 200,
                    y: operation.order * 100 + initOffset,
                } as Node;
                diagram.nodes.push(node);
            }
            if(operation.type === OperationType.Start) {
                let node = {
                    text: operation.name, 
                    type: String(operation.type) as NodeType,
                    id: operation.id,
                    x: window.innerWidth / 2 - 200,
                    y: operation.order * 100 + initOffset,
                } as Node;
                diagram.nodes.push(node);
            }
            if(operation.type === OperationType.End) {
                let node = {
                    text: operation.name, 
                    type: String(operation.type) as NodeType,
                    id: operation.id,
                    x: window.innerWidth / 2 - 200,
                    y: operation.order * 100 + initOffset,
                } as Node;
                diagram.nodes.push(node);
            }
            if(operation.type === OperationType.Output) {
                let node = {
                    text: operation.name, 
                    type: String(operation.type) as NodeType,
                    id: operation.id,
                    x: window.innerWidth / 2 - 200,
                    y: operation.order * 100 + initOffset,
                } as Node;
                diagram.nodes.push(node);
            }
            if(operation.type === OperationType.Input) {
                let node = {
                    text: operation.name, 
                    type: String(operation.type) as NodeType,
                    id: operation.id,
                    x: window.innerWidth / 2 - 200,
                    y: operation.order * 100 + initOffset,
                } as Node;
                diagram.nodes.push(node);
            }
            //#endregion

            //#region Create connection
            if(i < operations.length - 1) {
                diagram.connections.push({
                    id: operation.id,
                    type: NodeConnectionType.Default,
                    from: operation.id,
                    to: operations[i + 1].id
                } as NodeConnection);
            }
            //#endregion
        }
    }


    return diagram;
}