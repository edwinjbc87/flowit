export enum NodeType {
    Start = 'start',
    End = 'end',
    Operation = 'operation',
    Condition = 'condition',
    Subroutine = 'subroutine',
    Loop = 'loop',
}

export interface Node {
    id: number;
    type: NodeType;
    name: string;
}