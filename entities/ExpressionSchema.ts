
export enum OperandType {
    Variable = "variable",
    Literal = "literal",
}

export enum ValueType {
    String = "string",
    Number = "number",
    Boolean = "boolean",
    Array = "array",
}

export interface VariableSchema {
    name: string;
    type: ValueType;
    value: any;
} 

export interface OperandSchema {
    type: OperandType;
}

export interface VariableOperandSchema extends OperandSchema {
    name: string;
}

export interface LiteralOperandSchema extends OperandSchema {
    value: string;
    valueType: ValueType;
}

export interface ExpressionSchema {
    operation: string;
    left: OperandSchema;
    right: OperandSchema;
}