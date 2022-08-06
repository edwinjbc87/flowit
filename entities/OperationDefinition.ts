import { ValueType } from "./ExpressionSchema";

export interface OperationDefinition {
    name: string;
    returnType: ValueType;
    unlimitedParameters?: ParameterDefinition;
    parameters?: ParameterDefinition[];
    description: string;
}

export interface ParameterDefinition {
    name: string;
    type: ValueType;
}