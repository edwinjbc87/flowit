export enum NodeType {
    Start = 'start',
    End = 'end',
    Condition = 'condition',
    Asignment = 'asignment',
    Loop = 'loop',
    Input = 'input',
    Output = 'output',
}

export interface Node {
    id: number;
    type: NodeType;
    name: string;
    text: string;
}