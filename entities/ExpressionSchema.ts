
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
    Any = "any",
}

export type ExpressionValue = string | number | boolean | Array<string | number | boolean>;

export interface VariableSchema {
    name: string;
    type: ValueType;
    value: ExpressionSchema|any;
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
    params: ExpressionSchema[];
}