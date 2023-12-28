import { BaseOperationSchema } from "./BaseOperationSchema";

export enum NodeType {
    Start = 'start',
    End = 'end',
    Declaration = 'declaration',
    Assignment = 'assignment',
    Input = 'input',
    Output = 'output',
    Condition = 'condition',
    Loop = 'loop',
    Yes = 'yes',
    No = 'no'
}

export interface Node {
    id: string;
    type: NodeType;
    name: string;
    text: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    parentNode?: string;
    yesOperations?: Node[];
    noOperations?: Node[];
    operationId?: number;
}