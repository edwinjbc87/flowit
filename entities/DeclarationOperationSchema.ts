import { BaseOperationSchema } from "./BaseOperationSchema";

export interface VariableSchema {
    name: string;
    type: string;
    value: string;
} 

export interface DeclarationOperationSchema extends BaseOperationSchema {
    variable: VariableSchema;
}