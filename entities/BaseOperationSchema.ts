export enum OperationType {
    Start = 'start',
    End = 'end',
    Declaration = 'declaration',
    Assignment = 'assignment',
    Input = 'input',
    Output = 'output',
    Condition = 'condition',
    Loop = 'loop',
}

export interface BaseOperationSchema {
    id: number;
    name: string;
    type: OperationType;
    order: number;
    level: number;
    parent?: String;
}