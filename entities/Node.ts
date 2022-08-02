export enum NodeType {
    Start = 'start',
    End = 'end',
    Declaration = 'declaration',
    Assignment = 'assignment',
    Input = 'input',
    Output = 'output',
    Condition = 'condition',
    Loop = 'loop',
}

export interface Node {
    id: number;
    type: NodeType;
    name: string;
    text: string;
    x?: number;
    y?: number;
    width?: number;
    height?: number;
    parentNode?: number;
}