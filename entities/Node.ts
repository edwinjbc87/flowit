export enum NodeType {
    Start = 'start',
    End = 'end',
    Operation = 'operation',
    Condition = 'condition',
    Asignment = 'asignment',
    Loop = 'loop',
}

export interface Node {
    id: number;
    type: NodeType;
    name: string;
    text: string;
}