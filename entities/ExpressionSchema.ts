
export enum OperandType {
    Variable = "variable",
    Literal = "literal",
}

export enum ValueType {
    String = "string",
    Integer = "integer",
    Number = "number",
    Boolean = "boolean",
    Array = "array",
}

export interface VariableSchema {
    name: string;
    type: ValueType;
    value: ExpressionSchema;
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
    left: ExpressionSchema | any;
    right?: ExpressionSchema | any;
}